import { groupBy } from 'lodash';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { JournalRecord } from '../domain/journal-record';
import * as crypto from 'crypto';
import { ExaminerNonTestActivity } from '../domain/examiner-non-test-activity';
import { ExaminerAdvanceTestSlot } from '../domain/examiner-advance-test-slot';
import { ExaminerDeployment } from '../domain/examiner-deployment';
import { ExaminerTestSlot } from '../domain/examiner-test-slot';
import { ExaminerPersonalCommitment } from '../domain/examiner-personal-commitment';
import { AllDatasets } from '../domain/all-datasets';
import { compressJournal } from '../application/journal-compressor';
import { ExaminerRecord } from '../domain/examiner-record';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';

export const buildJournals = (examiners: ExaminerRecord[], datasets: AllDatasets): JournalRecord[] => {
  const testSlotsByExaminer: { [examinerId: number]: ExaminerTestSlot[] } = groupBy(
    datasets.testSlots,
    (test: ExaminerTestSlot) => test.examinerId,
  );
  const advanceTestsByExaminer: { [examinerId: number]: ExaminerAdvanceTestSlot[] } = groupBy(
    datasets.advanceTestSlots,
    (ats: ExaminerAdvanceTestSlot) => ats.examinerId,
  );
  const deploymentsByExaminer: { [examinerId: number]: ExaminerDeployment[] } = groupBy(
    datasets.deployments,
    (deployment: ExaminerDeployment) => deployment.examinerId,
  );
  const nonTestActByExaminer: { [examinerId: number]: ExaminerNonTestActivity[] } = groupBy(
    datasets.nonTestActivities,
    (nonTestActivity: ExaminerNonTestActivity) => nonTestActivity.examinerId,
  );
  const commitmentsByExaminer: { [examinerId: number]: ExaminerPersonalCommitment[] } = groupBy(
    datasets.personalCommitments,
    (personalCommitment: ExaminerPersonalCommitment) => personalCommitment.examinerId,
  );

  const journals: (JournalRecord | null)[] = examiners.map((examiner) => {
    const individualId = examiner.individual_id;
    const staffNumber = Number.parseInt(examiner.staff_number, 10);

    if (Number.isNaN(staffNumber)) {
      warn('Omitting journal for non-numeric staff number', staffNumber);
      return null;
    }

    let journal: ExaminerWorkSchedule = {
      examiner: {
        individualId,
        staffNumber: staffNumber.toString(),
      },
    };

    const enrichWithDataset = enrichJournalWithDataset(individualId.toString());
    journal = enrichWithDataset(journal, testSlotsByExaminer, 'testSlot', 'testSlots');
    journal = enrichWithDataset(journal, commitmentsByExaminer, 'personalCommitment', 'personalCommitments');
    journal = enrichWithDataset(journal, nonTestActByExaminer, 'nonTestActivity', 'nonTestActivities');
    journal = enrichWithDataset(journal, advanceTestsByExaminer, 'advanceTestSlot', 'advanceTestSlots');
    journal = enrichWithDataset(journal, deploymentsByExaminer, 'deployment', 'deployments');

    const hash = crypto.createHash('sha256').update(JSON.stringify(journal)).digest('hex');
    const lastUpdatedAt = Date.now();
    const compressedJournal = compressJournal(journal);
    return { staffNumber, hash, lastUpdatedAt, journal: compressedJournal };
  });

  return journals.filter(journal => journal !== null);
};

const enrichJournalWithDataset = (individualId: string) => function <D>(
  journal: ExaminerWorkSchedule,
  dataset: {
    [examinerId: string]: D[],
  },
  datasetKey: keyof D,
  journalKey: keyof ExaminerWorkSchedule,
): ExaminerWorkSchedule {
  let enrichedJournal = journal;
  if (dataset[individualId]) {
    enrichedJournal = {
      ...journal,
      [journalKey]: dataset[individualId].map(ds => ds[datasetKey]),
    };
  }
  return enrichedJournal;
};
