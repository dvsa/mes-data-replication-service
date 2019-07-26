export interface JournalRecord {
  staffNumber: number;
  hash: string;
  lastUpdatedAt: number;
  journal: Buffer;
}
