import { ExaminerWorkSchedule } from '../../../common/domain/Schema';
import { gzipSync } from 'zlib';

export const compressJournal = (journal: ExaminerWorkSchedule): string => {
  return gzipSync(JSON.stringify(journal), { level: 6 }).toString('base64');
};
