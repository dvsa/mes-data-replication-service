import * as mysql from 'mysql';
import { ExaminerDeployment } from '../../../domain/examiner-deployment';
import { mapRow } from './row-mappers/deployment-row-mapper';
import { query } from '../../../../../common/framework/mysql/database';

export const getDeployments = async (connectionPool: mysql.Pool): Promise<ExaminerDeployment[]> => {
  const res = await query(
    connectionPool,
    `
    select d.deployment_id, e.individual_id, d.tc_id, tcn.tc_name, tc.tc_cost_centre_code, p.programme_date
    from EXAMINER e
        join DEPLOYMENT d on e.individual_id = d.individual_id
        join TEST_CENTRE tc on d.tc_id = tc.tc_id
        join TEST_CENTRE_NAME tcn on d.tc_id = tcn.tc_id
        join PROGRAMME p on p.individual_id = e.individual_id,
    (
      select
          curdate() as window_start,
          date_add(date_add(curdate(), interval +6 month), interval -1 day) as window_end
          from (
              select tarsreplica.getJournalEndDate(1) as next_working_day
          ) nwd
    ) windows
    where (
        DATE(d.start_date) between windows.window_start and windows.window_end
        or DATE(d.end_date) between windows.window_start and windows.window_end
    )
    and DATE(p.programme_date) between DATE(d.start_date) and DATE(d.end_date)
    and p.tc_id = d.tc_id
    and IFNULL(e.grade_code, 'ZZZ') != 'DELE'
    and exists (
        select end_date
        from EXAMINER_STATUS es
        where es.individual_id = e.individual_id
        and IFNULL(es.end_date, '4000-01-01') > windows.window_start
    )
    `,
  );
  return res.map(mapRow);
};
