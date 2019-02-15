import * as mysql from 'mysql';
import { Mock, IMock } from 'typemoq';
import * as database from '../../database';
import { getDeployments } from '../deployment-repository';

describe('getDeployments', () => {
  let connectionPoolMock: IMock<mysql.Pool>;
  let databaseSpy: jasmine.Spy;

  beforeEach(() => {
    connectionPoolMock = Mock.ofType<mysql.Pool>();
    databaseSpy = spyOn(database, 'query').and.returnValue(
      Promise.resolve([
        {
          deployment_id: 1,
          individual_id: 2,
          tc_id: 3,
          tc_name: 'centre',
          tc_cost_centre_code: 'costcode',
          programme_date: '2019-02-15 00:00:00',
        },
      ]),
    );
  });

  it('should return all of the rows mapped to an ExaminerDeployment domain object', async () => {
    const result = await getDeployments(connectionPoolMock.object);
    expect(databaseSpy).toHaveBeenCalled();
    expect(result).toEqual([
      {
        examinerId: 2,
        deployment: {
          deploymentId: 1,
          testCentre: {
            centreId: 3,
            centreName: 'centre',
            costCode: 'costcode',
          },
          date: '2019-02-15 00:00:00',
        },
      },
    ]);
  });
});
