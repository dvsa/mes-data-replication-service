import { buildStaffDetailsFromQueryResult } from '../examiner-record-row-mapper';
import { StaffDetail } from '../../../../../../common/application/models/staff-details';

describe('ExmainerRecordRowMapper', () => {
  const examinerRecords = [
    {
      individual_id: 1,
      staff_number: '01',
      test_category_ref: 'B',
      test_centre_manager_ind: 0,
      with_effect_from: new Date('2019-07-05'),
      with_effect_to: new Date('2019-07-12'),
    },
    {
      individual_id: 1,
      staff_number: '01',
      test_category_ref: 'B',
      test_centre_manager_ind: 0,
      with_effect_from: new Date('2019-08-01'),
      with_effect_to: null,
    },
    {
      individual_id: 1,
      staff_number: '01',
      test_category_ref: 'B+E',
      test_centre_manager_ind: 0,
      with_effect_from: new Date('2019-09-01'),
      with_effect_to: null,
    },
    {
      individual_id: 2,
      staff_number: '02',
      test_category_ref: 'B',
      test_centre_manager_ind: 1,
      with_effect_from: new Date('2019-10-01'),
      with_effect_to: null,
    },
  ];

  it('should generate a staffDetail for each distinct examiner', () => {
    const result = buildStaffDetailsFromQueryResult(examinerRecords);

    expect(result.length).toBe(2);
  });

  it('should put the staff number from the query result into the StaffDetail object', () => {
    const result = buildStaffDetailsFromQueryResult(examinerRecords);

    expect(result[0].staffNumber).toBe('01');
    expect(result[1].staffNumber).toBe('02');
  });

  it('should determine whether each examiner is an LDTM or not', () => {
    const result = buildStaffDetailsFromQueryResult(examinerRecords);

    expect(result[0].isLDTM).toBe(false);
    expect(result[1].isLDTM).toBe(true);
  });

  it('should add a TestPermissionPeriod object for each category/date qualified record for the examiner', () => {
    const result = buildStaffDetailsFromQueryResult(examinerRecords);

    expect(result[0].testPermissionPeriods.length).toBe(3);
    expect(result[1].testPermissionPeriods.length).toBe(1);
  });

  it('should include the permission period to/from dates correctly', () => {
    const result = buildStaffDetailsFromQueryResult(examinerRecords);

    const examiner1PermissionPeriods = result[0].testPermissionPeriods;
    expect(examiner1PermissionPeriods[0]).toEqual({ testCategory: 'B', from: '2019-07-05', to: '2019-07-12' });
    expect(examiner1PermissionPeriods[1]).toEqual({ testCategory: 'B', from: '2019-08-01', to: null });
    expect(examiner1PermissionPeriods[2]).toEqual({ testCategory: 'B+E', from: '2019-09-01', to: null });

    const examiner2PermissionPeriods = result[1].testPermissionPeriods;
    expect(examiner2PermissionPeriods[0]).toEqual({ testCategory: 'B', from: '2019-10-01', to: null });
  });

  it('should handle an examiner record without any permissions', () => {
    const permissionlessExaminerRecord = {
      individual_id: 1,
      staff_number: '01',
      test_centre_manager_ind: 0,
      test_category_ref: null,
      with_effect_from: null,
      with_effect_to: null,
    };

    const result = buildStaffDetailsFromQueryResult([permissionlessExaminerRecord]);

    expect(result).toEqual([new StaffDetail('01', false)]);
  });
});
