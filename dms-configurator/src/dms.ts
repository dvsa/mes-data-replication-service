/**
 * Wraps the AWS DMS API.
 */
import * as DMS from 'aws-sdk/clients/dms'; // just the DMS apis, not the whole SDK
import * as escapeJSON from 'escape-json-node';
import { getLogger } from './util';

export class DmsApi {
    private dms;
    private logger = getLogger('DmsApi', 'debug');

    constructor(readonly region: string) {
        this.dms = new DMS({apiVersion: '2016-01-01', region: `${region}`});
    }

    getEndpointArn(identifier: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {

            const params = {
                Filters: [{
                    Name: 'endpoint-id',
                    Values: [ identifier ]
                }]
            };

            this.dms.describeEndpoints(params, (err, data) => {
                if (err) {
                    this.logger.error("Error calling describeEndpoints: %s", err);
                    reject();
                }
                if (data.Endpoints.length === 0) {
                    this.logger.error("Endpoint %s not found", identifier);
                    reject();
                }

                resolve(data.Endpoints[0].EndpointArn);
            });
        });
    }

    getReplicationInstanceArn(identifier: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {

            const params = {
                Filters: [{
                    Name: 'replication-instance-id',
                    Values: [ identifier ]
                }]
            };

            this.dms.describeReplicationInstances(params, (err, data) => {
                if (err) {
                    this.logger.error("Error calling describeReplicationInstances: %s", err);
                    reject();
                }
                if (data.ReplicationInstances.length === 0) {
                    this.logger.error("Replication Instance %s not found", identifier);
                    reject();
                }

                resolve(data.ReplicationInstances[0].ReplicationInstanceArn);
            });
        });
    }

    createFullLoadTask(taskName: string, replicationInstanceArn: string, 
                       sourceEndpointArn: string, destEndpointArn: string,
                       tableMappings: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {

            const params = {
                MigrationType: 'full-load',
                ReplicationInstanceArn: replicationInstanceArn,
                ReplicationTaskIdentifier: taskName,
                SourceEndpointArn: sourceEndpointArn,
                TableMappings: escapeJSON(tableMappings),
                TargetEndpointArn: destEndpointArn
            };

            this.dms.createReplicationTask(params, (err, data) => {
                if (err) {
                    this.logger.error("Error calling createReplicationTask: %s", err);
                    reject();
                }
                resolve(data.ReplicationTask.Status);
            });
        });
    }
}