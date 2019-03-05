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

  for (let requestInd = 0; requestInd < writeRequests.length; requestInd += 1) {
    console.log(`SUBMITTING BATCH ${requestInd} AT ${new Date()}`);
    const result = await writeRequests[requestInd].promise();
    if (result.UnprocessedItems && result.UnprocessedItems[tableName]) {
      console.log(`BATCH ${requestInd} had ${result.UnprocessedItems[tableName].length} UNPROCESSED ITEMS`);
    }
    console.log(`FINISHED BATCH ${requestInd} AT ${new Date()}`);
  }
  console.log(`END SAVE: ${new Date()}`);
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
