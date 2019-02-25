import * as mysql from 'mysql';
import * as moment from 'moment';
import { query } from '../../../../../common/framework/mysql/database';

export const getExaminers = async (connectionPool: mysql.Pool): Promise<any[]> => {
  const sqlYearFormat = 'YYYY-MM-DD';
  const windowStart = moment().format(sqlYearFormat);

  const res = await query(
    connectionPool,
    `
    select e.individual_id, e.staff_number
    from EXAMINER e
        left join EXAMINER_STATUS es on es.individual_id = e.individual_id
    where IFNULL(e.grade_code, 'ZZZ') <> 'DELE'
    and IFNULL(es.end_date, '4000-01-01') >= ?
    `,
    [windowStart],
  );
  return res;
};
