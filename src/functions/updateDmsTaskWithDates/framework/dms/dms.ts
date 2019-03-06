/**
 * Wraps the AWS DMS API.
 */
import * as DMS from 'aws-sdk/clients/dms'; // just the DMS apis, not the whole SDK
import * as escapeJSON from 'escape-json-node';
import { generateTableMapping, Options } from './table-mapping';
import { getLogger } from '../util';
import { config } from '../config/config';
import { getDmsOptions } from '../config/options';
import { getTaskSettings } from '../config/task-settings';
type UpdateTableMappingCallback = (options: Options) => void;

export class DmsApi {
  private dms: DMS;
  private logger = getLogger('DmsApi', 'debug');

  constructor(readonly region: string) {
    this.dms = new DMS({ apiVersion: '2016-01-01', region: `${region}` });
  }

  async getTaskStatus(taskName: string): Promise<string> {
    const taskArn = await this.getTaskArn(taskName);

    try {
      const params: DMS.Types.DescribeReplicationTasksMessage = {
        Filters: [
          { Name: 'replication-task-arn', Values: [taskArn] },
        ],
      };

      const data = await this.dms.describeReplicationTasks(params).promise();
      return data.ReplicationTasks[0].Status;

    } catch (err) {
      if (err.code === 'ResourceNotFoundFault') {
        this.logger.error('Replication Instance %s not found', taskName);
      } else {
        this.logger.error('Error calling describeReplicationInstances: %j', err);
      }
      throw err;
    }
  }

  async stopTask(taskName: string): Promise<string> {
    const taskArn = await this.getTaskArn(taskName);
    try {
      const  params = {
        ReplicationTaskArn: taskArn,
      };

      const data = await this.dms.stopReplicationTask(params).promise();
      return data.ReplicationTask.Status;
    } catch (err) {
      this.logger.error('Error calling stopTask %j', err);
      throw err;
    }
  }

  async startTask(taskName: string, taskType: 'start-replication' | 'resume-processing' | 'reload-target') {
    const taskArn = await this.getTaskArn(taskName);
    try {
      const params = {
        ReplicationTaskArn: taskArn,
        StartReplicationTaskType: taskType,
      };

      const data = await this.dms.startReplicationTask(params).promise();
      return data.ReplicationTask.Status;
    } catch (err) {
      this.logger.error('Error calling startTask %j', err);
      throw err;
    }
  }

  async createOrModifyTask(taskName: string, replicationInstanceArn: string,
                           sourceEndpointArn: string, destEndpointArn: string,
                           callback?: UpdateTableMappingCallback): Promise<void> {
    const tableMappingInput: Options = getDmsOptions();
    if (callback) {
      callback(tableMappingInput);
    }
    const tableMapping = JSON.stringify(generateTableMapping(tableMappingInput));

    const status = await this.createOrModifyFullLoadTask(taskName, replicationInstanceArn,
                                                         sourceEndpointArn, destEndpointArn, tableMapping);
    this.logger.debug('%s task status is %s', taskName, status);
  }

  private async createOrModifyFullLoadTask(taskName: string, replicationInstanceArn: string,
                                           sourceEndpointArn: string, destEndpointArn: string,
                                           tableMappings: string): Promise<string> {
    try {
      const taskArn = await this.getTaskArn(taskName);
      this.logger.debug('Task %s already exists, so updating it...', taskName);
      return await this.updateTask(taskArn, tableMappings);

    } catch (e) {
      if (e === 'No such task') {
        this.logger.debug('Task %s doesn\'t already exist, so creating it...', taskName);
        return await this.createFullLoadTask(
          taskName,
          replicationInstanceArn,
          sourceEndpointArn,
          destEndpointArn,
          tableMappings,
          );
      }
      throw e;
    }
  }

  private async createFullLoadTask(taskName: string, replicationInstanceArn: string,
                                   sourceEndpointArn: string, destEndpointArn: string,
                                   tableMappings: string): Promise<string> {

    try {
      const params = {
        MigrationType: 'full-load-and-cdc',
        ReplicationInstanceArn: replicationInstanceArn,
        ReplicationTaskIdentifier: taskName,
        ReplicationTaskSettings: JSON.stringify(getTaskSettings()),
        SourceEndpointArn: sourceEndpointArn,
        TableMappings: escapeJSON(tableMappings),
        TargetEndpointArn: destEndpointArn,
      };

      const data = await this.dms.createReplicationTask(params).promise();
      return data.ReplicationTask.Status;
    } catch (err) {
      this.logger.error('Error calling createReplicationTask: %j', err);
      throw err;
    }
  }

  private async updateTask(taskArn: string, tableMappings: string): Promise<string> {

    try {
      const params = {
        ReplicationTaskArn: taskArn,
        TableMappings: escapeJSON(tableMappings),
      };

      const data = await this.dms.modifyReplicationTask(params).promise();
      return data.ReplicationTask.Status;
    } catch (err) {
      this.logger.error('Error calling modifyReplicationTask: %j', err);
      throw err;
    }
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

  private async getTaskArn(taskName: string): Promise<string> {
    try {
      const params = {
        Filters: [{
          Name: 'replication-task-id',
          Values: [taskName],
        }],
      };

      const data = await this.dms.describeReplicationTasks(params).promise();
      return data.ReplicationTasks[0].ReplicationTaskArn;
    } catch (err) {
      if (err.code === 'ResourceNotFoundFault') {
        this.logger.error('Replication Task %s not found', taskName);
      } else {
        this.logger.error('Error calling describeReplicationTasks: %j', err);
      }
      throw err;
    }
  }
}
