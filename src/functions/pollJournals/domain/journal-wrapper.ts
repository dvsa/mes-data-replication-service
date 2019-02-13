import { ExaminerWorkSchedule } from '../../../common/domain/Schema';

export interface JournalWrapper {
  staffNumber: string;
  hash: string;
  lastUpdatedAt: number;
  journal: ExaminerWorkSchedule;
}
