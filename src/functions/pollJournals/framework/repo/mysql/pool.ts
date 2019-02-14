import * as mysql from 'mysql';

export const createConnectionPool = (): mysql.Pool => {
  return mysql.createPool({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    connectionLimit: 50,
  });
};
