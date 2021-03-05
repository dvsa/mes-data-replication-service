import { DateTime } from '../utils/date-time';

export type Examiner = {
  name: string;
  staffNumber: string;
};
export class TestCentreDetail {
  staffNumber: string;
  examiners: Examiner[];
  testCentreIDs: number[];
  dateAdded: DateTime;

  constructor(
    staffNumber: string,
    examiners: Examiner[],
    testCentreIDs: number[],
    date?: DateTime,
  ) {
    this.staffNumber = staffNumber;
    this.examiners = examiners;
    this.testCentreIDs = testCentreIDs;
    this.dateAdded = date;
  }
}
