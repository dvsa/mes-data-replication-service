import * as mysql from 'mysql';
import { query } from '../database';
import { ExaminerDeployment } from '../../../domain/examiner-deployment';
import * as moment from 'moment';

export const getDeployments = async (connectionPool: mysql.Pool): Promise<ExaminerDeployment[]> => {
  const sqlYearFormat = 'YYYY-MM-DD';
  const windowStart = moment().format(sqlYearFormat);
  const windowEnd = moment().add(6, 'months').format(sqlYearFormat);

  const res = await query(
    connectionPool,
    /* tslint:disable */
    `
    select d.deployment_id, e.individual_id, d.tc_id, tcn.tc_name, tc.tc_cost_centre_code, p.programme_date
    from EXAMINER e
        join DEPLOYMENT d on e.individual_id = d.individual_id
        join TEST_CENTRE tc on d.tc_id = tc.tc_id
        join TEST_CENTRE_NAME tcn on d.tc_id = tcn.tc_id
        join PROGRAMME p on p.individual_id = e.individual_id
    where (
        DATE(d.start_date) between STR_TO_DATE(?, '%d/%m/%Y') and STR_TO_DATE(?, '%d/%m/%Y')
        or DATE(d.end_date) between STR_TO_DATE(?, '%d/%m/%Y') and STR_TO_DATE(?, '%d/%m/%Y')
    )
    and DATE(p.programme_date) between DATE(d.start_date) and DATE(d.end_date)
    and p.tc_id = d.tc_id
    and IFNULL(e.grade_code, 'ZZZ') != 'DELE'
    and exists (
        select end_date
        from EXAMINER_STATUS es
        where es.individual_id = e.individual_id
        and IFNULL(es.end_date, STR_TO_DATE('01/01/4000', '%d/%m/%Y')) > STR_TO_DATE(?, '%d/%m/%Y')
    )
    `,
    /* tslint:enable */
    [windowStart, windowEnd, windowStart, windowEnd, windowStart],
  );
  return res.map(mapRow);
};

interface DeploymentRow {
  deployment_id: number;
  individual_id: number;
  tc_id: number;
  tc_name: string;
  tc_cost_centre_code: string;
  programme_date: string;
}

const mapRow = (row: DeploymentRow): ExaminerDeployment => {
  return {
    examinerId: row.individual_id,
    deployment: {
      deploymentId: row.deployment_id,
      testCentre: {
        centreId: row.tc_id,
        centreName: row.tc_name,
        costCode: row.tc_cost_centre_code,
      },
      date: row.programme_date,
    },
  };
};
