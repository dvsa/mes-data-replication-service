import * as mysql from 'mysql';
import { query } from '../database';
import { ExaminerPersonalCommitment } from '../../../domain/examiner-personal-commitment';
import * as moment from 'moment';

export const getPersonalCommitments = async (connectionPool: mysql.Pool)
  : Promise<ExaminerPersonalCommitment[]> => {
  const sqlYearFormat = 'YYYY-MM-DD';
  const windowStart = moment().format(sqlYearFormat);
  const windowEnd = moment().add(13, 'days').format(sqlYearFormat);

  const res = await query(
    connectionPool,
    /* tslint:disable */
    `
    select e.individual_id, pc.commitment_id, pc.start_date_time, pc.end_date_time, pc.non_test_activity_code, reason.reason_desc
    from EXAMINER e 
        join PERSONAL_COMMITMENT pc on e.individual_id = pc.individual_id
        join NON_TEST_ACTIVITY_REASON reason on pc.non_test_activity_code = reason.non_test_activity_code
    where (
        DATE(pc.start_date_time) between STR_TO_DATE(?, '%d/%m/%Y') and STR_TO_DATE(?, '%d/%m/%Y')
        or DATE(pc.end_date_time) between STR_TO_DATE(?, '%d/%m/%Y') and STR_TO_DATE(?, '%d/%m/%Y')
    )
    and IFNULL(e.grade_code, 'ZZZ') != 'DELE'
    and exists (
        select end_date 
        from EXAMINER_STATUS es
        where es.individual_id = e.individual_id
        and IFNULL(es.end_date, STR_TO_DATE('01/01/4000', '%d/%m/%Y')) > STR_TO_DATE(?, '%d/%m/%Y')
    )
    `,
    [windowStart, windowEnd, windowStart, windowEnd, windowStart]
    /* tslint:enable */
  ) as PersonalCommitmentRow[];
  return res.map(mapRow);
};

interface PersonalCommitmentRow {
  individual_id: number;
  commitment_id: number;
  start_date_time: string;
  end_date_time: string;
  non_test_activity_code: string;
  reason_desc: string;
}

// TODO: Split out start/end date/time
const mapRow = (row: PersonalCommitmentRow): ExaminerPersonalCommitment => {
  return {
    examinerId: row.individual_id,
    personalCommitment: {
      commitmentId: row.commitment_id,
      startDate: row.start_date_time,
      startTime: row.start_date_time,
      endDate: row.end_date_time,
      endTime: row.end_date_time,
      activityCode: row.non_test_activity_code,
      activityDescription: row.reason_desc,
    },
  };
};
