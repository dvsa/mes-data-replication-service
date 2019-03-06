import { getStaffNumbersWithHashes } from '../journal-repository';
import * as config from '../../../config/config';
import * as AWSMock from 'aws-sdk-mock';
import { dummyConfig } from '../../../config/__mocks__/config';

describe('JournalRepository', () => {
  describe('getStaffNumbersWithHashes', () => {
    beforeEach(() => {
      spyOn(config, 'config').and.returnValue(dummyConfig);
    });

    it('should scan the table until all examiners have been retrieved', async () => {
      AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params, cb) => {
        let ddbResp;
        if (!params.ExclusiveStartKey) {
          ddbResp = {
            Items: [
              { staffNumber: '1', hash: 'a' },
              { staffNumber: '2', hash: 'b' },
            ],
            LastEvaluatedKey: '2',
          };
        } else {
          ddbResp = {
            Items: [
              { staffNumber: '3', hash: 'c' },
              { staffNumber: '4', hash: 'd' },
            ],
          };
        }
        cb(null, ddbResp);
      });

      const result = await getStaffNumbersWithHashes();

      expect(result).toEqual([
        { staffNumber: '1', hash: 'a' },
        { staffNumber: '2', hash: 'b' },
        { staffNumber: '3', hash: 'c' },
        { staffNumber: '4', hash: 'd' },
      ]);
    });
  });
});
