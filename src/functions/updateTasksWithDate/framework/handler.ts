import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { addBetweenFilter, addOnOrAfterFilter, addOnOrBeforeFilter, Options } from './table-mapping';
import { DateTime, Duration } from 'luxon';
import { getLogger } from './util';
import { DmsApi } from './dms';

// import { transferDatasets } from '../application/transfer-datasets';
// import { bootstrapConfig } from './config/config';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context): Promise<Response> {
  try {
    const logger = getLogger('cli-app', 'debug');
    const dms = new DmsApi('eu-west-1');
    const startDate = DateTime.local();

    const sourceEndpointArn = await dms.getEndpointArn('mes-perf-dms-source');
    logger.debug('source endpoint arn is %s', sourceEndpointArn);

    const destEndpointArn = await dms.getEndpointArn('mes-perf-dms-target');
    logger.debug('dest endpoint arn is %s', destEndpointArn);

    const replicationInstanceArn = await dms.getReplicationInstanceArn('mes-perf-dms-replicator');
    logger.debug('repl instance arn is %s', replicationInstanceArn);

    // TODO replace magic numbers with config values
    // time window to migrate detailed journal data (i.e. slots and bookings with candidate details etc)
    // used for the "Test Slots" and "Non Test Activities" datasets
    // => 4 elaspsed days (today plus 3 further days) is the maximum amount (e.g. on thursday - fri/sat/sun/mon)
    const detailedSlotTimeWindow = Duration.fromObject({ days: 3 });

    // time window to migrate high level journal data (i.e. slots without and booking/candidate details etc)
    // used for the "Personal Commitments" and "Advanced Test Slots" datasets
    // => 14 elapsed days (today plus 13 further days)
    const highLevelSlotTimeWindow = Duration.fromObject({ days: 13 });

    // time window to migrate deployments (i.e. notice of being deployed out to another test centre)
    // used for the "Deployments" dataset
    // => 6 months elapsed days of deployments (including today)
    const deploymentTimeWindow = Duration.fromObject({ months: 6 }).minus({ days: 1 });
    const stopStatus = await dms.stopTask('dateFiltered-full-load-and-cdc');
    logger.debug('status of stopTask is %s', stopStatus);
    await dms.createTask('dateFiltered-full-load-and-cdc', '../table-mappings/dateFiltered-tables.json',
                         replicationInstanceArn, sourceEndpointArn, destEndpointArn, addDateFilters);
    const startStatus = await dms.startTask('dateFiltered-full-load-and-cdc', 'resume-processing');
    logger.debug('status of startTask is %s', startStatus);

    return createResponse({});
  } catch (error) {
    console.error(error);
    return createResponse({}, 500);
  }

/**
 * Adds source filters to the "datefiltered" dataset.
 * @param options - the options to add to
 */
  function addDateFilters(options: Options) {
    const endDate =  this.startDate.plus(this.highLevelSlotTimeWindow);
    addBetweenFilter(options, 'PROGRAMME', 'PROGRAMME_DATE', this.startDate, endDate);
    addBetweenFilter(options, 'PROGRAMME_SLOT', 'PROGRAMME_DATE', this.startDate, endDate);
      // all personal commitments that overlap with our time window of interest
    const personalCommitmentEndDate = this.startDate.plus(this.highLevelSlotTimeWindow);
      // As we're querying PersonalCommitment on DateTime, we need to include the whole day
    const personalCommitmentEndDateTime = personalCommitmentEndDate.plus({ hours: 23, minutes: 59, seconds: 59 });
    addOnOrBeforeFilter(options, 'PERSONAL_COMMITMENT', 'START_DATE_TIME',
                        personalCommitmentEndDateTime); // i.e. start before or during
    addOnOrAfterFilter(options, 'PERSONAL_COMMITMENT', 'END_DATE_TIME', this.startDate); // i.e. end during or after
      // all deployments that overlap with our time window of interest
    const deploymentEndDate =  this.startDate.plus(this.deploymentTimeWindow);
    addOnOrBeforeFilter(options, 'DEPLOYMENT', 'START_DATE', deploymentEndDate); // i.e. start before or during
    addOnOrAfterFilter(options, 'DEPLOYMENT', 'END_DATE', this.startDate); // i.e. end during or after
  }

}
