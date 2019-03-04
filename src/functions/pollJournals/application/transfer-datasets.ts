import { getTestSlots } from '../framework/repo/mysql/test-slot-repository';
import { getPersonalCommitments } from '../framework/repo/mysql/personal-commitment-repository';
import { getNonTestActivities } from '../framework/repo/mysql/non-test-activity-repository';
import { getAdvanceTestSlots } from '../framework/repo/mysql/advance-test-slots-repository';
import { getDeployments } from '../framework/repo/mysql/deployment-repository';
import { createConnectionPool } from '../framework/repo/mysql/pool';
import { getExaminers } from '../framework/repo/mysql/examiner-repository';
import { AllDatasets } from '../domain/all-datasets';
import { JournalWrapper } from '../domain/journal-wrapper';
import { buildJournals } from './journal-builder';
import { chunk } from 'lodash';
import { saveJournals } from '../framework/repo/dynamodb/journal-repository';
import { config } from '../framework/config/config';
import { filterChangedJournals } from './journal-change-filter';

export const transferDatasets = async (): Promise<void> => {
  const { examinerBatchSize } = config();
  const connectionPool = createConnectionPool();

  console.log(`STARTING QUERY PHASE: ${new Date()}`);
  const examiners = await getExaminers(connectionPool);
  const examinerIds = examiners.map(examiner => examiner.individual_id);
  const examinerIdGroups = chunk(examinerIds, examinerBatchSize);

  const [
    testSlots,
    personalCommitments,
    nonTestActivities,
    advanceTestSlots,
    deployments,
  ] = await Promise.all([
    getTestSlots(connectionPool, examinerIdGroups),
    getPersonalCommitments(connectionPool),
    getNonTestActivities(connectionPool),
    getAdvanceTestSlots(connectionPool),
    getDeployments(connectionPool),
  ]);

  const datasets: AllDatasets = {
    testSlots,
    personalCommitments,
    nonTestActivities,
    advanceTestSlots,
    deployments,
  };
  connectionPool.end();

  console.log(`FINISHED QUERY PHASE, STARTING TRANSFORM PHASE: ${new Date()}`);
  const journals: JournalWrapper[] = buildJournals(examiners, datasets);
  console.log(`FINISHED TRANFORM PHASE, STARTING FILTER PHASE: ${new Date()}`);

  const changedJournals = await filterChangedJournals(journals);
  console.log(`FINISHED FILTER PHASE, STARTING SAVE PHASE FOR ${changedJournals.length} JOURNALS: ${new Date()}`);

  await saveJournals(changedJournals);
  console.log(`FINISHED SAVE PHASE: ${new Date()}`);
};
