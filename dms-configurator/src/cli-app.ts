/**
 * Node.js Typescript CLI app to generate and run DMS tasks.
 */
import { getLogger, loadJSON } from './util';
import { DmsApi } from './dms';
import { generateTableMapping } from './table-mapping';

const logger = getLogger('cli-app', 'debug');

async function createTask(): Promise<void> {
    try {
        const dms = new DmsApi('eu-west-1');

        const sourceEndpointArn = await dms.getEndpointArn('tarsuat1-endpoint');
        logger.debug("source endpoint arn is %s", sourceEndpointArn);

        const destEndpointArn = await dms.getEndpointArn('tarsuat1-repl-endpoint');
        logger.debug("dest endpoint arn is %s", destEndpointArn);

        const replicationInstanceArn = await dms.getReplicationInstanceArn('tarsuat1-dms');
        logger.debug("repl instance arn is %s", replicationInstanceArn);

        const tableMappingInput = loadJSON('../dms-config/examiner-tables.json');
        const tableMapping = JSON.stringify(generateTableMapping(tableMappingInput));

        const status = await dms.createFullLoadTask('examiner-full-load', replicationInstanceArn, 
                                                    sourceEndpointArn, destEndpointArn, tableMapping);
        logger.debug("new task status is %s", status);

    } catch (e) {
        logger.error("Error creating DMS task: %s", e);
    }
}

logger.debug("App started...");
createTask();
