import { DynamoDB, config as awsConfig, Credentials } from 'aws-sdk';
import { getStaffNumbersWithHashes } from '../journal-repository';
import { bootstrapConfig } from '../../../config/config';
import * as dotenv from 'dotenv';

let ddb: DynamoDB.DocumentClient;

export const dynamoDBIntegrationTests = () => {
  describe('DynamoDB integration tests', () => {

    beforeAll(() => {
      awsConfig.update({
        region: 'localhost',
        credentials: new Credentials('akid', 'secret', 'session'),
      });
      ddb = new DynamoDB.DocumentClient({ endpoint: 'http://localhost:8000', region: 'localhost' });
      process.env.IS_OFFLINE = 'true';
      dotenv.config();
      return bootstrapConfig();
    });

    describe('getStaffNumbersWithHashes', () => {
      it('should fetch every staff number and the hash of their journal from DynamoDB', async () => {
        await putStaffNumberAndHash('123', 'abc');
        await putStaffNumberAndHash('456', 'xyz');

        const result = await getStaffNumbersWithHashes();

        expect(result.length).toBe(2);
        expect(result).toContain({ staffNumber: '123', hash: 'abc' });
        expect(result).toContain({ staffNumber: '456', hash: 'xyz' });
      });
    });
  });
};

const putStaffNumberAndHash = (staffNumber: string, hash: string) => {
  return ddb.put({
    TableName: 'journals',
    Item: {
      staffNumber,
      hash,
    },
  }).promise();
};
