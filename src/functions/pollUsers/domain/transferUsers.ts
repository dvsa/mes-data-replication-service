import { getActiveExaminers } from '../framework/repo/mysql/examinerRepository';
import { getCachedExaminers } from '../framework/repo/dynamodb/cachedExaminerRepository';
import { reconcileActiveAndCachedExaminers } from './examinerCacheReconciler';

export const transferUsers = async () => {
  const activeStaffNumbers = await getActiveExaminers();
  const cachedStaffNumbers = await getCachedExaminers();
  await reconcileActiveAndCachedExaminers(activeStaffNumbers, cachedStaffNumbers);
};
