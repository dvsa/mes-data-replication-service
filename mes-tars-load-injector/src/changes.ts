import { IConnectionPool } from 'oracledb';

import * as repo from './repo';

export const changeApplicationDataset = async (connPool: IConnectionPool, bookings: Object[]) => {
  const applicationIdToChange = bookings[Math.floor(Math.random() * bookings.length)]['APP_ID']
  const newSpecialNeedsText = characterRepeatedRandomAmount('a');
  logChange('APPLICATION', 'APPLICATION', 'SPECIAL_NEEDS_TEXT', 'APP_ID', applicationIdToChange, newSpecialNeedsText);
  return repo.changeSpecialNeedsText(connPool, applicationIdToChange, newSpecialNeedsText);
}

export const changeOtherDataset = async (connPool: IConnectionPool, examiners: Object[], activeDate: Date) => {
  const examinerIdToChange = examiners[Math.floor(Math.random() * examiners.length)]['INDIVIDUAL_ID'];
  const newActivityCode = `0${Math.floor(Math.random() * 99 + 1)}`;
  logChange('OTHER', 'PERSONAL_COMMITMENT', 'NON_TEST_ACTIVITY_CODE', 'INDIVIDUAL_ID', examinerIdToChange, newActivityCode);
  return repo.changePersonalCommitmentActivityCode(connPool, examinerIdToChange, activeDate, newActivityCode);
};

export const changeSlotDataset = async (connPool: IConnectionPool, bookings: Object[]) => {
  const slotIdToChange = bookings[Math.floor(Math.random() * bookings.length)]['SLOT_ID']
  const newNtaCode = Math.floor(Math.random() * 100 + 1)
  logChange('SLOT', 'PROGRAMME_SLOT', 'NON_TEST_ACTIVITY_CODE', 'SLOT_ID', slotIdToChange, newNtaCode);
  return repo.changeSlotNonTestActivityCode(connPool, slotIdToChange, newNtaCode);
};

export const changeSlotDetailDataset = async (connPool: IConnectionPool, bookings: Object[]) => {
  const individualIdToChange = bookings[Math.floor(Math.random() * bookings.length)]['INDIVIDUAL_ID'];
  const newTelephoneNumber = characterRepeatedRandomAmount('1');
  logChange('SLOTDETAIL', 'CONTACT_DETAILS', 'MOBILE_TEL_NUMBER', 'INDIVIDUAL_ID', individualIdToChange, newTelephoneNumber);
  return repo.changeTelephoneNumber(connPool, individualIdToChange, newTelephoneNumber);
};

const characterRepeatedRandomAmount = (c: string) => c.repeat(Math.floor(Math.random() * 15 + 1));

const logChange = (
  dataset: string,
  table: string,
  column: string,
  idName: string,
  idSelected: string,
  newValue: any,
 ) => {
  console.log(`${dataset}: Changing ${table}.${column} for ${idName} ${idSelected} => ${newValue}`);
}
