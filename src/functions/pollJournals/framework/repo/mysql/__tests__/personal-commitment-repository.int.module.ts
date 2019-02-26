import { getPersonalCommitments } from '../personal-commitment-repository';
import * as mysql from 'mysql';
import { loadTestFile } from './test-data-utils';
const importer = require('mysql-import');

export const personalCommitmentIntegrationTests = () => {
  describe('PersonalCommitmentRepository', () => {
    let connectionPool: mysql.Pool;
    let importerInstance: any;

    beforeAll(() => {
      connectionPool = mysql.createPool({
        host: 'localhost',
        database: 'tarsreplica',
        user: 'root',
        password: 'Pa55word1',
      });
      importerInstance = importer.config({
        host: 'localhost',
        database: 'tarsreplica',
        user: 'root',
        password: 'Pa55word1',
      });
    });

    it('should retrieve an active personal commitment', async () => {
      await loadTestFile(importerInstance, 'personal-commitment/001-current-personal-commitment.sql');

      const commitments = await getPersonalCommitments(connectionPool);
      expect(commitments).toEqual([
        {
          examinerId: 1,
          personalCommitment: {
            activityCode: '081',
            activityDescription: 'Annual Leave',
            commitmentId: 9,
            endDate: '31/12/4000',
            endTime: '23:59:00',
            startDate: '26/02/2019',
            startTime: '08:00:00',
          },
        },
      ]);
    });
  });
};
