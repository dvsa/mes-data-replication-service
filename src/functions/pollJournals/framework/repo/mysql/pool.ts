import * as mysql from 'mysql2';
import { config } from '../../config/config';

export const createConnectionPool = (): mysql.Pool => {
  const configuration = config();
  return mysql.createPool({
    host: configuration.tarsReplicaDatabaseHostname,
    database: configuration.tarsReplicaDatabaseName,
    user: configuration.tarsReplicaDatabaseUsername,
    password: configuration.tarsReplicaDatabasePassword,
    /*
        This is a nasty nasty testing hack as it's the only detection mechanism I can think of that doesn't involve
        testing for test-specific environment variables. The testing password is < 20 characters, so we can disable
        the SSL option, whereas the signed password for RDS IAM-based Auth is much larger which enables us to enable
        the Amazon RDS SSL option.
    */
    ssl: configuration.tarsReplicaDatabasePassword.length > 20 ? 'Amazon RDS' : null,
    authSwitchHandler(data, cb) {
      if (data.pluginName === 'mysql_clear_password') {
        cb(null, Buffer.from(`${configuration.tarsReplicaDatabasePassword}\0`));
      }
    },
    connectionLimit: 50,
  });
};
