import * as mysql from 'mysql';
import { query } from '../database';
import { ExaminerPersonalCommitment } from '../../../domain/examiner-personal-commitment';
import * as moment from 'moment';
import { mapRow } from './row-mappers/personal-commitment-row-mapper';

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
        DATE(pc.start_date_time) between ? and ?
        or DATE(pc.end_date_time) between ? and ?
    )
    and IFNULL(e.grade_code, 'ZZZ') != 'DELE'
    and exists (
        select end_date 
        from EXAMINER_STATUS es
        where es.individual_id = e.individual_id
        and IFNULL(es.end_date, '4000-01-01') > ?
    )
    `,
    [windowStart, windowEnd, windowStart, windowEnd, windowStart]
    /* tslint:enable */
  );
  return res.map(mapRow);
};
