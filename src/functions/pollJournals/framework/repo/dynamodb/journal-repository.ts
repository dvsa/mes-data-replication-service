import { DynamoDB, Credentials, config as awsConfig } from 'aws-sdk';
import { Agent } from 'https';
import { JournalRecord } from '../../../domain/journal-record';
import { chunk, get, mean } from 'lodash';
import { config } from '../../config/config';
import { Key } from 'aws-sdk/clients/dynamodb';
import moment = require('moment');

let dynamoDocumentClient: DynamoDB.DocumentClient;
const getDynamoClient = () => {
  if (!dynamoDocumentClient) {
    if (config().isOffline) {
      const localRegion = 'localhost';
      awsConfig.update({
        region: localRegion,
        credentials: new Credentials('akid', 'secret', 'session'),
      });
      dynamoDocumentClient = new DynamoDB.DocumentClient({ endpoint: 'http://localhost:8000', region: localRegion });
    } else {
      // enable HTTP keep alive on DynamoDB API calls - improves performance
      // (since TCP connect can take longer than the API call itself, and we are issuing multiple API calls)
      const sslAgent = new Agent({
        keepAlive: true,
        maxSockets: 50,
        rejectUnauthorized: true,
      });
      awsConfig.update({
        httpOptions:{
          agent: sslAgent,
        },
      });
      dynamoDocumentClient = new DynamoDB.DocumentClient();
    }
  }
  return dynamoDocumentClient;
};

/**
 * Saves as many of the changed journals as possible to DynamoDB. Writes in batches, at a throttled rate, and aborts if
 * about to overrun.
 *
 * @param journals The changed journals to save
 * @param startTime The date and time the Lambda function started
 */
export const saveJournals = async (journals: JournalRecord[], startTime: Date): Promise<void> => {
  if (journals.length > 0) {
    console.log(`STARTING SAVE: ${new Date()}`);
    const tableName = config().journalDynamodbTableName;
    const maxBatchWriteRequests = 25;
    const journalWriteBatches = chunk(journals, maxBatchWriteRequests);
    const writeRequests = journalWriteBatches.map((batch) => {
      return {
        RequestItems: {
          [tableName]: batch.map(journalWrapper => ({
            PutRequest: {
              Item: journalWrapper,
            },
          })),
        },
        ReturnConsumedCapacity: 'TOTAL',
      } as DynamoDB.DocumentClient.BatchWriteItemInput;
    });

    const { totalUnprocessedWrites, averageRequestRuntime } =
      await submitSaveRequests(writeRequests, tableName, startTime);
    console.log(`AVERAGE REQUEST TOOK ${averageRequestRuntime}ms`);
    console.log(`END SAVE: ${new Date()}, ${totalUnprocessedWrites} WRITES FAILED`);
  } else {
    console.log(`NO SAVE NEEDED`);
  }
};

/**
 * Saves as many of the changed journals as possible to DynamoDB. Writes in batches, at a throttled rate, and aborts if
 * about to overrun.
 * @param writeRequests The dynamo write requests
 * @param tableName The dynamo table name
 * @param startTime The date and time the Lambda function started
 * @returns { totalUnprocessedWrites, averageRequestRuntime }
 *   Total number of writes that were rejected (due to throttling)
 *   Average amount of time (in ms) that each batch write took
 */
const submitSaveRequests = async (
  writeRequests: DynamoDB.DocumentClient.BatchWriteItemInput[],
  tableName: string,
  startTime: Date,
) => {
  const ddb = getDynamoClient();
  let totalUnprocessedWrites = 0;
  let requestRuntimes: number[] = [];
  let totalConsumedCapacity = 0;

  /*
   * Amount of time (in milliseconds), to throttle Journal writes over.
   * Slowing down the writes means using less DynamoDB write capcity units (WCU's) per second,
   * reducing the amount of capacity that needs to be provisioned. If we exceed the capacity (plus burst capacity)
   * then some of the writes will be refused by Dynamo (tracked as unprecessed items).
   *
   * Upon testing in "perf", which has 50 WCUs, 2083 journals (roughly 4500 WCUs) can be successfully written
   * over 4 seconds if there are no other writes for the previous 5 minutes.
   */
  const totalSaveDuration = 4 * 1000;

  const sleepDuration = totalSaveDuration / writeRequests.length;
  for (const writeRequest of writeRequests) {
    if (runOutOfTime(startTime)) {
      // this is a good point to raise an alert
      console.log('** No more time left, aborting any further writes! **');
      break;
    }

    const start = process.hrtime();
    const result = await ddb.batchWrite(writeRequest).promise();
    const timeTaken = process.hrtime(start);
    totalConsumedCapacity += get(result, 'ConsumedCapacity[0].CapacityUnits', 0);
    const duration = Math.floor(((timeTaken[0] * 1e9) + timeTaken[1]) / 1e6);
    requestRuntimes = [...requestRuntimes, duration];
    if (result.UnprocessedItems && result.UnprocessedItems[tableName]) {
      const unprocessedWriteCount = result.UnprocessedItems[tableName].length;
      totalUnprocessedWrites += unprocessedWriteCount;
      console.log(`${unprocessedWriteCount} writes failed/throttled`);
    }

    await sleep(sleepDuration);
  }

  console.log(`all journals written, took ${totalConsumedCapacity} WCUs`);
  const averageRequestRuntime = mean(requestRuntimes);
  return { totalUnprocessedWrites, averageRequestRuntime };
};

/**
 * Synchronous sleep.
 * @param ms The amount of milliseconds to sleep for
 */
const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Determine whether we have run out of time to write any more journals to dynamo.
 * @param startTime The date and time the Lambda function started
 * @returns true if we have run out of time
 */
const runOutOfTime = (startTime: Date): boolean => {
  const now = moment();
  /*
   * Allow 60 seconds for each lambda execution run, minus a couple of seconds leniency.
   * Change this amount if changing how often this poller runs.
   */
  const endOfTime = moment(startTime).add({ seconds: 58 });
  return now.isAfter(endOfTime);
};

/**
 * Get the staff numbers and journal hashes, for all examiners.
 * @returns A Partial objecdt with staffNumber and hash populated
 */
export const getStaffNumbersWithHashes = async (): Promise<Partial<JournalRecord>[]> => {
  const ddb = getDynamoClient();
  const tableName = config().journalDynamodbTableName;

  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: tableName,
    ProjectionExpression: 'staffNumber,#hash',
    ExpressionAttributeNames: {
      '#hash': 'hash',
    },
    ReturnConsumedCapacity: 'TOTAL',
  };

  let scannedItems: Partial<JournalRecord>[] = [];
  let lastEvaluatedKey: Key | undefined;
  let totalConsumedCapacity = 0;
  do {
    const paramsForRequest = lastEvaluatedKey !== undefined ?
      { ...params, ExclusiveStartKey: lastEvaluatedKey }
      : { ...params };
    const start = process.hrtime();
    const result = await ddb.scan(paramsForRequest).promise();
    const timeTaken = process.hrtime(start);
    const duration = Math.floor(((timeTaken[0] * 1e9) + timeTaken[1]) / 1e6);
    scannedItems = [...scannedItems, ...result.Items as Partial<JournalRecord>[]];
    console.log(`scan of ${result.Items.length} journal hashes took ${duration} ms`);
    totalConsumedCapacity += get(result, 'ConsumedCapacity.CapacityUnits', 0);
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey !== undefined);

  console.log(`read ${scannedItems.length} journal hashes, took ${totalConsumedCapacity} RCUs`);
  return scannedItems;
};
