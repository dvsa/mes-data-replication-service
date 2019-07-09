import {
  uncacheStaffNumbers, cacheStaffDetails,
} from '../framework/repo/dynamodb/cached-examiner-repository';
import { StaffDetail } from '../../../common/application/models/staff-details';
import { isEqual } from 'lodash';

export const reconcileActiveAndCachedExaminers = async (
  activeStaffDetails: StaffDetail[],
  cachedStaffDetails: StaffDetail[],
) => {
  const activeStaffNumbers = activeStaffDetails.map(staffDetail => staffDetail.staffNumber);
  const cachedStaffNumbers = cachedStaffDetails.map(staffDetail => staffDetail.staffNumber);

  const staffDetailsToCache = selectStaffDetailsToCache(activeStaffDetails, cachedStaffDetails);
  await cacheStaffDetails(staffDetailsToCache);

  const staffNumbersToUncache = cachedStaffNumbers.filter(staffNumber => !activeStaffNumbers.includes(staffNumber));
  await uncacheStaffNumbers(staffNumbersToUncache);
};

const selectStaffDetailsToCache = (
  activeStaffDetails: StaffDetail[],
  cachedStaffDetails: StaffDetail[],
): StaffDetail[] => {
  return activeStaffDetails
    .filter(activeStaffDetail => staffDetailEligibleForCache(activeStaffDetail, cachedStaffDetails));
};

const staffDetailEligibleForCache = (staffDetail: StaffDetail, cachedStaffDetails: StaffDetail[]): boolean => {
  const oldStaffDetailForExaminer = cachedStaffDetails
    .find(cachedStaffDetail => cachedStaffDetail.staffNumber === staffDetail.staffNumber);

  // Examiner not in cache already, allow through filter
  if (!oldStaffDetailForExaminer) {
    return true;
  }

  return !isEqual(staffDetail, oldStaffDetailForExaminer);
};
