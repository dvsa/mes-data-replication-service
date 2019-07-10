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

  it('should add a permission periods object for each distinct category an exmainer is allowed to conduct', () => {
    const result = buildStaffDetailsFromQueryResult(examinerRecords);

    expect(result[0].testCategoryConductPermissionPeriods.length).toBe(2);
    expect(result[1].testCategoryConductPermissionPeriods.length).toBe(1);
  });

  it('should include the permission period to/from dates correctly', () => {
    const result = buildStaffDetailsFromQueryResult(examinerRecords);

    const examiner1CatBRanges = result[0].testCategoryConductPermissionPeriods[0].conductPermissionPeriods;
    const examiner1CatBPlusERanges = result[0].testCategoryConductPermissionPeriods[1].conductPermissionPeriods;
    expect(examiner1CatBRanges[0][0]).toEqual(new Date('2019-07-05'));
    expect(examiner1CatBRanges[0][1]).toEqual(new Date('2019-07-12'));
    expect(examiner1CatBRanges[1][0]).toEqual(new Date('2019-08-01'));
    expect(examiner1CatBRanges[1][1]).toBeNull();
    expect(examiner1CatBPlusERanges[0][0]).toEqual(new Date('2019-09-01'));
    expect(examiner1CatBPlusERanges[0][1]).toBeNull();
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
