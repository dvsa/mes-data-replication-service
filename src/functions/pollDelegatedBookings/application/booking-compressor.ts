import { gzipSync } from 'zlib';
import { DelegatedExaminerTestSlot } from '../../pollJournals/domain/examiner-test-slot';

export const compressDelegatedBooking = (examinerBookingDetail: DelegatedExaminerTestSlot): Buffer => {
  return gzipSync(JSON.stringify(examinerBookingDetail));
};
