/**
 * Node.js Typescript CLI app to generate and run DMS tasks.
 * @author BJSS and Kainos
 * @copyright Crown Copyright (c) 2019
 */
import { getLogger } from './util';
import { DmsApi } from './dms';
import { addBetweenFilter, addOnOrAfterFilter, addOnOrBeforeFilter, Options } from './table-mapping';
import { DateTime, Duration } from 'luxon';

const logger = getLogger('cli-app', 'debug');
const dms = new DmsApi('eu-west-1');


/**
 * Adds source filters to the "Slot" dataset.
 * @param options - the options to add to
 */
function addSlotFilters(options: Options) {
    const endDate =  startDate.plus(highLevelSlotTimeWindow);
    addBetweenFilter(options, 'PROGRAMME', 'PROGRAMME_DATE', startDate, endDate);
    addBetweenFilter(options, 'PROGRAMME_SLOT', 'PROGRAMME_DATE', startDate, endDate);
}

/**
 * Adds source filters to the "Other" dataset.
 * @param options - the options to add to
 */
function addOtherTablesFilters(options: Options) {
    // all personal commitments that overlap with our time window of interest
    const personalCommitmentEndDate = startDate.plus(highLevelSlotTimeWindow);
    // As we're querying PersonalCommitment on DateTime, we need to include the whole day
    const personalCommitmentEndDateTime = personalCommitmentEndDate.plus({ hours: 23, minutes: 59, seconds: 59 });
    addOnOrBeforeFilter(options, 'PERSONAL_COMMITMENT', 'START_DATE_TIME', personalCommitmentEndDateTime); // i.e. start before or during
    addOnOrAfterFilter(options, 'PERSONAL_COMMITMENT', 'END_DATE_TIME', startDate); // i.e. end during or after

    // all deployments that overlap with our time window of interest
    const deploymentEndDate =  startDate.plus(deploymentTimeWindow);
    addOnOrBeforeFilter(options, 'DEPLOYMENT', 'START_DATE', deploymentEndDate); // i.e. start before or during
    addOnOrAfterFilter(options, 'DEPLOYMENT', 'END_DATE', startDate); // i.e. end during or after
}

/**
 * Creates (or updates) all DMS tasks.
 */
async function createAllTasks(): Promise<void> {
    try {
        const sourceEndpointArn = await dms.getEndpointArn('mes-dev-dms-source');
        logger.debug("source endpoint arn is %s", sourceEndpointArn);

        const destEndpointArn = await dms.getEndpointArn('mes-dev-dms-target');
        logger.debug("dest endpoint arn is %s", destEndpointArn);

        const replicationInstanceArn = await dms.getReplicationInstanceArn('mes-dev-dms-replicator');
        logger.debug("repl instance arn is %s", replicationInstanceArn);

        await dms.createTask('examiner-full-load-and-cdc', '../table-mappings/examiner-tables.json',
                   replicationInstanceArn, sourceEndpointArn, destEndpointArn);

        await dms.createTask('slot-full-load-and-cdc', '../table-mappings/slot-tables.json',
                   replicationInstanceArn, sourceEndpointArn, destEndpointArn, addSlotFilters);

        await dms.createTask('other-full-load-and-cdc', '../table-mappings/other-tables.json',
                   replicationInstanceArn, sourceEndpointArn, destEndpointArn, addOtherTablesFilters);      

        await dms.createTask('slotDetail-full-load-and-cdc', '../table-mappings/slotDetail-tables.json',
                  replicationInstanceArn, sourceEndpointArn, destEndpointArn); 

        await dms.createTask('application-full-load-and-cdc', '../table-mappings/application-tables.json',
                  replicationInstanceArn, sourceEndpointArn, destEndpointArn);

    } catch (e) {
        logger.error("Error creating DMS task: %s", e);
    }
}


// pretend today is...
const startDate = DateTime.fromISO('2017-08-03');

// time window to migrate detailed journal data (i.e. slots and bookings with candidate details etc)
// used for the "Test Slots" and "Non Test Activities" datasets
// => 4 elaspsed days (today plus 3 further days) is the maximum amount (e.g. on thursday - fri/sat/sun/mon)
const detailedSlotTimeWindow = Duration.fromObject({ days: 3});

// time window to migrate high level journal data (i.e. slots without and booking/candidate details etc) 
// used for the "Personal Commitments" and "Advanced Test Slots" datasets
// => 14 elapsed days (today plus 13 further days)
const highLevelSlotTimeWindow = Duration.fromObject({ days: 13}); 

// time window to migrate deployments (i.e. notice of being deployed out to another test centre)
// used for the "Deployments" dataset
// => 6 months elapsed days of deployments (including today)
const deploymentTimeWindow = Duration.fromObject({ months: 6 }).minus({ days: 1 });

logger.debug("Creating tasks, starting on %s", startDate.toISODate());
logger.debug("Migrating %d days of detailed journal data", detailedSlotTimeWindow.toFormat('d'));
logger.debug("Migrating %d days of high level journal data", highLevelSlotTimeWindow.toFormat('d'));
logger.debug("Migrating %d days of deployment data", deploymentTimeWindow.toFormat('d'));

createAllTasks();
