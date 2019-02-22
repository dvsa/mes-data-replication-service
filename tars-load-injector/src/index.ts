import { interval } from 'rxjs';
import { sampleTime, scan } from 'rxjs/operators';
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

export interface updateData {
  connectionPool: oracledb.IConnectionPool;
  bookings: any[];
  personalCommitments: any[];  
  count: number;
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

  const ticks = interval(changeInterval).pipe(
    scan(updateDatasets, {connectionPool, bookings, personalCommitments, count: 0}),
    sampleTime(logInterval)  
  );

  ticks.subscribe((data: updateData) => {
    console.log(`${data.count} db updates made...`);
  });
  /*ticks.subscribe((_) => {
    console.log('**');
    changeApplicationDataset(connectionPool, bookings);
    changeOtherDataset(connectionPool, personalCommitments);
    changeSlotDataset(connectionPool, bookings);
    changeSlotDetailDataset(connectionPool, bookings);
    console.log('**');
  });*/
};

const updateDatasets = (data: updateData, index: number): updateData => {
  console.log('**');
  changeApplicationDataset(data.connectionPool, data.bookings);
  changeOtherDataset(data.connectionPool, data.personalCommitments);
  changeSlotDataset(data.connectionPool, data.bookings);
  changeSlotDetailDataset(data.connectionPool, data.bookings);
  console.log('**');
  data.count += 4;

  return data;
}

run();
