import * as mysql from 'mysql';
import { Mock, IMock } from 'typemoq';
import * as database from '../../database';
import { getPersonalCommitments } from '../personal-commitment-repository';

describe('getPersonalCommitments', () => {
  let connectionPoolMock: IMock<mysql.Pool>;
  let databaseSpy: jasmine.Spy;

  beforeEach(() => {
    connectionPoolMock = Mock.ofType<mysql.Pool>();
    databaseSpy = spyOn(database, 'blockingQuery').and.returnValue(
      Promise.resolve([
        {
          individual_id: 1,
          commitment_id: 2,
          start_date_time: '2019-02-12 08:20:00',
          end_date_time: '2019-02-12 09:20:00',
          non_test_activity_code: 'pcom',
          reason_desc: 'reason',
        },
      ]),
    );
  });

  it('should return all of the rows mapped to our domain objects', async () => {
    const result = await getPersonalCommitments(connectionPoolMock.object);
    expect(databaseSpy).toHaveBeenCalled();
    expect(result).toEqual([
      {
        examinerId: 1,
        personalCommitment: {
          activityCode: 'pcom',
          activityDescription: 'reason',
          commitmentId: 2,
          startDate: '2019-02-12 08:20:00',
          startTime: '2019-02-12 08:20:00',
          endDate: '2019-02-12 09:20:00',
          endTime: '2019-02-12 09:20:00',
        },
      },
    ]);
  });
});
