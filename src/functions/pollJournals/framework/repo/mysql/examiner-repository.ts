import * as mysql from 'mysql';
import * as moment from 'moment';
import { query } from '../../../../../common/framework/mysql/database';
import { logDuration } from '../../../../../common/framework/log/logger';

/**
 * Get all active examiners, for the specified time window.
 * @param connectionPool The MySQL connection pool to use
 * @param startDate The start date of the time window
 * @returns The examiners
 */
export const getExaminers = async (connectionPool: mysql.Pool, startDate: Date): Promise<any[]> => {
  const sqlYearFormat = 'YYYY-MM-DD';
  const windowStart = moment(startDate).format(sqlYearFormat);

  console.log(`Issued examiner query starting on ${windowStart}...`);
  const start = new Date();
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
  const end = new Date();
  logDuration(start, end, 'examiner query returned');
  return res;
};
