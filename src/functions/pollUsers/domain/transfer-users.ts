import { getActiveExaminers } from '../framework/repo/mysql/examiner-repository';
import { getCachedExaminers } from '../framework/repo/dynamodb/cached-examiner-repository';
import { reconcileActiveAndCachedExaminers } from './examiner-cache-reconciler';

export const transferUsers = async () => {
  const activeStaffNumbers = await getActiveExaminers();
  const cachedStaffNumbers = await getCachedExaminers();
  await reconcileActiveAndCachedExaminers(activeStaffNumbers, cachedStaffNumbers);
};
