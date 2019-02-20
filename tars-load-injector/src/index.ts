import { interval } from 'rxjs';
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
} from './repo';

const run = async () => {
  const config: Config = getConfig();
  const connectionPool = await createConnectionPool(config);

  const activeDate = config.startDate;
  const examinerSubsetCount = 100;

  console.log(`Loading examiners active on ${activeDate.toDateString()}`);
  const examiners = await getActiveExaminers(connectionPool, activeDate);
  console.log(`Found ${examiners.length} active examiners`);

  console.log(`Loading bookings for first ${examinerSubsetCount} active examiners`);
  const examinerSubset = getExaminerSubset(examiners, examinerSubsetCount);

  for (let i = 0; i++; i < 10) {
      console.log(`examiner ${i} is individual id ${examinerSubset[i]}`);
  }

  const bookings = await getBookings(connectionPool, activeDate, examinerSubset);
  console.log(`Found ${bookings.length} bookings`);

  const changeInterval = 60000 / config.changesPerMinute;
  console.log(`Making a change every ${changeInterval}ms`);
  const ticks = interval(changeInterval);

  ticks.subscribe((_) => {
    changeApplicationDataset(connectionPool, bookings);
    changeOtherDataset(connectionPool, examiners, activeDate);
    changeSlotDataset(connectionPool, bookings);
    changeSlotDetailDataset(connectionPool, bookings);
  });
};

run();
