import { compressJournal } from '../journal-compressor';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import testJournalCompression from '../__mocks__/test-journal-compression';

describe('JournalCompressor', () => {
  describe('compressJournal', () => {
    it('should gzip the journal JSON and return a base64 encoded version', () => {
      const testJournal: ExaminerWorkSchedule = testJournalCompression.journal;

      const compressedJournal = compressJournal(testJournal);

      expect(compressedJournal.byteLength).toBeLessThan(Buffer.from(JSON.stringify(testJournal)).byteLength);
    });
  });
});
