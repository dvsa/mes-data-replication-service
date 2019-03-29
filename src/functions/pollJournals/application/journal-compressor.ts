import { ExaminerWorkSchedule } from '../../../common/domain/Schema';
import { gzipSync } from 'zlib';

export const compressJournal = (journal: ExaminerWorkSchedule): Buffer => {
  return gzipSync(JSON.stringify(journal));
};
