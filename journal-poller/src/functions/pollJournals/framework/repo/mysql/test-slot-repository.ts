/* tslint:disable */
import * as mysql from 'mysql';
import { blockingQuery } from '../database';
import { VehicleGearbox } from '../../../../../common/domain/Schema';
import { ExaminerTestSlot } from '../../../domain/examiner-test-slot';
import { flatten } from 'lodash';

export const getTestSlots = async (connectionPool: mysql.Pool, examinerIdGroups: number[][]): Promise<ExaminerTestSlot[]> => {
  const startAt = new Date();
  console.log(`STARTING AT: ${startAt}`);

  const queries = examinerIdGroups.map(idGroup => getQueryForExaminerIdGroup(idGroup));
  const numberOfExaminersQueried = examinerIdGroups.reduce((acc, group) => acc + group.length, 0);
  console.log(`Quering ${numberOfExaminersQueried} examiners`);

  const promises = queries.map(query => blockingQuery(connectionPool, query));

  const results = await Promise.all(promises);

  const finishedAt = new Date();
  console.log(`FINISHED AT: ${finishedAt}`);
  
  const numSlots = results.reduce((acc, result) => acc + result.length, 0)
  console.log(`GOT ${numSlots} slots`);
  const slotsPerSecond = numSlots / ((finishedAt.getTime() - startAt.getTime()) / 1000);
  console.log(`THATS ${slotsPerSecond} per second`);

  const mappedResults = flatten(results.map(resultGroup => resultGroup.map(mapRow)));
  return mappedResults;
}

