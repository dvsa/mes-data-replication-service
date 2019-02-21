import { updateStaffNumberCache } from '../framework/repo/dynamodb/cached-examiner-repository';

export const reconcileActiveAndCachedExaminers = async (activeStaffNumbers: string[], cachedStaffNumbers: string[]) => {
  const staffNumbersToCache = activeStaffNumbers.filter(staffNumber => !cachedStaffNumbers.includes(staffNumber));
  const staffNumbersToUncache = cachedStaffNumbers.filter(staffNumber => !activeStaffNumbers.includes(staffNumber));

  await updateStaffNumberCache(staffNumbersToCache, staffNumbersToUncache);
};
