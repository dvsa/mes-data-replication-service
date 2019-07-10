import { ExaminerQueryRecord } from './examiner-repository';
import {
  StaffDetail,
  TestCategoryConductPermissionPeriods,
  ConductPermissionPeriod,
} from '../../../../../common/application/models/staff-details';
import { groupBy, Dictionary } from 'lodash';

export const buildStaffDetailsFromQueryResult = (queryResult: ExaminerQueryRecord[]): StaffDetail[] => {
  const queryResultsByExaminer = groupBy(queryResult, record => record.staff_number);

  return Object.values(queryResultsByExaminer).reduce(
    (staffDetailsAcc, recordsForExaminer) => {
      const staffNumber = recordsForExaminer[0].staff_number;
      const isLDTM = recordsForExaminer[0].test_centre_manager_ind === 1;

      const recordsByCategory = groupBy(recordsForExaminer, record => record.test_category_ref);
      const categoryPermissionPeriods = buildTestCategoryPermissionPeriods(recordsByCategory);

      return [...staffDetailsAcc, new StaffDetail(staffNumber, isLDTM, categoryPermissionPeriods)];
    },
    [] as StaffDetail[]);
};

const buildTestCategoryPermissionPeriods = (
  recordsByCategory: Dictionary<ExaminerQueryRecord[]>,
): TestCategoryConductPermissionPeriods[] => {
  return Object.entries(recordsByCategory)
    .filter(categoryEntry => categoryEntry[0] !== 'null') // Don't build periods if there's no category
    .map((categoryEntry) => {
      const testCategory = categoryEntry[0];
      const recordsForCategory = categoryEntry[1];
      const conductPermissionPeriods = getConductPermissionPeriodsForCategory(recordsForCategory);
      return {
        testCategory,
        conductPermissionPeriods,
      };
    });
};

const getConductPermissionPeriodsForCategory = (
  recordsForCategory: ExaminerQueryRecord[],
): ConductPermissionPeriod[] => {
  return recordsForCategory.map((categoryRecord) => {
    const { with_effect_from, with_effect_to } = categoryRecord;
    return [with_effect_from, with_effect_to] as ConductPermissionPeriod;
  });
};
