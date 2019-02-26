/* tslint:disable:max-line-length */
import { getPersonalCommitments } from '../personal-commitment-repository';
import * as mysql from 'mysql';
import { loadTestFile } from './test-data-utils';
import * as moment from 'moment';
import { query } from '../../../../../../common/framework/mysql/database';

export const personalCommitmentIntegrationTests = () => {
  describe('PersonalCommitmentRepository', () => {
    let connectionPool: mysql.Pool;

    beforeAll(() => {
      connectionPool = mysql.createPool({
        host: 'localhost',
        database: 'tarsreplica',
        user: 'root',
        password: 'Pa55word1',
      });
    });

    afterEach(async () => {
      await truncateTables();
    });

    afterAll(() => {
      connectionPool.end();
    });

    it('should retrieve a personal commitment that is today', async () => {
      await loadTestFile('personal-commitment/001-today.sql');

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
            startDate: moment().format('DD/MM/YYYY'),
            startTime: '08:00:00',
          },
        },
      ]);
    });

    it('should retrieve a personal commitment ending at the last moment of the time window', async () => {
      await loadTestFile('personal-commitment/002-last-moment-of-window.sql');

      const commitments = await getPersonalCommitments(connectionPool);
      expect(commitments.length).toBe(1);
      expect(commitments).toEqual([
        {
          examinerId: 1,
          personalCommitment: {
            activityCode: '081',
            activityDescription: 'Annual Leave',
            commitmentId: 9,
            endDate: '31/12/4000',
            endTime: '23:59:00',
            startDate: moment().startOf('day')
              .add(13, 'day').add(23, 'hour').add(59, 'minute').add(59, 'second')
              .format('DD/MM/YYYY'),
            startTime: moment().startOf('day')
              .add(13, 'day').add(23, 'hour').add(59, 'minute').add(59, 'second')
              .format('HH:mm:ss'),
          },
        },
      ]);
    });

    it('should not retrieve personal commitments that are outside the time window', async () => {
      await loadTestFile('personal-commitment/003-first-moment-outside-window.sql');

      const commitments = await getPersonalCommitments(connectionPool);
      expect(commitments.length).toBe(0);
    });
  });
};

const truncateTables = async () => {
  const truncConn = mysql.createConnection({
    host: 'localhost',
    database: 'tarsreplica',
    user: 'root',
    password: 'Pa55word1',
  });
  await query(truncConn, 'TRUNCATE TABLE INDIVIDUAL');
  await query(truncConn, 'TRUNCATE TABLE EXAMINER');
  await query(truncConn, 'TRUNCATE TABLE EXAMINER_STATUS');
  await query(truncConn, 'TRUNCATE TABLE PROGRAMME');
  await query(truncConn, 'TRUNCATE TABLE PROGRAMME_SLOT');
  await query(truncConn, 'TRUNCATE TABLE NON_TEST_ACTIVITY_REASON');
  await query(truncConn, 'TRUNCATE TABLE PERSONAL_COMMITMENT');
  truncConn.end();
};
