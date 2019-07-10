export class StaffDetail {
  staffNumber: string;
  isLDTM: boolean;
  testPermissionPeriods: TestPermissionPeriod[];

  constructor(
    staffNumber: string,
    isLDTM: boolean,
    testPermissionPeriods: TestPermissionPeriod[] = [],
  ) {
    this.staffNumber = staffNumber;
    this.isLDTM = isLDTM;
    this.testPermissionPeriods = testPermissionPeriods;
  }
}

export interface TestPermissionPeriod {
  testCategory: string;
  from: string;
  to: string | null;
}
