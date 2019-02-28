import { throwIfNotPresent } from '../../../../common/framework/config/config-helpers';

export type Config = {
  maxRetries: number;
  retryDelay: number;
  highLevelWindowDays: number;
  deploymentWindowMonths: number;
  deploymentWindowDays: number;
  sourceArn: string;
  targetArn: string;
  tarsSchema: string;
  replicationArn: string;
  dateFilteredTaskName: string;
  environmentPrefix: string;

};

let configuration: Config;
export const bootstrapConfig = async (): Promise<void> => {
  if (!configuration) {
    configuration = {
      maxRetries: 60,
      retryDelay: 15000,
      highLevelWindowDays: Number.parseInt(process.env.HIGH_LEVEL_WINDOW_DAYS || '13', 10),
      deploymentWindowMonths: Number.parseInt(process.env.DEPLOYMENT_WINDOW_MONTHS || '6', 10),
      deploymentWindowDays: Number.parseInt(process.env.DEPLOYMENT_WINDOW_DAYS || '1', 10),
      sourceArn: throwIfNotPresent(process.env.SOURCE_ARN, 'sourceArn'),
      targetArn: throwIfNotPresent(process.env.TARGET_ARN, 'targetArn'),
      replicationArn: throwIfNotPresent(process.env.REPLICATION_ARN, 'replicationArn'),
      dateFilteredTaskName: 'dateFiltered-full-load-and-cdc',
      tarsSchema: throwIfNotPresent(process.env.TARS_SCHEMA, 'tarsSchema'),
      environmentPrefix: throwIfNotPresent(process.env.ENVIRONMENT_PREFIX, 'environmentPrefix'),
    };
  }
};

export const config = (): Config => configuration;
