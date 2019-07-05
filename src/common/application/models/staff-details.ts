export class StaffDetail {
  staffNumber: string;
  isLDTM: boolean;

  constructor(staffNumber: string, isLDTM: boolean) {
    this.staffNumber = staffNumber;
    this.isLDTM = isLDTM;
  }
}
