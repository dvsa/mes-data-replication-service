import { Mock, Times } from 'typemoq';
import * as journalRepository from '../../framework/repo/dynamodb/journal-repository';
import { filterChangedJournals } from '../journal-change-filter';
import { JournalRecord } from '../../domain/journal-record';

describe('JournalChangeFilter', () => {
  const moqGetStaffNumberHashMappings = Mock.ofInstance(journalRepository.getStaffNumbersWithHashes);

  const dummyJournal1 = Mock.ofType<JournalRecord>();
  dummyJournal1.setup((x: any) => x.staffNumber).returns(() => '123');
  dummyJournal1.setup((x: any) => x.hash).returns(() => 'abc123');

  const dummyJournal2 = Mock.ofType<JournalRecord>();
  dummyJournal2.setup((x: any) => x.staffNumber).returns(() => '456');
  dummyJournal2.setup((x: any) => x.hash).returns(() => 'abc456');

  const dummyJournal3 = Mock.ofType<JournalRecord>();
  dummyJournal3.setup((x: any) => x.staffNumber).returns(() => '789');
  dummyJournal3.setup((x: any) => x.hash).returns(() => 'abc789');

  beforeEach(() => {
    moqGetStaffNumberHashMappings.reset();

    spyOn(journalRepository, 'getStaffNumbersWithHashes').and.callFake(moqGetStaffNumberHashMappings.object);
  });

  describe('filterChangedJournals', () => {
    it('should retain all journals when the cache is empty', async () => {
      const journalsToFilter = [dummyJournal1.object, dummyJournal2.object];
      moqGetStaffNumberHashMappings.setup(x => x()).returns(() => Promise.resolve([]));

      const result = await filterChangedJournals(journalsToFilter);

      moqGetStaffNumberHashMappings.verify(x => x(), Times.once());
      expect(result).toEqual(journalsToFilter);
    });

    it('should retain all journals when every the hash has changed', async () => {
      const journalsToFilter = [dummyJournal1.object, dummyJournal2.object];
      moqGetStaffNumberHashMappings.setup(x => x()).returns(() => Promise.resolve(
        [
          { staffNumber: '123', hash: 'abc999' },
          { staffNumber: '456', hash: 'abc888' },
        ],
      ));

      const result = await filterChangedJournals(journalsToFilter);

      moqGetStaffNumberHashMappings.verify(x => x(), Times.once());
      expect(result).toEqual(journalsToFilter);
    });

    it('should omit all journals if their hashes have not changed', async () => {
      const journalsToFilter = [dummyJournal1.object, dummyJournal2.object, dummyJournal3.object];
      moqGetStaffNumberHashMappings.setup(x => x()).returns(() => Promise.resolve(
        [
          { staffNumber: '123', hash: 'abc123' },
          { staffNumber: '456', hash: 'abc456' },
          { staffNumber: '789', hash: 'abc789' },
        ],
      ));

      const result = await filterChangedJournals(journalsToFilter);

      expect(result.length).toBe(0);
    });

    it('should omit the minimal set of journals whose hashes have not changed', async () => {
      const journalsToFilter = [dummyJournal1.object, dummyJournal2.object, dummyJournal3.object];
      moqGetStaffNumberHashMappings.setup(x => x()).returns(() => Promise.resolve(
        [
          { staffNumber: '123', hash: 'abc123' },
          { staffNumber: '456', hash: 'abc222' },
          { staffNumber: '789', hash: 'abc789' },
        ],
      ));

      const result = await filterChangedJournals(journalsToFilter);

      expect(result).toEqual([dummyJournal2.object]);
    });
  });
});
