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
  const examiners = await getActiveExaminers(connectionPool, activeDate);
  const examinerSubset = getExaminerSubset(examiners, 20);
  const bookings = await getBookings(connectionPool, activeDate, examinerSubset);

  const changeInterval = 60000 / config.changesPerMinute;
  console.log(`Making a change every ${changeInterval}ms`);
  const ticks = interval(changeInterval);

  ticks.subscribe(_ => {
    changeApplicationDataset(connectionPool, bookings);
    changeOtherDataset(connectionPool, examiners, activeDate);
    changeSlotDataset(connectionPool, bookings);
    changeSlotDetailDataset(connectionPool, bookings);
  });
}

run();
