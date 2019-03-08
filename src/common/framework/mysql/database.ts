import * as mysql from 'mysql';

export const query = async (
  connection: mysql.Connection | mysql.Pool,
  sql: string, args?: any,
): Promise<any[]>  => {
  return new Promise((resolve, reject) => {
    console.log(`Running query: ${sql}`);
    connection.query(sql, args, (err, rows) => {
      if (err) {
        console.error(`Got error ${err}`);
        reject(err);
      }
      console.log('query completed successfully');
      if (rows) {
        console.log(`rows in results: ${rows.length}`);
      }
      resolve(rows);
    });
  });
};
