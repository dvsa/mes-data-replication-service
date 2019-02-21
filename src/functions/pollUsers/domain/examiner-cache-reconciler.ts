import { cacheStaffNumbers, uncacheStaffNumbers } from '../framework/repo/dynamodb/cached-examiner-repository';

export const reconcileActiveAndCachedExaminers = async (activeStaffNumbers: string[], cachedStaffNumbers: string[]) => {
  const staffNumbersToCache = activeStaffNumbers.filter(staffNumber => !cachedStaffNumbers.includes(staffNumber));
  await cacheStaffNumbers(staffNumbersToCache);

  const staffNumbersToUncache = cachedStaffNumbers.filter(staffNumber => !activeStaffNumbers.includes(staffNumber));
  await uncacheStaffNumbers(staffNumbersToUncache);
};
