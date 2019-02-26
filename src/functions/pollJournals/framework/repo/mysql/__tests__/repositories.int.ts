import { personalCommitmentIntegrationTests } from './personal-commitment-repository.int.module';
import { advanceTestSlotsIntegrationTests } from './advance-test-slot-repository.int.module';
import * as compose from 'docker-compose';
const dockerMonitor = require('node-docker-monitor');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;

describe('MySQL repository integration tests', () => {
  beforeAll((done) => {
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

  afterAll(() => {
    return compose.down({ cwd: 'e2e' });
  });

  describe('MySQL repo suites', () => {
    personalCommitmentIntegrationTests();
    advanceTestSlotsIntegrationTests();
  });
});
