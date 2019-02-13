import { AllDatasets } from '../framework/handler';
import { groupBy } from 'lodash';
import { ExaminerWorkSchedule } from '../../../common/domain/Schema';
import { JournalWrapper } from '../domain/journal-wrapper';
import * as crypto from 'crypto';

export const transform = (examiners: any[], datasets: AllDatasets): JournalWrapper[] => {
  const advanceTestSlotByExaminer = groupBy(datasets.advanceTestSlots, ats => ats.examinerId);
  const deploymentsByExaminer = groupBy(datasets.deployments, deployment => deployment.examinerId);
  const nonTestActivitiesByExaminer = groupBy(
    datasets.nonTestActivities,
    nonTestActivity => nonTestActivity.examinerId,
  );
  const personalCommitmentsByExaminer = groupBy(
    datasets.personalCommitments,
    personalCommitment => personalCommitment.examinerId,
  );
  const testSlotsByExaminer = groupBy(
    datasets.testSlots,
    test => test.examinerId,
  );

  const journals: JournalWrapper[] = examiners.map((examiner) => {
    const individualId = examiner.individual_id.toString();
    const staffNumber = examiner.staff_number.toString();
    const journal: ExaminerWorkSchedule = {
      examiner: {
        staffNumber,
      },
    };

    if (testSlotsByExaminer[individualId]) {
      journal.testSlots = testSlotsByExaminer[individualId]
        .map(examinerTestSlot => examinerTestSlot.testSlot);
    }

    if (personalCommitmentsByExaminer[individualId]) {
      journal.personalCommitments = personalCommitmentsByExaminer[individualId]
        .map(examinerPersonalCommitment => examinerPersonalCommitment.personalCommitment);
    }

    if (nonTestActivitiesByExaminer[individualId]) {
      journal.nonTestActivities = nonTestActivitiesByExaminer[individualId]
        .map(examinerNonTestActivity => examinerNonTestActivity.nonTestActivity);
    }

    if (advanceTestSlotByExaminer[individualId]) {
      journal.advanceTestSlots = advanceTestSlotByExaminer[individualId]
        .map(examinerAdvanceTestSlot => examinerAdvanceTestSlot.advanceTestSlot);
    }

    if (deploymentsByExaminer[individualId]) {
      journal.deployments = deploymentsByExaminer[individualId]
        .map(examinerDeployment => examinerDeployment.deployment);
    }
    const hash = crypto.createHash('sha256').update(JSON.stringify(journal)).digest('hex');
    const lastUpdatedAt = Date.now();
    return { staffNumber, hash, lastUpdatedAt, journal };
  });

  return journals;
};
