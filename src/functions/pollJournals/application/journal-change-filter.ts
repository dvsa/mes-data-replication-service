import { JournalWrapper } from '../domain/journal-wrapper';
import { getStaffNumbersWithHashes } from '../framework/repo/dynamodb/journal-repository';
import { get } from 'lodash';

export const filterChangedJournals = async (allJournals: JournalWrapper[]): Promise<JournalWrapper[]> => {
  const staffNumbersAndHashes = await getStaffNumbersWithHashes();
  const staffNumberHashMappings = createStaffNumberHashLookup(staffNumbersAndHashes);

  const filteredJournals = allJournals.filter((journal) => {
    const cachedHashForJournal = get(staffNumberHashMappings, journal.staffNumber);
    const haveCachedHashForJournal = !!cachedHashForJournal;
    const hashesMatch = journal.hash === cachedHashForJournal;
    return !haveCachedHashForJournal || !hashesMatch;
  });
  return filteredJournals;
};

const createStaffNumberHashLookup = (staffNumbersAndHashes: Partial<JournalWrapper>[]) => {
  return staffNumbersAndHashes.reduce(
    (mappings, journalMeta) => {
      if (journalMeta.staffNumber && journalMeta.hash) {
        return { ...mappings, [journalMeta.staffNumber]: journalMeta.hash };
      }
      return mappings;
    },
    {},
  );
};
