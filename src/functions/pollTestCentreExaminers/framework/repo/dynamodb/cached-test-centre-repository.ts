import { config as awsConfig, Credentials, DynamoDB } from 'aws-sdk';
import { customMetric } from '@dvsa/mes-microservice-common/application/utils/logger';
import { chunk } from 'lodash';

import { config } from '../../config';
import { TestCentreDetail } from '../../../../../common/application/models/test-centre';

let dynamoDocumentClient: DynamoDB.DocumentClient;
const getDynamoClient: () => DynamoDB.DocumentClient = () => {
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

export const getCachedTestCentreExaminers = async (): Promise<TestCentreDetail[]> => {
  const ddb: DynamoDB.DocumentClient = getDynamoClient();
  const scanParams = {
    TableName: config().testCentreDynamodbTableName,
  };
  const scanResult = await ddb.scan(scanParams).promise();

  if (!scanResult.Items) {
    return [];
  }

  return scanResult.Items as TestCentreDetail[];
};

export const cacheTestCentreExaminers = async (testCentreExaminers: TestCentreDetail[]): Promise<void> => {
  const ddb: DynamoDB.DocumentClient = getDynamoClient();
  const tableName: string = config().testCentreDynamodbTableName;

  const maxBatchWriteRequests: number = 25;
  const testCentreWriteBatches: TestCentreDetail[][] = chunk(testCentreExaminers, maxBatchWriteRequests);

  const writePromises = testCentreWriteBatches.map((batch: TestCentreDetail[]) => {
    const params = {
      RequestItems: {
        [tableName]: batch.map((testCentreExaminer: TestCentreDetail) => ({
          PutRequest: {
            Item: testCentreExaminer,
          },
        })),
      },
    };
    return ddb.batchWrite(params).promise();
  });

  await Promise.all(writePromises);

  customMetric('TestCentreRowAdded', 'Number of Test Centre rows added to Dynamo', testCentreExaminers.length);
};

export const unCacheTestCentreExaminers = async (staffNumbers: string[]): Promise<void> => {
  const ddb: DynamoDB.DocumentClient = getDynamoClient();
  const tableName: string = config().testCentreDynamodbTableName;

  const deletePromises = staffNumbers.map((staffNumber: string) => {
    const deleteParams = {
      TableName: tableName,
      Key: {
        staffNumber,
      },
    };
    return ddb.delete(deleteParams).promise();
  });

  await Promise.all(deletePromises);

  customMetric('TestCentreRowRemoved', 'Number of Test Centre rows removed from Dynamo', staffNumbers.length);
};
