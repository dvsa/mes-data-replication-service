import { ExaminerWorkSchedule } from '../../../common/domain/Schema';

export interface JournalRecord {
  staffNumber: string;
  hash: string;
  lastUpdatedAt: number;
  journal: Buffer;
}
