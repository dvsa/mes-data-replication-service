import * as mysql from 'mysql';
import { ExaminerPersonalCommitment } from '../../../domain/examiner-personal-commitment';
import { mapRow } from './row-mappers/personal-commitment-row-mapper';
import { query } from '../../../../../common/framework/mysql/database';

export const getPersonalCommitments = async (connectionPool: mysql.Pool)
  : Promise<ExaminerPersonalCommitment[]> => {
  const res = await query(
    connectionPool,
    /* tslint:disable */
    `
    select e.individual_id, pc.commitment_id, pc.start_date_time, pc.end_date_time, pc.non_test_activity_code, reason.reason_desc
    from EXAMINER e 
      join PERSONAL_COMMITMENT pc on e.individual_id = pc.individual_id
      join NON_TEST_ACTIVITY_REASON reason on pc.non_test_activity_code = reason.non_test_activity_code
      join
        (
          select
            curdate() as window_start,
            date_add(date_add(curdate(), interval +14 day), interval -1 second) as window_end
        ) windows
        on (
          DATE(pc.start_date_time) between windows.window_start and windows.window_end
          or DATE(pc.end_date_time) between windows.window_start and windows.window_end
        )
    where IFNULL(e.grade_code, 'ZZZ') != 'DELE'
    and exists (
        select end_date 
        from EXAMINER_STATUS es
        where es.individual_id = e.individual_id
        and IFNULL(es.end_date, '4000-01-01') > windows.window_start
    )
    `,
    /* tslint:enable */
  );
  return res.map(mapRow);
};
