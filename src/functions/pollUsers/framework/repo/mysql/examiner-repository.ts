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
    /*
        This is a nasty nasty testing hack as it's the only detection mechanism I can think of that doesn't involve
        testing for test-specific environment variables. The testing password is < 20 characters, so we can disable
        the SSL option, whereas the signed password for RDS IAM-based Auth is much larger which enables us to enable
        the Amazon RDS SSL option.
    */
    ssl: configuration.tarsReplicaDatabasePassword.length > 20 ? 'Amazon RDS' : null,
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
