import {
  uncacheStaffNumbers, cacheStaffDetails,
} from '../framework/repo/dynamodb/cached-examiner-repository';
import { StaffDetail } from '../../../common/application/models/staff-details';

export const reconcileActiveAndCachedExaminers = async (
    activeStaffDetails: StaffDetail[],
    cachedStaffNumbers: string[],
  ) => {
  const staffDetailsToCache =
    activeStaffDetails.filter(staffDetail => !cachedStaffNumbers.includes(staffDetail.staffNumber));

  await cacheStaffDetails(staffDetailsToCache);

  const activeStaffNumbers = activeStaffDetails.map(staffDetail => staffDetail.staffNumber);
  const staffNumbersToUncache = cachedStaffNumbers.filter(staffNumber => !activeStaffNumbers.includes(staffNumber));

  await uncacheStaffNumbers(staffNumbersToUncache);
};
