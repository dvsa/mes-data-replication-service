/**
 * Node.js Typescript CLI app to generate and run DMS tasks.
 */
import { getLogger, loadJSON } from './util';
import { DmsApi } from './dms';
import { addBetweenFilter, generateTableMapping, Options } from './table-mapping';
import { DateTime } from 'luxon';

const logger = getLogger('cli-app', 'debug');
const dms = new DmsApi('eu-west-1');

type UpdateTableMappingCallback = (options: Options) => void;

function addSlotDateRange(options: Options) {
    const startDate = DateTime.fromISO('2017-08-10');
    
    // 4 elaspsed days is the maximum amount of detailed journal data (e.g. on thursday - fri/sat/sun/mon)
    const endDate = startDate.plus({ days: 3 }); 

    addBetweenFilter(options, 'PROGRAMME', 'PROGRAMME_DATE', startDate, endDate);
    logger.debug("Filtering PROGRAMME on PROGRAMME_DATE from %s to %s", startDate.toISODate(), endDate.toISODate());

    addBetweenFilter(options, 'PROGRAMME_SLOT', 'PROGRAMME_DATE', startDate, endDate);
    logger.debug("Filtering PROGRAMME_SLOT on PROGRAMME_DATE from %s to %s", startDate.toISODate(), endDate.toISODate());
}

async function createTask(taskName: string, inputFilename: string, replicationInstanceArn: string,
                          sourceEndpointArn: string, destEndpointArn: string,
                          callback?: UpdateTableMappingCallback): Promise<void> {
   const tableMappingInput: Options = loadJSON(inputFilename);
    if (callback) {
        callback(tableMappingInput);
    }
    const tableMapping = JSON.stringify(generateTableMapping(tableMappingInput));

    const status = await dms.createOrUpdateFullLoadTask(taskName, replicationInstanceArn, 
                                 sourceEndpointArn, destEndpointArn, tableMapping);
    logger.debug("%s task status is %s", taskName, status);
}

async function createAllTasks(): Promise<void> {
    try {
        const sourceEndpointArn = await dms.getEndpointArn('tarsuat1-endpoint');
        logger.debug("source endpoint arn is %s", sourceEndpointArn);

        const destEndpointArn = await dms.getEndpointArn('tarsuat1-repl-endpoint');
        logger.debug("dest endpoint arn is %s", destEndpointArn);

        const replicationInstanceArn = await dms.getReplicationInstanceArn('tarsuat1-dms');
        logger.debug("repl instance arn is %s", replicationInstanceArn);

        await createTask('examiner-full-load', '../table-mappings/examiner-tables.json',
                   replicationInstanceArn, sourceEndpointArn, destEndpointArn);

        await createTask('slot-full-load', '../table-mappings/slot-tables.json',
                   replicationInstanceArn, sourceEndpointArn, destEndpointArn, addSlotDateRange);

    } catch (e) {
        logger.error("Error creating DMS task: %s", e);
    }
}

logger.debug("App started...");
createAllTasks();
