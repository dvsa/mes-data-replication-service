import { DynamoDB, Credentials, config as awsConfig, Request, AWSError } from 'aws-sdk';
import { JournalRecord } from '../../../domain/journal-record';
import { chunk, get, mean } from 'lodash';
import { config } from '../../config/config';
import { Key } from 'aws-sdk/clients/dynamodb';

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
      dynamoDocumentClient = new DynamoDB.DocumentClient();
    }
  }
  return dynamoDocumentClient;
};

export const saveJournals = async (journals: JournalRecord[]): Promise<void> => {
  console.log(`STARTING SAVE: ${new Date()}`);
  const ddb = getDynamoClient();
  const tableName = config().journalDynamodbTableName;
  const maxBatchWriteRequests = 25;
  const journalWriteBatches = chunk(journals, maxBatchWriteRequests);
  const writeRequests = journalWriteBatches.map((batch) => {
    const params = {
      RequestItems: {
        [tableName]: batch.map(journalWrapper => ({
          PutRequest: {
            Item: journalWrapper,
          },
        })),
      },
      ReturnConsumedCapacity: 'TOTAL',
    };
    return ddb.batchWrite(params);
  });

  const { totalUnprocessedWrites, averageRequestRuntime } = await submitSaveRequests(writeRequests, tableName);
  console.log(`AVERAGE REQUEST TOOK ${averageRequestRuntime}ms`);
  console.log(`END SAVE: ${new Date()}, ${totalUnprocessedWrites} WRITES FAILED`);
};

const submitSaveRequests = async (
  writeRequests: Request<DynamoDB.DocumentClient.BatchWriteItemOutput, AWSError>[],
  tableName: string,
) => {
  let totalUnprocessedWrites = 0;
  let requestRuntimes: number[] = [];
  let totalConsumedCapacity = 0;
  for (const writeRequest of writeRequests) {

    const start = process.hrtime();
    const result = await writeRequest.promise();
    const timeTaken = process.hrtime(start);
    totalConsumedCapacity += get(result, 'ConsumedCapacity[0].CapacityUnits', 0);
    const duration = Math.floor(((timeTaken[0] * 1e9) + timeTaken[1]) / 1e6);
    console.log(`batch write of journals took ${duration} ms`);

    requestRuntimes = [...requestRuntimes, duration];
    if (result.UnprocessedItems && result.UnprocessedItems[tableName]) {
      const unprocessedWriteCount = result.UnprocessedItems[tableName].length;
      totalUnprocessedWrites += unprocessedWriteCount;
      console.log(`${unprocessedWriteCount} writes failed/throttled`);
    }
  }
  console.log(`all journals written, took ${totalConsumedCapacity} WCUs`);
  const averageRequestRuntime = mean(requestRuntimes);
  return { totalUnprocessedWrites, averageRequestRuntime };
};

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
