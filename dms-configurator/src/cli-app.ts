/**
 * Node.js Typescript CLI app to generate and run DMS tasks.
 */
import { getLogger } from './util';
import { DmsApi } from './dms';
import { addBetweenFilter, addOnOrAfterFilter, addOnOrBeforeFilter, Options } from './table-mapping';
import { DateTime } from 'luxon';

const logger = getLogger('cli-app', 'debug');
const dms = new DmsApi('eu-west-1');

function addExaminerFilters(options: Options) {
    addOnOrBeforeFilter(options, 'POSTING', 'START_DATE', startDate);
    addOnOrAfterFilter(options, 'POSTING', 'END_DATE', startDate);
}

function addSlotFilters(options: Options) {
    const endDate =  startDate.plus({ days: slotDateRangeDays });

    addBetweenFilter(options, 'PROGRAMME', 'PROGRAMME_DATE', startDate, endDate);
    addBetweenFilter(options, 'PROGRAMME_SLOT', 'PROGRAMME_DATE', startDate, endDate);
}

function addslotDetailFilters(options: Options) {
    // todo add filters for slotDetail here
}


async function createAllTasks(): Promise<void> {
    try {
        const sourceEndpointArn = await dms.getEndpointArn('tarsuat1-endpoint');
        logger.debug("source endpoint arn is %s", sourceEndpointArn);

        const destEndpointArn = await dms.getEndpointArn('tarsuat1-repl-endpoint');
        logger.debug("dest endpoint arn is %s", destEndpointArn);

        const replicationInstanceArn = await dms.getReplicationInstanceArn('tarsuat1-dms');
        logger.debug("repl instance arn is %s", replicationInstanceArn);

        await dms.createTask('examiner-full-load', '../table-mappings/examiner-tables.json',
                   replicationInstanceArn, sourceEndpointArn, destEndpointArn, addExaminerFilters);

        await dms.createTask('slot-full-load', '../table-mappings/slot-tables.json',
                   replicationInstanceArn, sourceEndpointArn, destEndpointArn, addSlotFilters);

        await dms.createTask('other-full-load', '../table-mappings/other-tables.json',
                   replicationInstanceArn, sourceEndpointArn, destEndpointArn);      

        await dms.createTask('slotDetail-full-load', '../table-mappings/slotDetail-tables.json',
                  replicationInstanceArn, sourceEndpointArn, destEndpointArn); 

    } catch (e) {
        logger.error("Error creating DMS task: %s", e);
    }
}


// pretend today is...
const startDate = DateTime.fromISO('2017-08-10');

// 4 elaspsed days is the maximum amount of detailed journal data (e.g. on thursday - fri/sat/sun/mon)
const slotDateRangeDays = 3; 

logger.debug("Creating tasks, taking %d days of slots starting on %s", slotDateRangeDays, startDate.toISODate());

createAllTasks();
