import { DynamoDB, Credentials, config as awsConfig, Request, AWSError } from 'aws-sdk';
import { JournalRecord } from '../../../domain/journal-record';
import { chunk, mean } from 'lodash';
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
  console.log(`AVERAGE JOURNAL SIZE BEING SAVED: ${calculateAverageJournalSizeInKb(journals)}KB`);
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

const calculateAverageJournalSizeInKb = (journals: JournalRecord[]) => {
  const averageBytes = journals
    .reduce(
      (progress, journal) => {
        const newItemCount = progress.count + 1;
        const differential = (JSON.stringify(journal).length - progress.average) / newItemCount;
        return {
          count: newItemCount,
          average: progress.average + differential,
        };
      },
      { count: 0, average: 0 },
    ).average;
  return Math.floor(averageBytes / 1024);
};

const submitSaveRequests = async (
  writeRequests: Request<DynamoDB.DocumentClient.BatchWriteItemOutput, AWSError>[],
  tableName: string,
) => {
  let totalUnprocessedWrites = 0;
  let requestRuntimes: number[] = [];
  for (const writeRequest of writeRequests) {
    const requestStartHrtime = process.hrtime();
    const result = await writeRequest.promise();
    const requestEndHrtime = process.hrtime(requestStartHrtime);
    const requestDurationMs = Math.floor(((requestEndHrtime[0] * 1e9) + requestEndHrtime[1]) / 1e6);
    requestRuntimes = [...requestRuntimes, requestDurationMs];
    if (result.UnprocessedItems && result.UnprocessedItems[tableName]) {
      const unprocessedWriteCount = result.UnprocessedItems[tableName].length;
      totalUnprocessedWrites += unprocessedWriteCount;
    }
  }
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
  };

  let scannedItems: Partial<JournalRecord>[] = [];
  let lastEvaluatedKey: Key | undefined;
  do {
    const paramsForRequest = lastEvaluatedKey !== undefined ?
      { ...params, ExclusiveStartKey: lastEvaluatedKey }
      : { ...params };
    const result = await ddb.scan(paramsForRequest).promise();
    scannedItems = [...scannedItems, ...result.Items as Partial<JournalRecord>[]];
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey !== undefined);

  return scannedItems;
};
