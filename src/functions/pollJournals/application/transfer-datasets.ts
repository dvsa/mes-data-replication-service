import * as moment from 'moment';
import { getTestSlots } from '../framework/repo/mysql/test-slot-repository';
import { getPersonalCommitments } from '../framework/repo/mysql/personal-commitment-repository';
import { getNonTestActivities } from '../framework/repo/mysql/non-test-activity-repository';
import { getAdvanceTestSlots } from '../framework/repo/mysql/advance-test-slots-repository';
import { getDeployments } from '../framework/repo/mysql/deployment-repository';
import { createConnectionPool } from '../framework/repo/mysql/pool';
import { getExaminers } from '../framework/repo/mysql/examiner-repository';
import { AllDatasets } from '../domain/all-datasets';
import { JournalRecord } from '../domain/journal-record';
import { buildJournals } from './journal-builder';
import { saveJournals } from '../framework/repo/dynamodb/journal-repository';
import { filterChangedJournals } from './journal-change-filter';
import { getNextWorkingDay } from '../framework/repo/mysql/journal-end-date-repository';
import { config } from '../framework/config/config';

export const transferDatasets = async (startTime: Date): Promise<void> => {
  const connectionPool = createConnectionPool();

  console.log(`STARTING QUERY PHASE: ${new Date()}`);

  let startDate: Date;

  if (config().timeTravelDate != null) {
    // Assumes fixed format for TIME_TRAVEL_DATE, e.g. 2019-03-13
    startDate = moment(config().timeTravelDate).toDate();
  } else {
    // time window starts at the beginning of the initial day
    startDate = moment(startDate).startOf('day').toDate();
  }

  let journalStartDate: Date;

  if (config().timeTravelDate != null) {
    // Assumes fixed format for TIME_TRAVEL_DATE, e.g. 2019-03-13
    journalStartDate = moment(config().timeTravelDate).subtract(14, 'days').toDate();
  } else {
    // time window starts at the beginning of the initial day
    journalStartDate = moment(startDate).subtract(14, 'days').startOf('day').toDate();
  }

  const [
    examiners,
    nextWorkingDay,
  ] = await Promise.all([
    getExaminers(connectionPool, startDate),
    getNextWorkingDay(connectionPool, startDate),
  ]);
  const examinerIds = examiners.map(examiner => examiner.individual_id);

  console.log(`Loading journals for ${examiners.length} examiners from ${formatDate(journalStartDate)}` +
    ` to ${formatDate(nextWorkingDay)}...`);

  const [
    testSlots,
    personalCommitments,
    nonTestActivities,
    advanceTestSlots,
    deployments,
  ] = await Promise.all([
    getTestSlots(connectionPool, examinerIds, journalStartDate, nextWorkingDay),
    getPersonalCommitments(connectionPool, startDate, 14), // 14 days range
    getNonTestActivities(connectionPool, startDate, nextWorkingDay),
    getAdvanceTestSlots(connectionPool, startDate, nextWorkingDay, 14), // 14 days range
    getDeployments(connectionPool, startDate, 6), // 6 months range
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
  const journals: JournalRecord[] = buildJournals(examiners, datasets);
  console.log(`FINISHED TRANFORM PHASE, STARTING FILTER PHASE: ${new Date()}`);

  const changedJournals = await filterChangedJournals(journals, startTime);
  console.log(`FINISHED FILTER PHASE, STARTING SAVE PHASE FOR ${changedJournals.length} JOURNALS: ${new Date()}`);
  console.log(JSON.stringify({
    service: 'journals-poller',
    name: 'JournalsChanged',
    description: 'Number of Journals found to have changed',
    value: changedJournals.length,
  }));

  await saveJournals(changedJournals, startTime);
  console.log(`FINISHED SAVE PHASE: ${new Date()}`);
};

const formatDate = (date: Date): string => {
  return moment(date).format('DD-MM-YYYY');
};
