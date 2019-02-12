import * as mysql from 'mysql';
import { blockingQuery } from '../database';
import { ExaminerNonTestActivity } from '../../../domain/examiner-non-test-activity';

export const getNonTestActivities = async (connectionPool: mysql.Pool)
  : Promise<ExaminerNonTestActivity[]> => {
  const res = await blockingQuery(
    connectionPool,
    `
    select w.individual_id, w.slot_id, w.start_time, w.minutes, w.non_test_activity_code,
    reason.reason_desc, w.tc_id, tcn.tc_name, tc.tc_cost_centre_code
    from WORK_SCHEDULE_SLOTS w
    join NON_TEST_ACTIVITY_REASON reason on w.non_test_activity_code = reason.non_test_activity_code
    join TEST_CENTRE tc on w.tc_id = tc.tc_id
    join TEST_CENTRE_NAME tcn on w.tc_id = tcn.tc_id
    where w.programme_date between STR_TO_DATE('03/08/2017', '%d/%m/%Y')
    and STR_TO_DATE('16/08/2017', '%d/%m/%Y')
    and w.examiner_end_date > STR_TO_DATE('03/08/2017', '%d/%m/%Y')
    ORDER BY w.individual_id
    `,
  );
  return res.map(mapRow);
};

interface NonTestActivityRow {
  individual_id: number;
  slot_id: number;
  start_time: string;
  minutes: number;
  non_test_activity_code: string;
  reason_desc: string;
  tc_id: number;
  tc_name: string;
  tc_cost_centre_code: string;
}

const mapRow = (row: NonTestActivityRow): ExaminerNonTestActivity => {
  return {
    examinerId: row.individual_id,
    nonTestActivity: {
      slotDetail: {
        slotId: row.slot_id,
        start: row.start_time,
        duration: row.minutes,
      },
      activityCode: row.non_test_activity_code,
      activityDescription: row.reason_desc,
      testCentre: {
        centreId: row.tc_id,
        centreName: row.tc_name,
        costCode: row.tc_cost_centre_code,
      },
    },
  };
};
