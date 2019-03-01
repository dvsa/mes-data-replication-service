import { DynamoDB, Credentials, config as awsConfig } from 'aws-sdk';
import { getStaffNumberHashMappings } from '../journal-repository';
import * as dotenv from 'dotenv';
import { bootstrapConfig } from '../../../config/config';

let ddb: DynamoDB.DocumentClient;

export const dynamoDBIntegrationTests = () => {
  describe('DynamoDB integration tests', () => {

    beforeAll(() => {
      process.env.NODE_ENV = 'int';
      process.env.IS_OFFLINE = 'true';
      dotenv.config();
      return bootstrapConfig();
    });

    describe('getStaffNumberHashMappings', () => {
      it('should fetch every staff number and the hash of their journal from DynamoDB', async () => {
        await putStaffNumberAndHash('123', 'abc');
        await putStaffNumberAndHash('456', 'xyz');

        const result = await getStaffNumberHashMappings();

        expect(result.length).toBe(2);
        expect(result).toContain({ staffNumber: '123', hash: 'abc' });
        expect(result).toContain({ staffNumber: '456', hash: 'xyz' });
      });
    });
  });
};

const putStaffNumberAndHash = (staffNumber: string, hash: string) => {
  awsConfig.update({
    region: 'localhost',
    credentials: new Credentials('akid', 'secret', 'session'),
  });
  ddb = new DynamoDB.DocumentClient({ endpoint: 'http://localhost:8000', region: 'localhost' });
  return ddb.put({
    TableName: 'journals',
    Item: {
      staffNumber,
      hash,
    },
  }).promise();
};
