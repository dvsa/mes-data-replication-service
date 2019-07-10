export class StaffDetail {
  staffNumber: string;
  isLDTM: boolean;
  testCategoryConductPermissionPeriods: TestCategoryConductPermissionPeriods[];

  constructor(
    staffNumber: string,
    isLDTM: boolean,
    testCategoryConductPermissionPeriods: TestCategoryConductPermissionPeriods[] = [],
  ) {
    this.staffNumber = staffNumber;
    this.isLDTM = isLDTM;
    this.testCategoryConductPermissionPeriods = testCategoryConductPermissionPeriods;
  }
}

export interface TestCategoryConductPermissionPeriods {
  testCategory: string;
  conductPermissionPeriods: ConductPermissionPeriod[];
}

export type ConductPermissionPeriod = [Date, Date | null];
