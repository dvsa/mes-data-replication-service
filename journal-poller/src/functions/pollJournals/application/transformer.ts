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
    const staffNumber = examiner.staff_number.toString();
    const journal: ExaminerWorkSchedule = {
      examiner: {
        staffNumber,
      },
    };

    if (testSlotsByExaminer[staffNumber]) {
      journal.testSlots = testSlotsByExaminer[staffNumber]
        .map(examinerTestSlot => examinerTestSlot.testSlot);
    }

    if (personalCommitmentsByExaminer[staffNumber]) {
      journal.personalCommitments = personalCommitmentsByExaminer[staffNumber]
        .map(examinerPersonalCommitment => examinerPersonalCommitment.personalCommitment);
    }

    if (nonTestActivitiesByExaminer[staffNumber]) {
      journal.nonTestActivities = nonTestActivitiesByExaminer[staffNumber]
        .map(examinerNonTestActivity => examinerNonTestActivity.nonTestActivity);
    }

    if (advanceTestSlotByExaminer[staffNumber]) {
      journal.advanceTestSlots = advanceTestSlotByExaminer[staffNumber]
        .map(examinerAdvanceTestSlot => examinerAdvanceTestSlot.advanceTestSlot);
    }

    if (deploymentsByExaminer[staffNumber]) {
      journal.deployments = deploymentsByExaminer[staffNumber]
        .map(examinerDeployment => examinerDeployment.deployment);
    }
    const hash = crypto.createHash('sha256').update(JSON.stringify(journal)).digest('hex');
    const lastUpdatedAt = Date.now();
    return { staffNumber, hash, lastUpdatedAt, journal };
  });

  return journals;
};
