/**
 * Wraps the AWS DMS API.
 */
import * as DMS from 'aws-sdk/clients/dms'; // just the DMS apis, not the whole SDK
import * as escapeJSON from 'escape-json-node';
import { generateTableMapping, Options } from './table-mapping';
import { getLogger } from '../util';
import { config } from '../config/config';
import { getDmsOptions } from '../config/options';
import { taskSettings } from '../config/task-settings';
type UpdateTableMappingCallback = (options: Options) => void;

export class DmsApi {
  private dms: DMS;
  private logger = getLogger('DmsApi', 'debug');

  constructor(readonly region: string) {
    this.dms = new DMS({ apiVersion: '2016-01-01', region: `${region}` });
  }

  getEndpointArn(identifier: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      const params = {
        Filters: [{
          Name: 'endpoint-id',
          Values: [identifier],
        }],
      };

      this.dms.describeEndpoints(params, (err, data) => {
        if (err) {
          if (err.code === 'ResourceNotFoundFault') {
            this.logger.error('Endpoint %s not found', identifier);
            reject('No such endpoint');
          } else {
            this.logger.error('Error calling describeEndpoints: %j', err);
            reject(err);
          }

        } else {
          resolve(data.Endpoints[0].EndpointArn);
        }
      });
    });
  }

  getReplicationInstanceArn(identifier: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      const params = {
        Filters: [{
          Name: 'replication-instance-id',
          Values: [identifier],
        }],
      };

      this.dms.describeReplicationInstances(params, (err, data) => {
        if (err) {
          if (err.code === 'ResourceNotFoundFault') {
            this.logger.error('Replication Instance %s not found', identifier);
            reject('No such instance');

          } else {
            this.logger.error('Error calling describeReplicationInstances: %j', err);
            reject(err);
          }

        } else {
          resolve(data.ReplicationInstances[0].ReplicationInstanceArn);
        }
      });
    });
  }

  async getTaskStatus(taskName: string): Promise<string> {
    const taskArn = await this.getTaskArn(taskName);
    return new Promise<string>((resolve, reject) => {
      const params: DMS.Types.DescribeReplicationTasksMessage = {
        Filters: [
          { Name: 'replication-task-arn', Values: [taskArn] },
        ],
      };

      this.dms.describeReplicationTasks(params, (err, data) => {
        if (err) {
          if (err.code === 'ResourceNotFoundFault') {
            this.logger.error('Replication Instance %s not found', taskName);
            reject('No such instance');
          } else {
            this.logger.error('Error calling describeReplicationInstances: %j', err);
            reject(err);
          }
        } else {
          resolve(data.ReplicationTasks[0].Status);
        }
      });
    });
  }

  async stopTask(taskName: string): Promise<string> {
    const taskArn = await this.getTaskArn(taskName);
    const  params = {
      ReplicationTaskArn: taskArn };
    return new Promise<string>((resolve, reject) => {
      const stopReplicationTask = this.dms.stopReplicationTask(params, (err, data) => {
        if (err) {
          this.logger.error('Error calling stopTask %j', err);
          reject(err);
        } else {
          console.log(`stop task ${data.ReplicationTask.Status}`);
          resolve(data.ReplicationTask.Status);
        }
      });
    });
  }

  async startTask(taskName: string, taskType: 'start-replication' | 'resume-processing' | 'reload-target') {
    const taskArn = await this.getTaskArn(taskName);
    const  params = {
      ReplicationTaskArn: taskArn,
      StartReplicationTaskType: taskType };
    return new Promise<string>((resolve, reject) => {
      const startReplicationTask = this.dms.startReplicationTask(params, (err, data) => {
        if (err) {
          this.logger.error('Error calling startTask %j', err);
          reject(err);
        } else {
          resolve(data.ReplicationTask.Status);
        }
      });
    });
  }

  async createTask(taskName: string, replicationInstanceArn: string,
                   sourceEndpointArn: string, destEndpointArn: string,
                   callback?: UpdateTableMappingCallback): Promise<void> {
    const tableMappingInput: Options = getDmsOptions();
    if (callback) {
      callback(tableMappingInput);
    }
    const tableMapping = JSON.stringify(generateTableMapping(tableMappingInput));

    const status = await this.createOrUpdateFullLoadTask(taskName, replicationInstanceArn,
                                                         sourceEndpointArn, destEndpointArn, tableMapping);
    this.logger.debug('%s task status is %s', taskName, status);
  }

  private async createOrUpdateFullLoadTask(taskName: string, replicationInstanceArn: string,
                                           sourceEndpointArn: string, destEndpointArn: string,
                                           tableMappings: string): Promise<string> {
    try {
      const taskArn = await this.getTaskArn(taskName);
      this.logger.debug('Task %s already exists, so updating it...', taskName);
      return await this.updateTask(taskArn, tableMappings);

    } catch (e) {
      if (e === 'No such task') {
        this.logger.debug('Task %s doesn\'t already exist, so creating it...', taskName);
        return await this.createFullLoadTask(taskName, replicationInstanceArn,
                                             sourceEndpointArn, destEndpointArn, tableMappings);
      }
      throw e;
    }
  }

  private createFullLoadTask(taskName: string, replicationInstanceArn: string,
                             sourceEndpointArn: string, destEndpointArn: string,
                             tableMappings: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      const params = {
        MigrationType: 'full-load-and-cdc',
        ReplicationInstanceArn: replicationInstanceArn,
        ReplicationTaskIdentifier: taskName,
        ReplicationTaskSettings: JSON.stringify(taskSettings),
        SourceEndpointArn: sourceEndpointArn,
        TableMappings: escapeJSON(tableMappings),
        TargetEndpointArn: destEndpointArn,
      };

      this.dms.createReplicationTask(params, (err, data) => {
        if (err) {
          this.logger.error('Error calling createReplicationTask: %j', err);
          reject(err);

        } else {
          resolve(data.ReplicationTask.Status);
        }
      });
    });
  }

  private updateTask(taskArn: string, tableMappings: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      const params = {
        ReplicationTaskArn: taskArn,
        TableMappings: escapeJSON(tableMappings),
      };

      this.dms.modifyReplicationTask(params, (err, data) => {
        if (err) {
          this.logger.error('Error calling modifyReplicationTask: %j', err);
          reject(err);

        } else {
          resolve(data.ReplicationTask.Status);
        }
      });
    });
  }

  async waitForDesiredTaskStatus(taskName: string, desiredStatus: string[]) {
    const { maxRetries, retryDelay } = config();
    let status = '';
    let retryCount = 0;

    do {
      await this.delay(retryDelay);
      status = await this.getTaskStatus(taskName);
      retryCount = retryCount + 1;
    } while (desiredStatus.findIndex(desired => desired === status) < 0 && retryCount < maxRetries);
  }

  async waitTillTaskStopped(taskName: string): Promise<any> {
    const { maxRetries, retryDelay } = config();
    let status = '';
    let retryCount = 0;

    do {
      await this.delay(retryDelay);
      status = await this.getTaskStatus(taskName);
      retryCount = retryCount + 1;
    } while (status !== 'stopped' && retryCount < maxRetries);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getTaskArn(taskName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      const params = {
        Filters: [{
          Name: 'replication-task-id',
          Values: [taskName],
        }],
      };

      this.dms.describeReplicationTasks(params, (err, data) => {
        if (err) {
          if (err.code === 'ResourceNotFoundFault') {
            this.logger.error('Replication Task %s not found', taskName);
            reject('No such task');

          } else {
            this.logger.error('Error calling describeReplicationTasks: %j', err);
            reject(err);
          }

        } else {
          resolve(data.ReplicationTasks[0].ReplicationTaskArn);
        }
      });
    });
  }
}
