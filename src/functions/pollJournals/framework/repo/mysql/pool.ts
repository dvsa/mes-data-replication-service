import * as mysql from 'mysql2';
import { config } from '../../config/config';

export const createConnectionPool = (): mysql.Pool => {
  const configuration = config();
  return mysql.createPool({
    host: configuration.tarsReplicaDatabaseHostname,
    database: configuration.tarsReplicaDatabaseName,
    user: configuration.tarsReplicaDatabaseUsername,
    password: configuration.tarsReplicaDatabasePassword,
    ssl: 'Amazon RDS',
    authSwitchHandler(data, cb) {
      if (data.pluginName === 'mysql_clear_password') {
        cb(null, Buffer.from(`${configuration.tarsReplicaDatabasePassword}\0`));
      }
    },
    connectionLimit: 50,
  });
};
