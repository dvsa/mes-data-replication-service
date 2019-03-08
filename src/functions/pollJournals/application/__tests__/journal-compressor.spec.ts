import { compressJournal } from '../journal-compressor';
import { ExaminerWorkSchedule } from '../../../../common/domain/Schema';
import testJournalCompression from '../__mocks__/test-journal-compression';

describe('JournalCompressor', () => {
  describe('compressJournal', () => {
    it('should gzip the journal JSON and return a base64 encoded version', () => {
      const testJournal: ExaminerWorkSchedule = testJournalCompression.journal;

      const compressedJournal = compressJournal(testJournal);

      expect(compressedJournal.indexOf(testJournalCompression.compressedJournalAsBase64)).toBeGreaterThan(0);
    });
  });
});
