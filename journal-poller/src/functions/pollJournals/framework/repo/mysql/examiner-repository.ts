import * as mysql from 'mysql';
import { blockingQuery } from '../database';

export const getExaminers = async (connectionPool: mysql.Pool): Promise<any[]> => {
  const res = await blockingQuery(
    connectionPool,
    `
    select e.individual_id, e.staff_number, title_ref.item_desc1 as title,
        i.first_forename as first_forename, i.second_forename as second_forename,
        i.third_forename as third_forename, i.family_name as family_name
    from INDIVIDUAL i
    left join REF_DATA_ITEM_MASTER title_ref on i.title_code = title_ref.item_id
    join EXAMINER e on e.individual_id = i.individual_id
    where IFNULL(e.grade_code, 'ZZZ') != 'DELE'
    and exists (
    select end_date from EXAMINER_STATUS es
    where es.individual_id = e.individual_id
    and IFNULL(es.end_date, STR_TO_DATE('01/01/4000', '%d/%m/%Y'))
      > STR_TO_DATE('14/08/2017', '%d/%m/%Y')
    )
  `);
  return res;
};
