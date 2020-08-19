/* tslint:disable:max-line-length */
import { Mock, It, Times } from 'typemoq';
import { reconcileActiveAndCachedDelegatedBookings } from '../delegated-bookings-cache-reconciler';
import * as cachedDelegatedBookingRepository from '../../framework/repo/dynamodb/cached-delegated-bookings-repository';
import { DelegatedBookingDetail } from '../../../../common/application/models/delegated-booking-details';

describe('Delegated booking cache reconciler', () => {
  const moqCacheBookings = Mock.ofInstance(cachedDelegatedBookingRepository.cacheDelegatedBookingDetails);
  const moqUncacheBookings = Mock.ofInstance(cachedDelegatedBookingRepository.unCacheDelegatedBookingDetails);

  beforeEach(() => {
    moqCacheBookings.reset();
    moqUncacheBookings.reset();

    spyOn(cachedDelegatedBookingRepository, 'cacheDelegatedBookingDetails').and.callFake(moqCacheBookings.object);
    spyOn(cachedDelegatedBookingRepository, 'unCacheDelegatedBookingDetails').and.callFake(moqUncacheBookings.object);
  });

  describe('reconcileActiveAndCachedDelegatedBookings', () => {
    it('should issue writes to the cache for active bookings not already cached', async () => {
      const activeBookings = [
        new DelegatedBookingDetail(12345678910, '123456', Buffer.from('')),
        new DelegatedBookingDetail(12345678911, '363422', Buffer.from('')),
      ];
      const cachedBookingDetails: DelegatedBookingDetail[] = [];
      const cachedAppRefs: number[] = [];
      await reconcileActiveAndCachedDelegatedBookings(activeBookings, cachedBookingDetails);
      moqCacheBookings.verify(x => x(It.isValue(activeBookings)), Times.once());
      moqUncacheBookings.verify(x => x(It.isValue(cachedAppRefs)), Times.once());
    });

    it('should cache active bookings not already in the cache and uncache those that are cached but not active', async () => {
      const activeBookings = [new DelegatedBookingDetail(12345678910, '123456', Buffer.from(''))];
      const cachedBookingDetails = [
        new DelegatedBookingDetail(12345678910, '123456', Buffer.from('')),
        new DelegatedBookingDetail(12345678911, '363422', Buffer.from('')),
        new DelegatedBookingDetail(12345678912, '552422', Buffer.from('')),
      ];
      await reconcileActiveAndCachedDelegatedBookings(activeBookings, cachedBookingDetails);
      moqCacheBookings.verify(x => x(It.isValue([])), Times.once());
      moqUncacheBookings.verify(x => x(It.isValue([12345678911, 12345678912])), Times.once());
    });
  });
});
