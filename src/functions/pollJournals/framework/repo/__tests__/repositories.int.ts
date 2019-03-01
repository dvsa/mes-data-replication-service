import { advanceTestSlotsIntegrationTests } from '../mysql/__tests__/advance-test-slot-repository.int.module';
import { personalCommitmentIntegrationTests } from '../mysql/__tests__/personal-commitment-repository.int.module';
import { dynamoDBIntegrationTests } from '../dynamodb/__tests__/journal-repository.int.module';
import * as compose from 'docker-compose';
const dockerMonitor = require('node-docker-monitor');
import * as dotenv from 'dotenv';
import { stopSlsOffline, startSlsOffline } from '../../../../../../spec/helpers/integration-test-lifecycle';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 3 * 60 * 1000;

describe('Repository integration tests', () => {
  beforeAll((done) => {
    process.env.NODE_ENV = 'int';
    process.env.IS_OFFLINE = 'true';
    dotenv.config();
    startSlsOffline(() => {
      console.log('Starting MySQL...');
      compose.upAll({ cwd: 'e2e', log: true }).then(() => {
        dockerMonitor({
          onContainerUp: () => {},
          onContainerDown: (container: any) => {
            if (container.Name === 'mes-data-replication-service-e2e-migration') {
              console.log('MySQL migration completed');
              done();
            }
          },
        });
      });
    });
  });

  afterAll(() => {
    stopSlsOffline();
    return compose.down({ cwd: 'e2e' });
  });

  describe('MySQL repo suites', () => {
    personalCommitmentIntegrationTests();
    advanceTestSlotsIntegrationTests();
  });

  describe('DynamoDB repo suites', () => {
    dynamoDBIntegrationTests();
  });
});
