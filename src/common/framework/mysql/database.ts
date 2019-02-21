import * as mysql from 'mysql';

export const query = async (
  connectionPool: mysql.Pool,
  sql: string, args?: any,
): Promise<any[]>  => {
  return new Promise((resolve, reject) => {
    connectionPool.query(sql, args, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};
