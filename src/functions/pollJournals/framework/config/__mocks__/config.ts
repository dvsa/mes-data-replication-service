import { Config } from '../config';

export const dummyConfig: Config = {
  examinerBatchSize: 1,
  isOffline: true,
  journalDynamodbTableName: 'journals',
  tarsReplicaDatabaseHostname: 'localhost',
  tarsReplicaDatabaseName: 'dummydbname',
  tarsReplicaDatabasePassword: 'dummypassword',
  tarsReplicaDatabaseUsername: 'dummyusername',
};
