import * as mysql from 'mysql';
import { query } from '../database';
import { ExaminerAdvanceTestSlot } from '../../../domain/examiner-advance-test-slot';
import * as moment from 'moment';
import { mapRow } from './row-mappers/advance-test-slot-row-mapper';

export const getAdvanceTestSlots = async (connectionPool: mysql.Pool):
  Promise<ExaminerAdvanceTestSlot[]> => {
  const sqlYearFormat = 'YYYY-MM-DD';
  const windowStart = moment().add(4, 'days').format(sqlYearFormat);
  const windowEnd = moment().add(13, 'days').format(sqlYearFormat);

  const res =  await query(
    connectionPool,
    /* tslint:disable */
    `
    select w.individual_id, w.slot_id, w.start_time, w.minutes, w.tc_id, tcn.tc_name, tc.tc_cost_centre_code, vst.short_vst_desc
    from WORK_SCHEDULE_SLOTS w
        join TEST_CENTRE tc on w.tc_id = tc.tc_id
        join TEST_CENTRE_NAME tcn on w.tc_id = tcn.tc_id
        join VEHICLE_SLOT_TYPE vst on w.vst_code = vst.vst_code
    where w.programme_date between ? and ?
    and w.examiner_end_date > ?
    `,
    [windowStart, windowEnd, windowStart],
    /* tslint:enable */
  );
  return res.map(mapRow);
};
