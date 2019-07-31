import { query } from '../../../../../common/framework/mysql/database';
import { config } from '../../config';
import * as mysql from 'mysql2';
import * as moment from 'moment';

export const getActiveExaminers = async (): Promise<string[]> => {
  const configuration = config();

  const connection = mysql.createConnection({
    host: configuration.tarsReplicaDatabaseHostname,
    database: configuration.tarsReplicaDatabaseName,
    user: configuration.tarsReplicaDatabaseUsername,
    password: configuration.tarsReplicaDatabasePassword,
    charset: 'UTF8_GENERAL_CI',
    ssl: process.env.TESTING_MODE ? null : 'Amazon RDS',
    authSwitchHandler(data, cb) {
      if (data.pluginName === 'mysql_clear_password') {
        cb(null, Buffer.from(`${configuration.tarsReplicaDatabasePassword}\0`));
      }
    },
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
