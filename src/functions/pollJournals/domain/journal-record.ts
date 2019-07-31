import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';

export interface JournalRecord {
  staffNumber: string;
  hash: string;
  lastUpdatedAt: number;
  journal: Buffer;
}
