import { StaffDetail } from '../staff-details';

describe('StaffDetails', () => {
  describe('withSerialisableDates', () => {
    it('should produce an identical object, except with ISO8601 date strings in permission periods', () => {
      const staffDetail = new StaffDetail('01', false, [
        {
          testCategory: 'B',
          conductPermissionPeriods: [
            [new Date('2019-12-01'), new Date('2019-12-30')],
            [new Date('2020-02-01'), new Date('2020-03-01')],
          ],
        },
      ]);

      expect(staffDetail.withSerialisableDates()).toEqual({
        staffNumber: '01',
        isLDTM: false,
        testCategoryConductPermissionPeriods: [
          {
            testCategory: 'B',
            conductPermissionPeriods: [
              ['2019-12-01', '2019-12-30'],
              ['2020-02-01', '2020-03-01'],
            ],
          },
        ],
      });
    });
  });
});
