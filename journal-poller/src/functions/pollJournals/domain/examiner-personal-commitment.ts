import { PersonalCommitment } from '../../../common/domain/Schema';

export interface ExaminerPersonalCommitment {
  examinerId: number;
  personalCommitment: PersonalCommitment;
}
