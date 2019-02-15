import { getAdvanceTestSlots } from '../advance-test-slots-repository';
import * as mysql from 'mysql';
import { Mock, IMock } from 'typemoq';
import * as database from '../../database';

describe('getAdvanceTestSlots', () => {
  let connectionPoolMock: IMock<mysql.Pool>;
  let databaseSpy: jasmine.Spy;

  beforeEach(() => {
    connectionPoolMock = Mock.ofType<mysql.Pool>();
    databaseSpy = spyOn(database, 'blockingQuery').and.returnValue(
      Promise.resolve([
        {
          individual_id: 1,
          slot_id: 123,
          start_time: '2019-02-12 08:20:00',
          minutes: 100,
          tc_id: 3,
          tc_name: 'test-tc',
          tc_cost_centre_code: 'csc',
          short_vst_desc: 'B57mins',
        },
      ]),
    );
  });

  it('should return all of the rows mapped to our domain objects', async () => {
    const result = await getAdvanceTestSlots(connectionPoolMock.object);
    expect(databaseSpy).toHaveBeenCalled();
    expect(result).toEqual([
      {
        examinerId: 1,
        advanceTestSlot: {
          slotDetail: {
            slotId: 123,
            start: '2019-02-12 08:20:00',
            duration: 100,
          },
          testCentre: {
            centreId: 3,
            centreName: 'test-tc',
            costCode: 'csc',
          },
          vehicleSlotType: 'B57mins',
        },
      },
    ]);
  });
});