const getQueryForExaminerIdGroup = (idGroup: number[]) => {
  return `
  select w.slot_id, w.start_time as start_time, w.minutes as minutes,
  vst.short_vst_desc as vehicle_slot_type, w.tc_id, tc.tc_cost_centre_code, tcn.tc_name,
  w.individual_id, w.programme_date ,
  booking_details.booking_id,
  booking_details.app_id, booking_details.booking_seq, booking_details.check_digit,
  booking_details.welsh_test_ind, booking_details.ext_req_ind, booking_details.progressive_access,
  booking_details.meeting_place, booking_details.special_needs, booking_details.ent_check_ind,
  booking_details.cab_seat_count, booking_details.passenger_seat_count,
  booking_details.height_metres, booking_details.length_metres, booking_details.width_metres,
  booking_details.vehicle_category, booking_details.gearbox_type, booking_details.candidate_id,
  booking_details.candidate_title, booking_details.candidate_first_name, booking_details.candidate_second_name,
  booking_details.candidate_third_name, booking_details.candidate_surname, booking_details.candidate_driver_number,
  booking_details.cand_primary_tel, booking_details.cand_secondary_tel, booking_details.cand_mobile_tel, booking_details.cand_email,
  booking_details.address_line_1 as candidate_addr_line1, booking_details.address_line_2 as candidate_addr_line2,
  booking_details.address_line_3 as candidate_addr_line3, booking_details.address_line_4 as candidate_addr_line4,
  booking_details.address_line_5 as candidate_addr_line5, booking_details.post_code as candidate_post_code,
  booking_details.candidate_prn,
  (case when booking_details.candidate_prn is not null
          then getPreviousADIAttempts(booking_details.candidate_id, booking_details.vehicle_category)
      else null end) as prev_attempts,
  booking_details.business_id, booking_details.business_name,
  booking_details.business_addr_line1, booking_details.business_addr_line2,
  booking_details.business_addr_line3, booking_details.business_addr_line4,
  booking_details.business_addr_line5, booking_details.business_post_code,
  booking_details.business_telephone,
  booking_details.cancel_booking_id, booking_details.cancel_initiator
from WORK_SCHEDULE_SLOTS w
  left join VEHICLE_SLOT_TYPE vst on w.vst_code = vst.vst_code
  join  TEST_CENTRE tc on w.tc_id = tc.tc_id
  join  TEST_CENTRE_NAME tcn on w.tc_id = tcn.tc_id
  left join (
      select b.booking_id as booking_id, b.app_id as app_id, b.slot_id as slot_id,
          a.welsh_test_ind as welsh_test_ind, a.ext_req_ind as ext_req_ind, a.progressive_access,
          getEntitlementCheckIndicator(b.app_id) as ent_check_ind,
          a.meeting_place_req_text as meeting_place, a.special_needs_text as special_needs, ari.booking_seq as booking_seq,
          ari.check_digit as check_digit, v.cab_seat_count, v.passenger_seat_count,
          v.height_m as height_metres, v.length_m as length_metres, v.width_m as width_metres,
                                              case
              when v.gearbox_code=1 then 'Manual'
              when v.gearbox_code=2 then 'Automatic'
              when v.gearbox_code=3 then 'Semi-Automatic'
              else null
                                              end as gearbox_type,
          ts.test_category_ref as vehicle_category, i.individual_id as candidate_id,
          initcap(title_ref.item_desc1) as candidate_title, initcap(i.first_forename) as candidate_first_name,
          initcap(i.second_forename) as candidate_second_name, initcap(i.third_forename) as candidate_third_name,
          initcap(i.family_name) as candidate_surname, i.driver_number as candidate_driver_number,
          cand_cd.contact_details_id as candidate_cd_id, cand_cd.cand_primary_tel, cand_cd.cand_secondary_tel, cand_cd.cand_mobile_tel, cand_cd.cand_email,
          cand_addr.address_id as candidate_addr_id, cand_addr.address_line_1, cand_addr.address_line_2, cand_addr.address_line_3,
          cand_addr.address_line_4, cand_addr.address_line_5, cand_addr.post_code,
          case when ts.test_category_ref like 'ADI%' then cand_adi.prn else null end as candidate_prn,
          case
                                  when co.booker_type_code = 'B' then co.business_id
          when co.booker_type_code = 'T' then co.business_id
          else null
                                              end as business_id,
          business_details.business_name, business_details.organisation_id, business_details.organisation_register_id,
          business_details.address_id as business_addr_id, business_details.contact_details_id as business_cd_id,
          business_details.address_line_1 as business_addr_line1, business_details.address_line_2 as business_addr_line2,
          business_details.address_line_3 as business_addr_line3, business_details.address_line_4 as business_addr_line4,
          business_details.address_line_5 as business_addr_line5, business_details.post_code as business_post_code,
          business_details.primary_tel_number as business_telephone,
          cancellations.cancel_booking_id, cancellations.cancel_initiator
      from BOOKING  b
              join APPLICATION a on a.app_id = b.app_id
              join APPLICATION_RSIS_INFO ari on b.booking_id = ari.booking_id
              left join VEHICLE v on a.vehicle_id = v.vehicle_id
              left join TEST_SERVICE ts on a.test_service_id = ts.test_service_id
              left join INDIVIDUAL  i on a.individual_id = i.individual_id
              left join REF_DATA_ITEM_MASTER  title_ref on i.title_code = title_ref.item_id
              join CUSTOMER_ORDER co on a.order_id = co.order_id
              left join (
                  select ccd.contact_details_id, ccd.individual_id,
                      case when ccd.prim_tel_voicemail_ind = 1 then ccd.primary_tel_number else null end as cand_primary_tel,
                      case when ccd.sec_tel_voicemail_ind = 1 then ccd.secondary_tel_number else null end as cand_secondary_tel,
                      case when ccd.mobile_voicemail_ind = 1 then ccd.mobile_tel_number else null end as cand_mobile_tel,
                      ccd.email_address as cand_email
                  from CONTACT_DETAILS  ccd
              ) cand_cd on a.individual_id = cand_cd.individual_id
              left join (
              select caddr.individual_id, caddr.address_id,
                          caddr.address_line_1, caddr.address_line_2, caddr.address_line_3,
                          caddr.address_line_4, caddr.address_line_5, caddr.post_code
              from ADDRESS caddr
              where caddr.address_type_code = 1263
              ) cand_addr on a.individual_id = cand_addr.individual_id
              left join (
                  select reg.individual_id, reg.prn
                  from REGISTER reg
              ) cand_adi on a.individual_id = cand_adi.individual_id
              left join (
                      select org_reg.business_id as business_id, org.organisation_name as business_name,
                      org.organisation_id, bus_addr.address_id,
                      bus_addr.address_line_1, bus_addr.address_line_2, bus_addr.address_line_3,
                      bus_addr.address_line_4, bus_addr.address_line_5, bus_addr.post_code,
                      bus_cd.contact_details_id, org_reg.organisation_register_id, bus_cd.primary_tel_number
                      from ORGANISATION_REGISTER org_reg
                      join ORGANISATION org on org_reg.organisation_id = org.organisation_id
                      left join (
                              select baddr.organisation_id, baddr.address_id,
                                          baddr.address_line_1, baddr.address_line_2, baddr.address_line_3,
                                          baddr.address_line_4, baddr.address_line_5, baddr.post_code
                              from ADDRESS  baddr
                              where baddr.address_type_code = 1280
                      ) bus_addr on org.organisation_id = bus_addr.organisation_id
                      left join CONTACT_DETAILS  bus_cd on bus_cd.organisation_register_id = org_reg.organisation_register_id
                  ) business_details on co.booker_type_code in ('B','T') and co.business_id = business_details.business_id
              left join (
              select cancelled_bookings.booking_id as cancel_booking_id, cancelled_bookings.app_id,
                      bcr.initiator_code as cancel_initiator
              from BOOKING  cancelled_bookings, BOOKING_CANCELLATION_REASON bcr
              where cancelled_bookings.booking_cancel_reason_code = bcr.booking_cancel_reason_code
              and bcr.initiator_code in ('Act of nature', 'DSA')
              ) cancellations on cancellations.app_id = a.app_id
                              where b.state_code !=2
  ) booking_details on w.slot_id = booking_details.slot_id
where w.programme_date between CAST('2017-08-14' AS DATE) and CAST('2017-08-15' AS DATE)
and w.examiner_end_date > CAST('2017-08-14' AS DATE)
and (w.non_test_activity_code is null or booking_details.slot_id is not null)
and (booking_details.candidate_id is null or booking_details.candidate_cd_id  = (
              select max(contact_details_id)
                  from CONTACT_DETAILS
                  where individual_id = booking_details.candidate_id))                      
and (booking_details.candidate_id is null or booking_details.candidate_addr_id = (      
              select max(address_id)
              from ADDRESS
              where individual_id = booking_details.candidate_id
              and address_type_code = 1263))
and (booking_details.organisation_register_id is null or booking_details.business_cd_id = (      
      select max(contact_details_id)
      from CONTACT_DETAILS
      where organisation_register_id = booking_details.organisation_register_id))
and (booking_details.organisation_id is null or booking_details.business_addr_id = (      
      select max(address_id)
      from ADDRESS
      where organisation_id = booking_details.organisation_id
      and address_type_code = 1280))
AND w.individual_id IN (${idGroup.join(',')})
LIMIT 100
`
};

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
  cancel_booking_id: number;
  cancel_initiator: string;
}

const mapRow = (row: TestSlotRow): ExaminerTestSlot => {
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
          age: 0, // TODO: Find out the age
          candidateName: {
            title: row.candidate_title,
            firstName: row.candidate_first_name,
            secondName: row.candidate_second_name,
            thirdName: row.candidate_third_name,
            lastName: row.candidate_surname,
          },
          driverNumber: row.candidate_driver_number,
          gender: 'either', // TODO: Find the gender
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
        // TODO: Include previous cancellations once schema is clarified.
        // previousCancellation: {
        // },
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
        }
      },
    },
  };
};

const convertIndicator = (indicator: number): boolean => {
  return indicator === 1;
};

/* tslint:enable */
