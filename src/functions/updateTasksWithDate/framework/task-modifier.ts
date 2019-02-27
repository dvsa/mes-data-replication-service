import { getLogger } from './util';
import { DmsApi } from './dms/dms';
import { addBetweenFilter, addOnOrAfterFilter, addOnOrBeforeFilter, Options } from './dms/table-mapping';
import { DateTime, Duration } from 'luxon';
import { config } from './config/config';
const { dateFilteredTaskName,
    environmentPrefix,
    highLevelWindowDays,
    deploymentWindowMonths,
    deploymentWindowDays } = config();

export const modifyTask = async (): Promise<void> => {
  const logger = getLogger('cli-app', 'debug');
  const dms = new DmsApi('eu-west-1');
  console.log(JSON.stringify(config()));
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
  const startDate = DateTime.local();
    // time window to migrate high level journal data (i.e. slots without and booking/candidate details etc)
    // used for the "Personal Commitments" and "Advanced Test Slots" datasets
    // => 14 elapsed days (today plus 13 further days)
  const highLevelSlotTimeWindow = Duration.fromObject({ days: highLevelWindowDays });

    // time window to migrate deployments (i.e. notice of being deployed out to another test centre)
    // used for the "Deployments" dataset
    // => 6 months elapsed days of deployments (including today)
  const deploymentTimeWindow = Duration.fromObject({ months: deploymentWindowMonths })
                                       .minus({ days: deploymentWindowDays });
  const endDate =  startDate.plus(highLevelSlotTimeWindow);

  addBetweenFilter(options, 'PROGRAMME', 'PROGRAMME_DATE', startDate, endDate);
  addBetweenFilter(options, 'PROGRAMME_SLOT', 'PROGRAMME_DATE', startDate, endDate);
      // all personal commitments that overlap with our time window of interest
  const personalCommitmentEndDate = startDate.plus(highLevelSlotTimeWindow);
      // As we're querying PersonalCommitment on DateTime, we need to include the whole day
  const personalCommitmentEndDateTime = personalCommitmentEndDate.plus({ hours: 23, minutes: 59, seconds: 59 });
  addOnOrBeforeFilter(options, 'PERSONAL_COMMITMENT', 'START_DATE_TIME',
                      personalCommitmentEndDateTime); // i.e. start before or during
  addOnOrAfterFilter(options, 'PERSONAL_COMMITMENT', 'END_DATE_TIME', startDate); // i.e. end during or after
      // all deployments that overlap with our time window of interest
  const deploymentEndDate =  startDate.plus(deploymentTimeWindow);
  addOnOrBeforeFilter(options, 'DEPLOYMENT', 'START_DATE', deploymentEndDate); // i.e. start before or during
  addOnOrAfterFilter(options, 'DEPLOYMENT', 'END_DATE', startDate); // i.e. end during or after
}
