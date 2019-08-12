import { stopSlsOffline } from './spec/helpers/integration-test-lifecycle';
import { readFileSync, unlinkSync } from 'fs';
const pid = readFileSync('.sls.pid').toString();
stopSlsOffline(Number.parseInt(pid, 10));
unlinkSync('.sls.pid');
