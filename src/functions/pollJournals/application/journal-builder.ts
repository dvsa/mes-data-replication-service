import { groupBy, get } from 'lodash';
import { ExaminerWorkSchedule } from '../../../common/domain/Schema';
import { JournalWrapper } from '../domain/journal-wrapper';
import * as crypto from 'crypto';
import { ExaminerNonTestActivity } from '../domain/examiner-non-test-activity';
import { ExaminerAdvanceTestSlot } from '../domain/examiner-advance-test-slot';
import { ExaminerDeployment } from '../domain/examiner-deployment';
import { ExaminerTestSlot } from '../domain/examiner-test-slot';
import { ExaminerPersonalCommitment } from '../domain/examiner-personal-commitment';
import { AllDatasets } from '../domain/all-datasets';

export const buildJournals = (examiners: any[], datasets: AllDatasets): JournalWrapper[] => {
  const testSlotsByExaminer = groupBy(datasets.testSlots, test => test.examinerId);
  const advanceTestsByExaminer = groupBy(datasets.advanceTestSlots, ats => ats.examinerId);
  const deploymentsByExaminer = groupBy(datasets.deployments, deployment => deployment.examinerId);
  const nonTestActByExaminer = groupBy(
    datasets.nonTestActivities,
    nonTestActivity => nonTestActivity.examinerId,
  );
  const commitmentsByExaminer = groupBy(
    datasets.personalCommitments,
    personalCommitment => personalCommitment.examinerId,
  );

  const journals: JournalWrapper[] = examiners.map((examiner) => {
    const indId = examiner.individual_id.toString();
    const staffNumber = examiner.staff_number.toString();
    let journal: ExaminerWorkSchedule = {
      examiner: {
        staffNumber,
      },
    };

    const enrichWithDataset = enrichJournalWithDataset(journal, indId);
    journal = enrichWithDataset(testSlotsByExaminer, 'testSlot');
    journal = enrichWithDataset(commitmentsByExaminer, 'personalCommitment');
    journal = enrichWithDataset(nonTestActByExaminer, 'nonTestActivity');
    journal = enrichWithDataset(advanceTestsByExaminer, 'advanceTestSlot');
    journal = enrichWithDataset(deploymentsByExaminer, 'deployment');

    const hash = crypto.createHash('sha256').update(JSON.stringify(journal)).digest('hex');
    const lastUpdatedAt = Date.now();
    return { staffNumber, hash, lastUpdatedAt, journal };
  });

  return journals;
};

const enrichJournalWithDataset = (
  journal: ExaminerWorkSchedule,
  individualId: string,
) => (
  dataset: { [key: string]: (
    ExaminerTestSlot
    | ExaminerPersonalCommitment
    | ExaminerNonTestActivity
    | ExaminerAdvanceTestSlot
    | ExaminerDeployment
  )[] },
  datasetKey: string,
): ExaminerWorkSchedule => {
  let enrichedJournal = journal;
  if (dataset[individualId]) {
    enrichedJournal =  {
      ...journal,
      [datasetKey]: dataset[individualId].map(ds => get(ds, datasetKey)),
    };
  }
  return enrichedJournal;
};
