import { config } from '../../config';
import { DynamoDB } from 'aws-sdk';

let dynamoDocumentClient: DynamoDB.DocumentClient;
const getDynamoClient = () => {
  if (!dynamoDocumentClient) {
    dynamoDocumentClient = config().isOffline
      ? new DynamoDB.DocumentClient({ endpoint: 'http://localhost:8000' })
      : new DynamoDB.DocumentClient();
  }
  return dynamoDocumentClient;
};

export const getCachedExaminers = async (): Promise<string[]> => {
  const ddb = getDynamoClient();
  const scanParams = {
    TableName: config().usersDynamodbTableName,
    ProjectionExpression: 'staffNumber',
  };
  const scanResult = await ddb.scan(scanParams).promise();

  if (!scanResult.Items) {
    return [];
  }

  return scanResult.Items.map(item => item.staffNumber);
};

export const updateStaffNumberCache = async (cachedStaffNumbers: string[], uncachedStaffNumbers: string[]) => {

};
