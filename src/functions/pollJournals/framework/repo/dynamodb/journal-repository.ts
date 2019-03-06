import { DynamoDB, Credentials, config as awsConfig } from 'aws-sdk';
import { JournalWrapper } from '../../../domain/journal-wrapper';
import { chunk } from 'lodash';
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

export const saveJournals = async (journals: JournalWrapper[]): Promise<void> => {
  console.log(`STARTING SAVE: ${new Date()}`);
  const ddb = getDynamoClient();
  const tableName = config().journalDynamodbTableName;
  const maxBatchWriteRequests = 25;
  const journalWriteBatches = chunk(journals, maxBatchWriteRequests);

  const averageJournalSize = journals
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
  console.log(`AVERAGE JOURNAL SIZE BEING SAVED: ${averageJournalSize} BYTES`);

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

  let totalUnprocessedWrites = 0;
  for (const writeRequest of writeRequests) {
    const result = await writeRequest.promise();
    if (result.UnprocessedItems && result.UnprocessedItems[tableName]) {
      const unprocessedWriteCount = result.UnprocessedItems[tableName].length;
      totalUnprocessedWrites += unprocessedWriteCount;
    }
  }
  console.log(`END SAVE: ${new Date()}, ${totalUnprocessedWrites} WRITES FAILED`);
};

export const getStaffNumbersWithHashes = async (): Promise<Partial<JournalWrapper>[]> => {
  const ddb = getDynamoClient();
  const tableName = config().journalDynamodbTableName;

  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: tableName,
    ProjectionExpression: 'staffNumber,#hash',
    ExpressionAttributeNames: {
      '#hash': 'hash',
    },
  };

  let scannedItems: Partial<JournalWrapper>[] = [];
  let lastEvaluatedKey: Key | undefined;
  do {
    const paramsForRequest = lastEvaluatedKey !== undefined ?
      { ...params, ExclusiveStartKey: lastEvaluatedKey }
      : { ...params };
    const result = await ddb.scan(paramsForRequest).promise();
    scannedItems = [...scannedItems, ...result.Items as Partial<JournalWrapper>[]];
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey !== undefined);

  return scannedItems;
};
