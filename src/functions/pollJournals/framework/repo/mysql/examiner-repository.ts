import * as mysql from 'mysql';
import { blockingQuery } from '../database';
import * as moment from 'moment';

export const getExaminers = async (connectionPool: mysql.Pool): Promise<any[]> => {
  const sqlYearFormat = 'YYYY-MM-DD';
  const windowStart = moment().format(sqlYearFormat);

  const res = await blockingQuery(
    connectionPool,
    `
    select e.individual_id, e.staff_number, title_ref.item_desc1 as title,
        i.first_forename as first_forename, i.second_forename as second_forename,
        i.third_forename as third_forename, i.family_name as family_name
    from INDIVIDUAL i
        join EXAMINER e on e.individual_id = i.individual_id
        left join EXAMINER_STATUS es on es.individual_id = e.individual_id
        left join REF_DATA_ITEM_MASTER title_ref on i.title_code = title_ref.item_id
    where IFNULL(e.grade_code, 'ZZZ') <> 'DELE'
    and IFNULL(es.end_date, '4000-01-01') >= ?
    `,
    [windowStart],
  );
  return res;
};
