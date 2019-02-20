import * as mysql from 'mysql';
import { query } from '../database';
import { ExaminerNonTestActivity } from '../../../domain/examiner-non-test-activity';
import * as moment from 'moment';
import { mapRow } from './row-mappers/non-test-activity-row-mapper';

export const getNonTestActivities = async (connectionPool: mysql.Pool)
  : Promise<ExaminerNonTestActivity[]> => {
  const sqlYearFormat = 'YYYY-MM-DD';
  const windowStart = moment().format(sqlYearFormat);
  const windowEnd = moment().add(3, 'days').format(sqlYearFormat);
  const res = await query(
    connectionPool,
    `
    select w.individual_id, w.slot_id, w.start_time, w.minutes, w.non_test_activity_code,
        reason.reason_desc, w.tc_id, tcn.tc_name, tc.tc_cost_centre_code
    from WORK_SCHEDULE_SLOTS w
        join NON_TEST_ACTIVITY_REASON reason on w.non_test_activity_code = reason.non_test_activity_code
        left join TEST_CENTRE tc on w.tc_id = tc.tc_id
        left join TEST_CENTRE_NAME tcn on w.tc_id = tcn.tc_id
    where w.programme_date between ? and ?
    and w.examiner_end_date >= ?
    `,
    [windowStart, windowEnd, windowStart],
  );
  return res.map(mapRow);
};
