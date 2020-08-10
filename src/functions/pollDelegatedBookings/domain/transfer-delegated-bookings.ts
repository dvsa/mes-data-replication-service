import { getDelegatedExaminerBookings } from '../framework/repo/mysql/delegated-examiner-bookings-repository';

export const transferDelegatedBookings = async () => {
  const delegatedBookings = await getDelegatedExaminerBookings();
};
