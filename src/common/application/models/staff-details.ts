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

  /**
   * Returns a version of the StaffDetail with all the dates converted into ISO-8601 date format.
   * This is because date objects can't be persisted to DynamoDB correctly.
   */
  withSerialisableDates(): any {
    const serialiseDate = (date: Date) => date.toISOString().split('T')[0];
    return {
      ...this,
      // tslint:disable-next-line:max-line-length
      testCategoryConductPermissionPeriods: this.testCategoryConductPermissionPeriods.map(categoryPermissionPeriods => ({
        ...categoryPermissionPeriods,
        conductPermissionPeriods: categoryPermissionPeriods.conductPermissionPeriods.map(conductPermissionPeriod => [
          conductPermissionPeriod[0] ? serialiseDate(conductPermissionPeriod[0]) : null,
          conductPermissionPeriod[1] ? serialiseDate(conductPermissionPeriod[1]) : null,
        ]),
      })),
    };
  }
}

export interface TestCategoryConductPermissionPeriods {
  testCategory: string;
  conductPermissionPeriods: ConductPermissionPeriod[];
}

export type ConductPermissionPeriod = [Date, Date | null];
