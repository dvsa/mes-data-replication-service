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
  console.log(`examinerSubset has ${examinerSubset.length} ids`);
  console.log(`examinerSubset[0] is ${examinerSubset[0]}`);

  examinerSubset.slice(0, 10).forEach((item) => {
      console.log(`individual id ${item}`);
  });

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
