import {
  uncacheStaffNumbers, cacheStaffDetails,
} from '../framework/repo/dynamodb/cached-examiner-repository';
import { StaffDetail } from '../../../common/application/models/staff-details';

export const reconcileActiveAndCachedExaminers = async (
  activeStaffDetails: StaffDetail[],
  cachedStaffDetails: StaffDetail[],
) => {
  const activeStaffNumbers = activeStaffDetails.map(staffDetail => staffDetail.staffNumber);
  const cachedStaffNumbers = cachedStaffDetails.map(staffDetail => staffDetail.staffNumber);

  const staffDetailsToCache = activeStaffDetails
    .filter(staffDetail => !cachedStaffNumbers.includes(staffDetail.staffNumber));
  await cacheStaffDetails(staffDetailsToCache);

  const staffNumbersToUncache = cachedStaffNumbers.filter(staffNumber => !activeStaffNumbers.includes(staffNumber));
  await uncacheStaffNumbers(staffNumbersToUncache);
};
