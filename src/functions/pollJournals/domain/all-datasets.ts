import { ExaminerTestSlot } from './examiner-test-slot';
import { ExaminerPersonalCommitment } from './examiner-personal-commitment';
import { ExaminerNonTestActivity } from './examiner-non-test-activity';
import { ExaminerAdvanceTestSlot } from './examiner-advance-test-slot';
import { ExaminerDeployment } from './examiner-deployment';

export interface AllDatasets {
  testSlots: ExaminerTestSlot[];
  personalCommitments: ExaminerPersonalCommitment[];
  nonTestActivities: ExaminerNonTestActivity[];
  advanceTestSlots: ExaminerAdvanceTestSlot[];
  deployments: ExaminerDeployment[];
}
