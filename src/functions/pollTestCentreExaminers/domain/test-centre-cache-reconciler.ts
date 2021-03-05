import { DateTime } from '../../../common/application/utils/date-time';
import { TestCentreDetail } from '../../../common/application/models/test-centre';
import {
  cacheTestCentreExaminers,
  unCacheTestCentreExaminers,
} from '../framework/repo/dynamodb/cached-test-centre-repository';

const NUMBER_OF_DAYS_TO_RETAIN_CACHED_ROWS = 5;

export const reconcileActiveAndCachedTestCentreRows = async (
  activeTestCentreRows: TestCentreDetail[],
  cachedTestCentreRows: TestCentreDetail[],
  todaysDate: DateTime,
): Promise<void> => {

  // @TODO: NEED TO RE-INTRODUCE WHEN WE DECIDE ABOUT HOW TO REMOVE OLD ROWS
  // const cachedTestCentresEligibleForDeletion: string[] =
  //   extractCachedTestCentresForDeletion(cachedTestCentreRows, activeTestCentreRows, todaysDate)
  //     .map((row: TestCentreDetail) => row.staffNumber);

  const testCentresToCache =
    selectDelegatedBookingsToCache(activeTestCentreRows, cachedTestCentreRows);

  await cacheTestCentreExaminers(testCentresToCache);

  // await unCacheTestCentreExaminers(cachedTestCentresEligibleForDeletion);
};

const selectDelegatedBookingsToCache = (
  activeDelegatedBookingsSlots: TestCentreDetail[],
  cachedDelegatedBookingsSlots: TestCentreDetail[],
): TestCentreDetail[] => {

  return activeDelegatedBookingsSlots.filter((activeDelegatedBooking: TestCentreDetail) => {
    return delegatedBookingsEligibleForCache(activeDelegatedBooking, cachedDelegatedBookingsSlots);
  });
};

const delegatedBookingsEligibleForCache = (
  testCentreDetail: TestCentreDetail,
  cachedTestCentre: TestCentreDetail[],
): boolean => {

  const oldTestCentreRow = cachedTestCentre.find((cachedTestCentreRow: TestCentreDetail) => {
    return cachedTestCentreRow.staffNumber === testCentreDetail.staffNumber;
  });

  // Row not in cache already, allow through filter
  if (!oldTestCentreRow) {
    return true;
  }

  return !staffNumbersAreEqual(testCentreDetail, oldTestCentreRow);
};

const staffNumbersAreEqual = (
  sd1: TestCentreDetail,
  sd2: TestCentreDetail,
): boolean => sd1.staffNumber === sd2.staffNumber;

const extractCachedTestCentresForDeletion = (
  cachedTestCentreRows: TestCentreDetail[],
  activeTestCentreRows: TestCentreDetail[],
  todaysDate: DateTime,
): TestCentreDetail[] => {

  const activeStaffNumbers = activeTestCentreRows.map((row: TestCentreDetail) => row.staffNumber);

  return cachedTestCentreRows.filter((row: TestCentreDetail) => {
    if (activeStaffNumbers.includes(row.staffNumber)) return false;

    const daysSincePolling: number = new DateTime(row.dateAdded).daysDiff(todaysDate);

    return daysSincePolling > NUMBER_OF_DAYS_TO_RETAIN_CACHED_ROWS;
  });
};

const unCacheEntireTable = async (cachedTestCentreRows: TestCentreDetail[]): Promise<void> => {
  await unCacheTestCentreExaminers(cachedTestCentreRows.map((row: TestCentreDetail) => row.staffNumber));
};
