import * as mysql from 'mysql';
import { Mock, IMock } from 'typemoq';
import * as database from '../../database';
import { getNonTestActivities } from '../non-test-activity-repository';

describe('getNonTestActivities', () => {
  let connectionPoolMock: IMock<mysql.Pool>;
  let databaseSpy: jasmine.Spy;

  beforeEach(() => {
    connectionPoolMock = Mock.ofType<mysql.Pool>();
    databaseSpy = spyOn(database, 'query').and.returnValue(
      Promise.resolve([
        {
          individual_id: 1,
          slot_id: 2,
          start_time: '2019-02-15 08:20:00',
          minutes: 57,
          non_test_activity_code: 'activitycode',
          reason_desc: 'reason',
          tc_id: 3,
          tc_name: 'testcentre',
          tc_cost_centre_code: 'costcode',
        },
      ]),
    );
  });

  it('should return all of the rows mapped to an ExaminerNonTestActivity domain object', async () => {
    const result = await getNonTestActivities(connectionPoolMock.object);
    expect(databaseSpy).toHaveBeenCalled();
    expect(result).toEqual([
      {
        examinerId: 1,
        nonTestActivity: {
          activityCode: 'activitycode',
          activityDescription: 'reason',
          slotDetail: {
            duration: 57,
            slotId: 2,
            start: '2019-02-15 08:20:00',
          },
          testCentre: {
            centreId: 3,
            centreName: 'testcentre',
            costCode: 'costcode',
          },
        },
      },
    ]);
  });
});
