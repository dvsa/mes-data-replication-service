import { IConnectionPool, createPool, OBJECT, IConnection } from 'oracledb';
import { Config } from './config';

export const createConnectionPool = async (config: Config): Promise<IConnectionPool> => {
  try {
    return await createPool({
      user: config.username,
      password: config.password,
      connectString: config.connectionString,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Runs a single SQL query on a connection yielded by a connection pool
 * @param connPool   Connection pool for the database
 * @param sqlQuery   The SQL query to run
 * @param bindValues The bind variables values
 * @returns The results as an array of objects (each property is the column name in upper case)
 */
export function query(connPool: IConnectionPool, sqlQuery: string, bindValues?: any): Promise<Object[]> {
  return new Promise((resolve, reject) => {
    let conn: IConnection;
    connPool.getConnection().then((connection) => {
      conn = connection;

      console.log(`Executing query: \n***\n${sqlQuery}\n***`);

      // return each row as an object rather than an array
      return conn.execute(sqlQuery, bindValues || {}, { outFormat: OBJECT, autoCommit: true });
    }).then((result) => {

      console.log(`${result.rows.length} rows returned`);

      if (result.rowsAffected) {
          console.log(`${result.rowsAffected} rows updated`)
      }

      // direct fetch of all rows as objects
      resolve(result.rows);
    },      (err) => {
      console.error(err);
      reject(err);
    })
    .then(() => {
      if (conn) {
        return conn.close();
      }
    })
    .catch((err) => {
      console.error('error closing connection: %s', err.message);
    });
  });
}

/**
 * Runs a single SQL update on a connection yielded by a connection pool
 * @param connPool     Connection pool for the database
 * @param sqlUpdate    The SQL update to run
 * @param expectedRows The number of rows that should be updated
 * @param bindValues   The bind variables values
 * @returns The results as an array of objects (each property is the column name in upper case)
 */
export function update(connPool: IConnectionPool, sqlQuery: string, expectedRows: number, bindValues?: any): Promise<Object[]> {
  return new Promise((resolve, reject) => {
    let conn: IConnection;
    connPool.getConnection().then((connection) => {
      conn = connection;

      console.log(`Executing update: \n***\n${sqlQuery}\n***`);

      // return each row as an object rather than an array
      return conn.execute(sqlQuery, bindValues || {}, { outFormat: OBJECT, autoCommit: true });
    }).then((result) => {
        
      console.log(`${result.rowsAffected} rows updated`);
      
      if (result.rowsAffected != expectedRows) {
          let err = `Expected ${expectedRows} rows to be updated, but got ${result.rowsAffected}`;
          console.error(err);
          reject(err);
      }

      // direct fetch of all rows as objects
      resolve(result.rows);
    },      (err) => {
      console.error(err);
      reject(err);
    })
    .then(() => {
      if (conn) {
        return conn.close();
      }
    })
    .catch((err) => {
      console.error('error closing connection: %s', err.message);
    });
  });
}
