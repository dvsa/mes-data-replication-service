import {
  defaultIfNotPresent,
  throwIfNotPresent,
  tryFetchFromSecretsManager,
} from '../../../common/framework/config/config-helpers';
let configuration: Config;

export const bootstrapConfig = async () => {
  if (!configuration) {
    configuration = {
      isOffline: !!process.env.IS_OFFLINE,
      usersDynamodbTableName: defaultIfNotPresent(process.env.USERS_DDB_TABLE_NAME, 'users'),
      tarsReplicaDatabaseHostname: throwIfNotPresent(
        process.env.TARS_REPLICA_HOST_NAME,
        'tarsReplicateDatabaseHostname',
      ),
      tarsReplicaDatabaseName: throwIfNotPresent(
        process.env.TARS_REPLICA_DB_NAME,
        'tarsReplicaDatabaseName',
      ),
      tarsReplicaDatabaseUsername: throwIfNotPresent(
        process.env.TARS_REPLICA_DB_USERNAME,
        'tarsReplicaDatabaseUsername',
      ),
      tarsReplicaDatabasePassword: await tryFetchFromSecretsManager(
        process.env.ASM_SECRET_NAME,
        process.env.ASM_SECRET_DB_PASSWORD_KEY,
        'SECRET_DB_PASSWORD_KEY',
      ),

    };
  }
};

export type Config = {
  isOffline: boolean;
  usersDynamodbTableName: string;
  tarsReplicaDatabaseHostname: string;
  tarsReplicaDatabaseName: string;
  tarsReplicaDatabaseUsername: string;
  tarsReplicaDatabasePassword: string;
};

export const config = (): Config => configuration;
