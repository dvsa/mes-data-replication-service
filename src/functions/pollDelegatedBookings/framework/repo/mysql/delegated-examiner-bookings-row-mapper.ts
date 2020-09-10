import { Application, Candidate } from '@dvsa/mes-journal-schema';
import { formatApplicationReference } from '@dvsa/mes-microservice-common/domain/tars';

import { DelegatedTestSlotRow } from './delegated-examiner-bookings-repository';
import { DelegatedExaminerTestSlot } from '../../../../pollJournals/domain/examiner-test-slot';
import {
  setCapitalisedStringIfPopulated,
  setNumberIfNotNull,
  setNumberIfTruthy,
  setStringIfPopulated,
} from '../../../../pollJournals/framework/repo/mysql/row-mappers/test-slot-row-mapper';
import {
  formatDateToIso8601,
  formatDateToStartTime,
} from '../../../../pollJournals/application/formatters/date-formatter';
import { DelegatedBookingDetail } from '../../../../../common/application/models/delegated-booking-details';
import { compressDelegatedBooking } from '../../../application/booking-compressor';

export const buildDelegatedBookingsFromQueryResult = (
  queryResult: DelegatedTestSlotRow[],
): DelegatedBookingDetail[] => {
  return queryResult.map((result: DelegatedTestSlotRow) => new DelegatedBookingDetail(
    mapDelegatedExaminerAppRefs(result),
    mapDelegatedExaminerStaffNumbers(result),
    compressDelegatedBooking(mapDelegatedExaminerBooking(result)),
  )) as DelegatedBookingDetail[];
};

const mapDelegatedExaminerBooking = (row: DelegatedTestSlotRow): DelegatedExaminerTestSlot => {
  const app: Application = { applicationId: 0, bookingSequence: 0, checkDigit: 0, testCategory: null };
  setNumberIfTruthy(app, 'applicationId', row.booking_id);
  setNumberIfTruthy(app, 'bookingSequence', row.booking_seq);
  setNumberIfNotNull(app, 'checkDigit', row.check_digit);
  setStringIfPopulated(app, 'testCategory', row.test_category_ref);

  const candidateDetails: Candidate = {};
  setStringIfPopulated(candidateDetails, 'driverNumber', row.driver_number);
  setStringIfPopulated(candidateDetails, 'dateOfBirth', formatDateToIso8601(row.date_of_birth));
  candidateDetails.candidateName = {};
  setCapitalisedStringIfPopulated(candidateDetails.candidateName, 'firstName', row.first_forename);
  setCapitalisedStringIfPopulated(candidateDetails.candidateName, 'lastName', row.family_name);

  return {
    examinerId: row.staff_number,
    testSlot: {
      slotDetail: {
        slotId: row.slot_id,
        start: formatDateToStartTime(row.start_time),
      },
      vehicleTypeCode: row.vehicle_type_code,
      vehicleSlotTypeCode: row.vehicle_slot_type_code,
      booking: {
        candidate: candidateDetails,
        application: app,
      },
    },
  };
};

const mapDelegatedExaminerAppRefs = (row: DelegatedTestSlotRow): number => {
  const app: Application = { applicationId: 0, bookingSequence: 0, checkDigit: 0 };
  setNumberIfTruthy(app, 'applicationId', row.booking_id);
  setNumberIfTruthy(app, 'bookingSequence', row.booking_seq);
  setNumberIfNotNull(app, 'checkDigit', row.check_digit);
  return formatApplicationReference(app);
};

const mapDelegatedExaminerStaffNumbers = (row: DelegatedTestSlotRow): string => row.staff_number;
