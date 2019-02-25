import { query } from '../../../../../common/framework/mysql/database';
import { config } from '../../config';
import * as mysql from 'mysql';
import * as moment from 'moment';

export const getActiveExaminers = async (): Promise<string[]> => {
  const configuration = config();

  const connection = mysql.createConnection({
    host: configuration.tarsReplicaDatabaseHostname,
    database: configuration.tarsReplicaDatabaseName,
    user: configuration.tarsReplicaDatabaseUsername,
    password: configuration.tarsReplicaDatabasePassword,
  });

  const queryResult = await query(
    connection,
    `
    select e.individual_id, e.staff_number
    from EXAMINER e
        left join EXAMINER_STATUS es on es.individual_id = e.individual_id
    where IFNULL(e.grade_code, 'ZZZ') <> 'DELE'
    and IFNULL(es.end_date, '4000-01-01') >= ?
    `,
    [moment().format('YYYY-MM-DD')],
  );

  // @ts-ignore
  const activeExaminerStaffNumbers = queryResult.map(row => row.staff_number);

  return activeExaminerStaffNumbers;
};
