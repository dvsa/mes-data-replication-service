/**
 * Node.js Typescript CLI app to generate and run DMS tasks.
 */
import { getLogger, loadJSON } from './util';
import { DmsApi } from './dms';
import { generateTableMapping } from './table-mapping';

const logger = getLogger('cli-app', 'debug');
const dms = new DmsApi('eu-west-1');

async function createTask(taskName: string, inputFilename: string, replicationInstanceArn: string,
                          sourceEndpointArn: string, destEndpointArn: string): Promise<void> {
    const tableMappingInput = loadJSON(inputFilename);
    const tableMapping = JSON.stringify(generateTableMapping(tableMappingInput));

    const status = await dms.createFullLoadTask(taskName, replicationInstanceArn, 
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

        createTask('examiner-full-load', '../table-mappings/examiner-tables.json',
                   replicationInstanceArn, sourceEndpointArn, destEndpointArn);

        createTask('slot-full-load', '../table-mappings/slot-tables.json',
                   replicationInstanceArn, sourceEndpointArn, destEndpointArn);

    } catch (e) {
        logger.error("Error creating DMS task: %s", e);
    }
}

logger.debug("App started...");
createAllTasks();
