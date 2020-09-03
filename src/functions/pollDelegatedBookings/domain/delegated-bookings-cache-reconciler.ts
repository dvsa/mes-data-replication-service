import {
  unCacheDelegatedBookingDetails,
  cacheDelegatedBookingDetails,
} from '../framework/repo/dynamodb/cached-delegated-bookings-repository';
import { DelegatedBookingDetail } from '../../../common/application/models/delegated-booking-details';

export const reconcileActiveAndCachedDelegatedBookings = async (
  activeDelegatedBookingsSlots: DelegatedBookingDetail[],
  cachedDelegatedBookingsSlots: DelegatedBookingDetail[],
): Promise<void> => {

  const activeAppRefs = activeDelegatedBookingsSlots.map(delegatedTestSlot => delegatedTestSlot.applicationReference);
  const cachedAppRefs = cachedDelegatedBookingsSlots.map(delegatedTestSlot => delegatedTestSlot.applicationReference);

  const delegatedBookingDetailsToCache =
    selectDelegatedBookingsToCache(activeDelegatedBookingsSlots, cachedDelegatedBookingsSlots);
  await cacheDelegatedBookingDetails(delegatedBookingDetailsToCache);

  const appRefsToUnCache = cachedAppRefs.filter(appRef => !activeAppRefs.includes(appRef));
  await unCacheDelegatedBookingDetails(appRefsToUnCache);
};

const selectDelegatedBookingsToCache = (
  activeDelegatedBookingsSlots: DelegatedBookingDetail[],
  cachedDelegatedBookingsSlots: DelegatedBookingDetail[],
): DelegatedBookingDetail[] => {

  return activeDelegatedBookingsSlots.filter((activeDelegatedBooking: DelegatedBookingDetail) => {
    return delegatedBookingsEligibleForCache(activeDelegatedBooking, cachedDelegatedBookingsSlots);
  });
};

const delegatedBookingsEligibleForCache = (
  delegatedBooking: DelegatedBookingDetail,
  cachedDelegatedBookings: DelegatedBookingDetail[],
): boolean => {

  const oldDelegatedBooking = cachedDelegatedBookings.find((cachedDelegatedBooking: DelegatedBookingDetail) => {
    return cachedDelegatedBooking.applicationReference === delegatedBooking.applicationReference;
  });

  // Booking not in cache already, allow through filter
  if (!oldDelegatedBooking) {
    return true;
  }

  return !appRefsAreEqual(delegatedBooking, oldDelegatedBooking);
};

const appRefsAreEqual = (
  sd1: DelegatedBookingDetail,
  sd2: DelegatedBookingDetail,
): boolean => sd1.applicationReference === sd2.applicationReference;
