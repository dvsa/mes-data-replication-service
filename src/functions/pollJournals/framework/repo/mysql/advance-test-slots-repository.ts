import * as mysql from 'mysql';
import { query } from '../database';
import { ExaminerAdvanceTestSlot } from '../../../domain/examiner-advance-test-slot';
import * as moment from 'moment';

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
    where w.programme_date between STR_TO_DATE(?, '%d/%m/%Y') and STR_TO_DATE(?, '%d/%m/%Y')
    and w.examiner_end_date > STR_TO_DATE(?, '%d/%m/%Y')
    `,
    [windowStart, windowEnd, windowStart],
    /* tslint:enable */
  );
  return res.map(mapRow);
};

interface AdvanceTestSlotRow {
  individual_id: number;
  slot_id: number;
  start_time: string;
  minutes: number;
  tc_id: number;
  tc_name: string;
  tc_cost_centre_code: string;
  short_vst_desc: string;
}

const mapRow = (row: AdvanceTestSlotRow): ExaminerAdvanceTestSlot => {
  return {
    examinerId: row.individual_id,
    advanceTestSlot: {
      slotDetail: {
        slotId: row.slot_id,
        start: row.start_time,
        duration: row.minutes,
      },
      testCentre: {
        centreId: row.tc_id,
        centreName: row.tc_name,
        costCode: row.tc_cost_centre_code,
      },
      vehicleSlotType: row.short_vst_desc,
    },
  };
};
