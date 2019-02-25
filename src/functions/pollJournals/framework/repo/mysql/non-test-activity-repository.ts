import * as mysql from 'mysql';
import { ExaminerNonTestActivity } from '../../../domain/examiner-non-test-activity';
import { mapRow } from './row-mappers/non-test-activity-row-mapper';
import { query } from '../../../../../common/framework/mysql/database';

export const getNonTestActivities = async (connectionPool: mysql.Pool)
  : Promise<ExaminerNonTestActivity[]> => {
  const res = await query(
    connectionPool,
    `
    select w.individual_id, w.slot_id, w.start_time, w.minutes, w.non_test_activity_code,
        reason.reason_desc, w.tc_id, tcn.tc_name, tc.tc_cost_centre_code
    from WORK_SCHEDULE_SLOTS w
      join NON_TEST_ACTIVITY_REASON reason on w.non_test_activity_code = reason.non_test_activity_code
      join
        (
          select
              curdate() as window_start,
              nwd.next_working_day as window_end
              from (
                select tarsreplica.getJournalEndDate(1) as next_working_day
              ) nwd
        ) windows
        on w.programme_date between windows.window_start and windows.window_end
      left join TEST_CENTRE tc on w.tc_id = tc.tc_id
      left join TEST_CENTRE_NAME tcn on w.tc_id = tcn.tc_id
    where w.examiner_end_date >= windows.window_start
    `,
  );
  return res.map(mapRow);
};
