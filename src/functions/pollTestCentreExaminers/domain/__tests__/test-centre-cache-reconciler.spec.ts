// /* tslint:disable:max-line-length */
// import { Mock, It, Times } from 'typemoq';
// import { reconcileActiveAndCachedDelegatedBookings } from '../delegated-bookings-cache-reconciler';
// tslint:disable-next-line:max-line-length
// import * as cachedDelegatedBookingRepository from '../../framework/repo/dynamodb/cached-delegated-bookings-repository';
// import { DelegatedBookingDetail } from '../../../../common/application/models/delegated-booking-details';
// tslint:disable-next-line:max-line-length
// import { compressedMockNewDelegatedExaminerTestSlot, compressedMockOldDelegatedExaminerTestSlot } from '../__mocks__/delegated-examiner-test-slot.mock';
// import { DateTime } from '../../../../common/application/utils/date-time';
//
// describe('Delegated booking cache reconciler', () => {
//   const moqCacheBookings = Mock.ofInstance(cachedDelegatedBookingRepository.cacheDelegatedBookingDetails);
//   const moqUncacheBookings = Mock.ofInstance(cachedDelegatedBookingRepository.unCacheDelegatedBookingDetails);
//
//   beforeEach(() => {
//     moqCacheBookings.reset();
//     moqUncacheBookings.reset();
//
//     spyOn(cachedDelegatedBookingRepository, 'cacheDelegatedBookingDetails').and.callFake(moqCacheBookings.object);
// tslint:disable-next-line:max-line-length
//     spyOn(cachedDelegatedBookingRepository, 'unCacheDelegatedBookingDetails').and.callFake(moqUncacheBookings.object);
//   });
//
//   describe('reconcileActiveAndCachedDelegatedBookings', () => {
//     it('should issue writes to the cache for active bookings not already cached', async () => {
//       const activeBookings = [
//         new DelegatedBookingDetail(12345678910, '123456', Buffer.from('')),
//         new DelegatedBookingDetail(12345678911, '363422', Buffer.from('')),
//       ];
//       const cachedBookingDetails: DelegatedBookingDetail[] = [];
//       const cachedAppRefs: number[] = [];
// tslint:disable-next-line:max-line-length
//       await reconcileActiveAndCachedDelegatedBookings(activeBookings, cachedBookingDetails, new DateTime('2021-01-06T07:51:00'));
//       moqCacheBookings.verify(x => x(It.isValue(activeBookings)), Times.once());
//       moqUncacheBookings.verify(x => x(It.isValue(cachedAppRefs)), Times.once());
//     });
//
// tslint:disable-next-line:max-line-length
//     it('should cache active bookings not already in the cache and uncache those that are cached but not active', async () => {
//       const activeBookings = [new DelegatedBookingDetail(12345678910, '123456', Buffer.from(''))];
//       const cachedBookingDetails = [
//         new DelegatedBookingDetail(12345678910, '123456', compressedMockOldDelegatedExaminerTestSlot),
//         new DelegatedBookingDetail(12345678911, '363422', compressedMockNewDelegatedExaminerTestSlot),
//         new DelegatedBookingDetail(12345678912, '552422', compressedMockOldDelegatedExaminerTestSlot),
//       ];
// tslint:disable-next-line:max-line-length
//       await reconcileActiveAndCachedDelegatedBookings(activeBookings, cachedBookingDetails, new DateTime('2021-01-06T07:51:00'));
//       moqCacheBookings.verify(x => x(It.isValue([])), Times.once());
//       moqUncacheBookings.verify(x => x(It.isValue([12345678912])), Times.once());
//     });
//
//     it('should not try to delete cached bookings that are ineligible for deletion', async () => {
//       // ARRANGE
//       const activeBookings = [new DelegatedBookingDetail(12345678910, '123456', Buffer.from(''))];
//       const cachedBookingDetails = [
//         new DelegatedBookingDetail(12345678912, '123456', compressedMockNewDelegatedExaminerTestSlot),
//         new DelegatedBookingDetail(12345678911, '363422', compressedMockOldDelegatedExaminerTestSlot),
//         new DelegatedBookingDetail(12345678910, '363422', compressedMockNewDelegatedExaminerTestSlot),
//       ];
//       // ACT
// tslint:disable-next-line:max-line-length
//       await reconcileActiveAndCachedDelegatedBookings(activeBookings, cachedBookingDetails, new DateTime('2021-01-06T07:51:00'));
//       // ASSERT
//       moqCacheBookings.verify(x => x(It.isValue([])), Times.once());
//       moqUncacheBookings.verify(x => x(It.isValue([12345678911])), Times.once());
//     });
//   });
// });
