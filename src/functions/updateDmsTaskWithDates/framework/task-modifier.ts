import { getLogger } from './util';
import { DmsApi } from './dms/dms';
import { addBetweenFilter, addOnOrAfterFilter, addOnOrBeforeFilter, Options } from './dms/table-mapping';
import { DateTime, Duration } from 'luxon';
import { config } from './config/config';

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

  const sourceEndpointArn = sourceArn;
  logger.debug('source endpoint arn is %s', sourceEndpointArn);

  const destEndpointArn = targetArn;
  logger.debug('dest endpoint arn is %s', destEndpointArn);

  const replicationInstanceArn = replicationArn;
  logger.debug('repl instance arn is %s', replicationInstanceArn);

  const dateTaskName = `${environmentPrefix}-${dateFilteredTaskName}`;
  let taskStatus:string = '';

  try {
    taskStatus = await dms.getTaskStatus(dateTaskName);
  } catch (error) {
    console.log(error);
    taskStatus = 'nonexistant';
  }

  if (taskStatus !== 'stopped' && taskStatus !== 'nonexistant') {
    try {
      const stopStatus = await dms.stopTask(dateTaskName);
      logger.debug('status of stopTask is %s', stopStatus);
      await dms.waitTillTaskStopped(dateTaskName);
    } catch (error) {
      console.error(error);
    }
  }
  await dms.createTask(dateTaskName,
                       replicationInstanceArn,
                       sourceEndpointArn,
                       destEndpointArn,
                       addDateFilters);

  await dms.waitForDesiredTaskStatus(dateTaskName, ['ready', 'stopped']);
  const startStatus = await dms.startTask(dateTaskName, 'reload-target');
  logger.debug('status of startTask is %s', startStatus);
};

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
