import * as mysql from 'mysql';
import { ExaminerAdvanceTestSlot } from '../../../domain/examiner-advance-test-slot';
import { mapRow } from './row-mappers/advance-test-slot-row-mapper';
import { query } from '../../../../../common/framework/mysql/database';

export const getAdvanceTestSlots = async (connectionPool: mysql.Pool):
  Promise<ExaminerAdvanceTestSlot[]> => {
  const res =  await query(
    connectionPool,
    /* tslint:disable */
    `
    select w.individual_id, w.slot_id, w.start_time, w.minutes, w.tc_id, tcn.tc_name, tc.tc_cost_centre_code, vst.short_vst_desc
    from WORK_SCHEDULE_SLOTS w
      join TEST_CENTRE tc on w.tc_id = tc.tc_id
      join TEST_CENTRE_NAME tcn on w.tc_id = tcn.tc_id
      join VEHICLE_SLOT_TYPE vst on w.vst_code = vst.vst_code
      join 
        (
          select
              date_add(nwd.next_working_day, interval +1 day) as window_start,
              date_add(curdate(), interval +13 day) as window_end
              from (
                select tarsreplica.getJournalEndDate(1) as next_working_day
              ) nwd
        ) windows
        on w.programme_date between windows.window_start and windows.window_end
      where w.examiner_end_date > windows.window_start
    `,
    /* tslint:enable */
  );
  return res.map(mapRow);
};
