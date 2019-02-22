import { interval } from 'rxjs';
import { map, sampleTime, scan } from 'rxjs/operators';
import { Config, getConfig } from './config';
import { createConnectionPool } from './database';
import {
  changeApplicationDataset,
  changeOtherDataset,
  changeSlotDataset,
  changeSlotDetailDataset,
} from './changes';
import {
  getActiveExaminers,
  getExaminerSubset,
  getBookings,
  getPersonalCommitments
} from './repo';
import oracledb = require('oracledb');
import { X_OK } from 'constants';

export interface updateData {
  connectionPool: oracledb.IConnectionPool;
  bookings: any[];
  personalCommitments: any[];  
  count: number;
}

export interface transactionCounter {
  previousTotal: number;
  newTransactions: number;  
}

const run = async () => {
  const config: Config = getConfig();
  const connectionPool = await createConnectionPool(config);

  const activeDate = config.startDate;
  const examinerSubsetCount = 20;

  console.log(`Loading examiners active on ${activeDate.toDateString()}`);
  const examiners = await getActiveExaminers(connectionPool, activeDate);
  console.log(`Found ${examiners.length} active examiners`);

  console.log(`Loading bookings for first ${examinerSubsetCount} active examiners`);
  const examinerSubset = getExaminerSubset(examiners, examinerSubsetCount);
  const bookings = await getBookings(connectionPool, activeDate, examinerSubset);
  console.log(`Found ${bookings.length} bookings`);

  console.log(`Loading personal commitments on ${activeDate.toDateString()}`);
  const personalCommitments = await getPersonalCommitments(connectionPool, activeDate);
  console.log(`Found ${personalCommitments.length} personal commitments`);

  // rate (in milliseconds) to make database updates
  const changeInterval = 60000 / config.changesPerMinute;
  console.log(`Making a change every ${changeInterval}ms`);

  // rate (in milliseconds) to log progress to the console
  const logInterval = 30000;

  const ticks$ = interval(changeInterval).pipe(
    scan(updateDatasets, {connectionPool, bookings, personalCommitments, count: 0}),
    sampleTime(logInterval),
    map(x => x.count),
    scan(logTransactions, {previousTotal: 0, newTransactions: 0}),  
  );

  ticks$.subscribe((x: transactionCounter) => {
    console.log(`${x.newTransactions} db updates made in the last 30 seconds`);
  });
};

const logTransactions = (acc: transactionCounter, newTotal: number): transactionCounter => {
  console.log(`acc.newTransactions: ${acc.newTransactions} acc.previousTotal: ${acc.previousTotal} newTotal: ${newTotal}`);  
  return {previousTotal: newTotal, newTransactions: newTotal - acc.previousTotal};
} 

const updateDatasets = (data: updateData, index: number): updateData => {
  changeApplicationDataset(data.connectionPool, data.bookings);
  changeOtherDataset(data.connectionPool, data.personalCommitments);
  changeSlotDataset(data.connectionPool, data.bookings);
  changeSlotDetailDataset(data.connectionPool, data.bookings);
  data.count += 1;
  console.log(`total txs ${data.count}`);
  return data;
}

run();
