import { gzipSync, gunzipSync } from 'zlib';
import { DelegatedExaminerTestSlot } from '../../pollJournals/domain/examiner-test-slot';

export const compressDelegatedBooking = (examinerBookingDetail: DelegatedExaminerTestSlot): Buffer => {
  return gzipSync(JSON.stringify(examinerBookingDetail));
};

export const decompressDelegatedBooking = (examinerBookingDetailBuffer: Buffer): DelegatedExaminerTestSlot => {
  return JSON.parse(gunzipSync(examinerBookingDetailBuffer).toString());
};
