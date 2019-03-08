import { Config } from '../config';

export const dummyConfig: Config = {
  isOffline: true,
  journalDynamodbTableName: 'journals',
  tarsReplicaDatabaseHostname: 'localhost',
  tarsReplicaDatabaseName: 'dummydbname',
  tarsReplicaDatabasePassword: 'dummypassword',
  tarsReplicaDatabaseUsername: 'dummyusername',
};
