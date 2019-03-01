import { DynamoDB, Credentials, config as awsConfig } from 'aws-sdk';
import { JournalWrapper } from '../../../domain/journal-wrapper';
import { chunk } from 'lodash';
import { config } from '../../config/config';

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

  const writePromises = journalWriteBatches.map((batch) => {
    const params = {
      RequestItems: {
        [tableName]: batch.map(journalWrapper => ({
          PutRequest: {
            Item: journalWrapper,
          },
        })),
      },
    };
    return ddb.batchWrite(params).promise();
  });
  await Promise.all(writePromises);
  console.log(`END SAVE: ${new Date()}`);
};

export const getStaffNumbersWithHashes = async (): Promise<Partial<JournalWrapper>[]> => {
  const ddb = getDynamoClient();
  const tableName = config().journalDynamodbTableName;

  const result = await ddb.scan({
    TableName: tableName,
    ProjectionExpression: 'staffNumber,#hash',
    ExpressionAttributeNames: {
      '#hash': 'hash',
    },
  }).promise();

  return result.Items as Partial<JournalWrapper>[];
};
