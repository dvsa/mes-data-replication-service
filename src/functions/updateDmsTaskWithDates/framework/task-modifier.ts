import { getLogger } from './util';
import { DmsApi } from './dms/dms';
import { addBetweenFilter, addOnOrAfterFilter, addOnOrBeforeFilter, Options } from './dms/table-mapping';
import { DateTime, Duration } from 'luxon';
import { config } from './config/config';

export const modifyTask = async (): Promise<void> => {
  const { dateFilteredTaskName,
    environmentPrefix,
   } = config();
  const logger = getLogger('cli-app', 'debug');
  const dms = new DmsApi('eu-west-1');

  const sourceEndpointArn = await dms.getEndpointArn(`${environmentPrefix}-source`);
  logger.debug('source endpoint arn is %s', sourceEndpointArn);

  const destEndpointArn = await dms.getEndpointArn(`${environmentPrefix}-target`);
  logger.debug('dest endpoint arn is %s', destEndpointArn);

  const replicationInstanceArn = await dms.getReplicationInstanceArn(`${environmentPrefix}-replicator`);
  logger.debug('repl instance arn is %s', replicationInstanceArn);

  const taskStatus = await dms.getTaskStatus(dateFilteredTaskName);
  if (taskStatus !== 'stopped') {
    try {
      const stopStatus = await dms.stopTask(dateFilteredTaskName);
      logger.debug('status of stopTask is %s', stopStatus);
      await dms.waitTillTaskStopped(dateFilteredTaskName);
    } catch (error) {
      console.error(error);
    }
  }
  await dms.createTask(dateFilteredTaskName,
                       replicationInstanceArn,
                       sourceEndpointArn,
                       destEndpointArn,
                       addDateFilters);

  await dms.waitTillTaskStopped(dateFilteredTaskName);
  const startStatus = await dms.startTask(dateFilteredTaskName, 'resume-processing');
  logger.debug('status of startTask is %s', startStatus);
};

/**
 * Adds source filters to the "datefiltered" dataset.
 * @param options - the options to add to
 */
function addDateFilters(options: Options) {
  const { highLevelWindowDays,
    deploymentWindowMonths,
    deploymentWindowDays } = config();

  const highLevelSlotTimeWindow = Duration.fromObject({ days: highLevelWindowDays });
  const deploymentTimeWindow = Duration.fromObject({ months: deploymentWindowMonths })
                                       .minus({ days: deploymentWindowDays });
  const startDate = DateTime.local();
  const endDate =  startDate.plus(highLevelSlotTimeWindow);

  addBetweenFilter(options, 'PROGRAMME', 'PROGRAMME_DATE', startDate, endDate);
  addBetweenFilter(options, 'PROGRAMME_SLOT', 'PROGRAMME_DATE', startDate, endDate);

  const personalCommitmentEndDate = startDate.plus(highLevelSlotTimeWindow);
  const personalCommitmentEndDateTime = personalCommitmentEndDate.plus({ hours: 23, minutes: 59, seconds: 59 });

  addOnOrBeforeFilter(options, 'PERSONAL_COMMITMENT', 'START_DATE_TIME',
                      personalCommitmentEndDateTime);
  addOnOrAfterFilter(options, 'PERSONAL_COMMITMENT', 'END_DATE_TIME', startDate);

  const deploymentEndDate =  startDate.plus(deploymentTimeWindow);
  addOnOrBeforeFilter(options, 'DEPLOYMENT', 'START_DATE', deploymentEndDate);
  addOnOrAfterFilter(options, 'DEPLOYMENT', 'END_DATE', startDate);
}
