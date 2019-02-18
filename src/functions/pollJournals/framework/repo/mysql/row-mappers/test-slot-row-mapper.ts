import { ExaminerTestSlot } from '../../../../domain/examiner-test-slot';
import { VehicleGearbox, PreviousCancellation } from '../../../../../../common/domain/Schema';

interface TestSlotRow {
  slot_id: number;
  start_time: string;
  minutes: number;
  vehicle_slot_type: string;
  tc_id: number;
  tc_cost_centre_code: string;
  tc_name: string;
  individual_id: number;
  programme_date: string;
  booking_id: number;
  app_id: number;
  booking_seq: number;
  check_digit: number;
  welsh_test_ind: number;
  ext_req_ind: number;
  progressive_access: number;
  meeting_place: string;
  special_needs: string;
  ent_check_ind: number;
  cab_seat_count: number;
  passenger_seat_count: number;
  height_metres: number;
  length_metres: number;
  width_metres: number;
  vehicle_category: string;
  gearbox_type: string;
  candidate_id: number;
  candidate_title: string;
  candidate_first_name: string;
  candidate_second_name: string;
  candidate_third_name: string;
  candidate_surname: string;
  candidate_driver_number: string;
  cand_primary_tel: string;
  cand_secondary_tel: string;
  cand_mobile_tel: string;
  cand_email: string;
  candidate_addr_line1: string;
  candidate_addr_line2: string;
  candidate_addr_line3: string;
  candidate_addr_line4: string;
  candidate_addr_line5: string;
  candidate_post_code: string;
  candidate_prn: number;
  prev_attempts: number;
  business_id: number;
  business_name: string;
  business_addr_line1: string;
  business_addr_line2: string;
  business_addr_line3: string;
  business_addr_line4: string;
  business_addr_line5: string;
  business_post_code: string;
  business_telephone: string;
  cancel_initiator: string;
}

export const mapRow = (row: TestSlotRow): ExaminerTestSlot => {
  return {
    examinerId: row.individual_id,
    testSlot: {
      slotDetail: {
        slotId: row.slot_id,
        start: row.start_time,
        duration: row.minutes,
      },
      vehicleSlotType: row.vehicle_slot_type,
      testCentre: {
        centreId: row.tc_id,
        centreName: row.tc_name,
        costCode: row.tc_cost_centre_code,
      },
      booking: {
        candidate: {
          candidateId: row.candidate_id,
          candidateName: {
            title: row.candidate_title,
            firstName: row.candidate_first_name,
            secondName: row.candidate_second_name,
            thirdName: row.candidate_third_name,
            lastName: row.candidate_surname,
          },
          driverNumber: row.candidate_driver_number,
          candidateAddress: {
            addressLine1: row.candidate_addr_line1,
            addressLine2: row.candidate_addr_line2,
            addressLine3: row.candidate_addr_line3,
            addressLine4: row.candidate_addr_line4,
            addressLine5: row.candidate_addr_line5,
            postcode: row.candidate_post_code,
          },
          primaryTelephone: row.cand_primary_tel,
          secondaryTelephone: row.cand_secondary_tel,
          mobileTelephone: row.cand_mobile_tel,
          emailAddress: row.cand_email,
          prn: row.candidate_prn,
          previousADITests: row.prev_attempts,
        },
        application: {
          applicationId: row.app_id,
          bookingSequence: row.booking_seq,
          checkDigits: row.check_digit,
          welshTest: convertIndicator(row.welsh_test_ind),
          extendedTest: convertIndicator(row.ext_req_ind),
          meetingPlace: row.meeting_place,
          progressiveAccess: convertIndicator(row.progressive_access),
          specialNeeds: row.special_needs,
          entitlementCheck: convertIndicator(row.ent_check_ind),
          vehicleSeats: row.passenger_seat_count,
          vehicleHeight: row.height_metres,
          vehicleWidth: row.width_metres,
          vehicleLength: row.length_metres,
          testCategory: row.vehicle_category,
          vehicleGearbox: row.gearbox_type as VehicleGearbox,
        },
        previousCancellation: (row.cancel_initiator ? row.cancel_initiator.split(',') : []) as PreviousCancellation,
        business: {
          businessId: row.business_id,
          businessName: row.business_name,
          businessAddress: {
            addressLine1: row.business_addr_line1,
            addressLine2: row.business_addr_line2,
            addressLine3: row.business_addr_line3,
            addressLine4: row.business_addr_line4,
            addressLine5: row.business_addr_line5,
            postcode: row.business_post_code,
          },
          telephone: row.business_telephone,
        },
      },
    },
  };
};

const convertIndicator = (indicator: number): boolean => {
  return indicator === 1;
};
