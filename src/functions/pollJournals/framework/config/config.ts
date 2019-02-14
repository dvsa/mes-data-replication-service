import {
  defaultIfNotPresent,
  throwIfNotPresent,
  tryFetchFromSecretsManager,
} from './config-helpers';

export type Config = {
  examinerBatchSize: number;
  isOffline: boolean;
  journalDynamodbTableName: string;
  tarsReplicaDatabaseHostname: string;
  tarsReplicaDatabaseName: string;
  tarsReplicaDatabaseUsername: string;
  tarsReplicaDatabasePassword: string;
};

let configuration: Config;
export const bootstrapConfig = async (): Promise<void> => {
  if (!configuration) {
    configuration = {
      isOffline: !!process.env.IS_OFFLINE,
      examinerBatchSize: Number.parseInt(process.env.EXAMINER_BATCH_SIZE || '250', 10),
      // tslint:disable-next-line:max-line-length
      journalDynamodbTableName: defaultIfNotPresent(process.env.JOURNALS_DDB_TABLE_NAME, 'journals'),
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

export const config = (): Config => configuration;
