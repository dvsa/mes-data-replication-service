export class StaffDetail {
  staffNumber: string;
  isLDTM: boolean;
  testCategoryConductPermissionPeriods: TestCategoryConductPermissionPeriod[];

  constructor(
    staffNumber: string,
    isLDTM: boolean,
    testCategoryConductPermissionPeriods: TestCategoryConductPermissionPeriod[] = [],
  ) {
    this.staffNumber = staffNumber;
    this.isLDTM = isLDTM;
    this.testCategoryConductPermissionPeriods = testCategoryConductPermissionPeriods;
  }
}

export interface TestCategoryConductPermissionPeriod {
  testCategory: string;
  conductPermissionPeriods: ConductPermissionPeriod[];
}

export type ConductPermissionPeriod = [Date, Date | null];
