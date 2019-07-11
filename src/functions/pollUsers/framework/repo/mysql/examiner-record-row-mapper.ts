import { ExaminerQueryRecord } from './examiner-repository';
import {
  StaffDetail, TestPermissionPeriod,
} from '../../../../../common/application/models/staff-details';
import { groupBy } from 'lodash';

export const buildStaffDetailsFromQueryResult = (
  queryResult: ExaminerQueryRecord[],
  universalTestPermissions: TestPermissionPeriod[],
): StaffDetail[] => {
  const queryResultsByExaminer = groupBy(queryResult, record => record.staff_number);

  return Object.values(queryResultsByExaminer).reduce(
    (staffDetailsAcc, recordsForExaminer) => {
      const staffNumber = recordsForExaminer[0].staff_number;
      const isLDTM = recordsForExaminer[0].test_centre_manager_ind === 1;

      const formatDate = (date: Date) => date === null ? null : date.toISOString().split('T')[0];

      const testPermissionPeriods: TestPermissionPeriod[] = examinerHasPermissions(recordsForExaminer)
        ? [
          ...recordsForExaminer.map(record => ({
            testCategory: record.test_category_ref,
            from: formatDate(record.with_effect_from),
            to: formatDate(record.with_effect_to),
          })),
          ...universalTestPermissions,
        ]
        : universalTestPermissions;

      return [...staffDetailsAcc, new StaffDetail(staffNumber, isLDTM, testPermissionPeriods)];
    },
    [] as StaffDetail[]);
};

const examinerHasPermissions = (examinerRecords: ExaminerQueryRecord[]): boolean => {
  return examinerRecords.length !== 1 || examinerRecords[0].test_category_ref !== null;
};
