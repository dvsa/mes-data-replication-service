import * as mysql from 'mysql';

export const streamQuery = (
  connection: mysql.Connection,
  sql: string,
  rowCb: any,
  finalCb: any,
  args?: any,
) => {
  const query = connection.query(sql, args);
  query
    .on('result', (row) => {
      rowCb(row);
    })
    .on('end', () => {
      finalCb();
    });
  return {};
};

export const blockingQuery = async (
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
