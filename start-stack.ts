import { startSlsOffline } from './spec/helpers/integration-test-lifecycle';
const dockerMonitor = require('node-docker-monitor');

process.env.NODE_ENV = 'local';
startSlsOffline().then(() => {
  console.log('dynamoDb started');
  process.exit(0);
});
