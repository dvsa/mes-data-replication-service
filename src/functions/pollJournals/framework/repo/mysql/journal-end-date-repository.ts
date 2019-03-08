import * as mysql from 'mysql';
import * as moment from 'moment';
import { query } from '../../../../../common/framework/mysql/database';

// Typesafe result mapping for statement below
interface JournalEndDateRow {
  next_working_day: Date;
}

/**
 * Get the next working day, for the specified time window.
 * @param connectionPool The MySQL connection pool to use
 * @param startDate The start date of the time window
 * @returns The next working day
 */
export const getNextWorkingDay = async (connectionPool: mysql.Pool, startDate: Date): Promise<Date> => {
  const sqlYearFormat = 'YYYY-MM-DD';
  const windowStart = moment(startDate).format(sqlYearFormat);

  console.log(`running journal end date query starting on ${windowStart}...`);
  const res =  await query(
    connectionPool,
    'select tarsreplica.getJournalEndDate(1, ?) as next_working_day',
    [windowStart],
  );
  return res.map((row: JournalEndDateRow) => row.next_working_day as Date)[0];
};
