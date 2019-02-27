import {
  defaultIfNotPresent,
  throwIfNotPresent,
} from '../../../../common/framework/config/config-helpers';

export type Config = {
  maxRetries: number;
  retryDelay: number;
  highLevelWindowDays: number;
  deploymentWindowMonths: number;
  deploymentWindowDays: number;
  dateFilteredTaskName: string;
  environmentPrefix: string;

};

let configuration: Config;
export const bootstrapConfig = async (): Promise<void> => {
  if (!configuration) {
    configuration = {
      maxRetries: Number.parseInt(process.env.MAX_RETRIES || '60', 10),
      retryDelay: Number.parseInt(process.env.RETRY_DELAY || '15000', 10),
      highLevelWindowDays: Number.parseInt(process.env.HIGH_LEVEL_WINDOW_DAYS || '13', 10),
      deploymentWindowMonths: Number.parseInt(process.env.DEPLOYMENT_WINDOW_MONTHS || '6', 10),
      deploymentWindowDays: Number.parseInt(process.env.DEPLOYMENT_WINDOW_DAYS || '1', 10),

      // tslint:disable-next-line:max-line-length
      dateFilteredTaskName: defaultIfNotPresent(process.env.DATE_FILTERED_TASK_NAME, 'dateFiltered-full-load-and-cdc'),
      environmentPrefix: throwIfNotPresent(process.env.ENVIRONMENT_PREFIX, 'environmentPrefix'),
    };
  }
};

export const config = (): Config => configuration;
