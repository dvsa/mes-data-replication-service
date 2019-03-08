import { ExaminerWorkSchedule } from '../../../common/domain/Schema';
import { gzipSync } from 'zlib';

export const compressJournal = (journal: ExaminerWorkSchedule): string => {
  return gzipSync(JSON.stringify(journal)).toString('base64');
};
