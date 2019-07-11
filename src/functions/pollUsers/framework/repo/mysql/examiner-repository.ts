import { query } from '../../../../../common/framework/mysql/database';
import { config } from '../../config';
import * as mysql from 'mysql2';
import * as moment from 'moment';
import { StaffDetail } from '../../../../../common/application/models/staff-details';

export const getActiveExaminers = async (): Promise<StaffDetail[]> => {
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
    select e.individual_id, e.staff_number, eg.test_centre_manager_ind
    from EXAMINER e
        left join EXAMINER_STATUS es on es.individual_id = e.individual_id
        left join EXAMINER_GRADE eg on eg.examiner_grade_code = e.grade_code
    where IFNULL(e.grade_code, 'ZZZ') <> 'DELE'
    and IFNULL(es.end_date, '4000-01-01') >= ?
    `,
    [moment().format('YYYY-MM-DD')],
  );

  const staffDetails = [];
  queryResult.map((row) => {
    // may change in the future if we wish to interact with more TARS data
    const role = row.test_centre_manager_ind === 1 ? 'LDTM' : 'DE';
    staffDetails.push(new StaffDetail(row.staff_number, role));
  });

  return staffDetails;
};
