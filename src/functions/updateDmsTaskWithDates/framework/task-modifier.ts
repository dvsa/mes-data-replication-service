import { getLogger } from './util';
import { DmsApi } from './dms/dms';
import { addBetweenFilter, addOnOrAfterFilter, addOnOrBeforeFilter, Options } from './dms/table-mapping';
import { DateTime, Duration } from 'luxon';
import { config } from './config/config';
import winston = require('winston');

export const modifyTask = async (): Promise<void> => {
  const { dateFilteredTaskName,
    environmentPrefix,
    sourceArn,
    targetArn,
    replicationArn,
    awsRegion,
   } = config();
  const logger = getLogger('cli-app', 'debug');
  const dms = new DmsApi(awsRegion);

  logger.debug('source endpoint arn is %s', sourceArn);
  logger.debug('dest endpoint arn is %s', targetArn);
  logger.debug('repl instance arn is %s', replicationArn);

  const dateTaskName = `${environmentPrefix}-${dateFilteredTaskName}`;

  await stopTaskIfExistsAndRunning(dateTaskName, dms, logger);

  await dms.createOrModifyTask(dateTaskName,
                               replicationArn,
                               sourceArn,
                               targetArn,
                               addDateFilters);

  await startTaskWhenReady(dateTaskName, dms, logger);
};

async function startTaskWhenReady(taskName: string, dms: DmsApi, logger: winston.Logger) {
  await dms.waitForDesiredTaskStatus(taskName, ['ready', 'stopped']);
  const startStatus = await dms.startTask(taskName, 'reload-target');
  logger.debug('status of startTask is %s', startStatus);

}
async function stopTaskIfExistsAndRunning(taskName: string, dms: DmsApi, logger: winston.Logger) {
  let taskStatus = '';
  try {
    taskStatus = await dms.getTaskStatus(taskName);
  } catch (error) {
    console.log(error);
    taskStatus = 'nonexistant';
  }

  if (taskStatus !== 'stopped' && taskStatus !== 'nonexistant') {
    try {
      const stopStatus = await dms.stopTask(taskName);
      logger.debug('status of stopTask is %s', stopStatus);
      await dms.waitTillTaskStopped(taskName);
    } catch (error) {
      console.error(error);
    }
  }
}
/**
 * Adds source filters to the "datefiltered" dataset.
 * @param options - the options to add to
 */
function addDateFilters(options: Options) {
  const {
    highLevelWindowDays,
    deploymentWindowMonths,
    deploymentWindowDays,
  } = config();

  const highLevelSlotTimeWindow = Duration.fromObject({ days: highLevelWindowDays });
  const deploymentTimeWindow = Duration.fromObject({ months: deploymentWindowMonths })
    .minus({ days: deploymentWindowDays });
  const startDate = DateTime.local();
  const endDate = startDate.plus(highLevelSlotTimeWindow);

  addBetweenFilter(options, 'PROGRAMME', 'PROGRAMME_DATE', startDate, endDate);
  addBetweenFilter(options, 'PROGRAMME_SLOT', 'PROGRAMME_DATE', startDate, endDate);

  const personalCommitmentEndDate = startDate.plus(highLevelSlotTimeWindow);
  const personalCommitmentEndDateTime = personalCommitmentEndDate.plus({ hours: 23, minutes: 59, seconds: 59 });

  addOnOrBeforeFilter(options, 'PERSONAL_COMMITMENT', 'START_DATE_TIME',
                      personalCommitmentEndDateTime);
  addOnOrAfterFilter(options, 'PERSONAL_COMMITMENT', 'END_DATE_TIME', startDate);

  const deploymentEndDate = startDate.plus(deploymentTimeWindow);
  addOnOrBeforeFilter(options, 'DEPLOYMENT', 'START_DATE', deploymentEndDate);
  addOnOrAfterFilter(options, 'DEPLOYMENT', 'END_DATE', startDate);
}
