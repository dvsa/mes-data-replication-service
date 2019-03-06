import * as mysql from 'mysql';
import * as moment from 'moment';
import { ExaminerTestSlot } from '../../../domain/examiner-test-slot';
import { flatten } from 'lodash';
import { mapRow } from './row-mappers/test-slot-row-mapper';
import { query } from '../../../../../common/framework/mysql/database';
import { logDuration } from '../../../../../common/framework/log/logger';

/**
 * Get all detailed test slots, for the specified time window.
 * @param connectionPool The MySQL connection pool to use
 * @param examinerIdGroups The groups of examiners to use
 * @param startDate The start date of the time window
 * @param endDate The end date of the time window
 * @returns The detailed test slots
 */
export const getTestSlots = async (
  connectionPool: mysql.Pool,
  examinerIdGroups: number[][],
  startDate: Date,
  endDate: Date,
): Promise<ExaminerTestSlot[]> => {
  const sqlYearFormat = 'YYYY-MM-DD';
  const windowStart = moment(startDate).format(sqlYearFormat);
  const windowEnd = moment(endDate).format(sqlYearFormat);

  const sqlQueries = examinerIdGroups.map(idGroup => getQueryForExaminerIdGroup(idGroup));
  const numberOfExaminersQueried = examinerIdGroups.reduce((acc, group) => acc + group.length, 0);
  console.log(`Querying ${numberOfExaminersQueried} examiners between ${windowStart} and ${windowEnd}`);

  const start = new Date();
  const promises = sqlQueries.map(sql => query(connectionPool, sql, [windowStart, windowEnd, windowStart]));
  const results = await Promise.all(promises);

  const mappedResults = flatten(results.map(resultGroup => resultGroup.map(mapRow)));
  const end = new Date();
  logDuration(start, end, `${mappedResults.length} test slots loaded and mapped`);
  return mappedResults;
};

/**
 * Get the SQL query for a group of examiners.
 * @param idGroup The group of examiner ids
 * @returns The SQL query
 */
const getQueryForExaminerIdGroup = (idGroup: number[]) => {
  return `
 select w.slot_id, w.start_time as start_time, w.minutes as minutes,
     vst.short_vst_desc as vehicle_slot_type, w.tc_id, tc.tc_cost_centre_code as tc_cost_centre_code,
     tcn.tc_name as tc_name, w.individual_id, w.programme_date, booking_details.booking_id,
     booking_details.app_id, booking_details.booking_seq, booking_details.check_digit,
     booking_details.welsh_test_ind, booking_details.ext_req_ind, booking_details.progressive_access,
     booking_details.meeting_place as meeting_place, booking_details.special_needs as special_needs,
     getEntitlementCheckIndicator(booking_details.app_id) as ent_check_ind,
     booking_details.cab_seat_count, booking_details.passenger_seat_count,
     booking_details.height_metres, booking_details.length_metres, booking_details.width_metres,
     booking_details.vehicle_category as vehicle_category,
     booking_details.gearbox_code as gearbox_type,
     booking_details.candidate_id,
     booking_details.candidate_title as candidate_title,
     booking_details.candidate_first_name as candidate_first_name,
     booking_details.candidate_second_name as candidate_second_name,
     booking_details.candidate_third_name as candidate_third_name,
     booking_details.candidate_surname as candidate_surname,
     booking_details.candidate_driver_number as candidate_driver_number,
     booking_details.prim_tel_voicemail_ind as cand_primary_tel_ind,
     booking_details.primary_tel_number as cand_primary_tel,
     booking_details.sec_tel_voicemail_ind as cand_secondary_tel_ind,
     booking_details.secondary_tel_number as cand_secondary_tel,
     booking_details.mobile_voicemail_ind as cand_mobile_tel_ind,
     booking_details.mobile_tel_number as cand_mobile_tel,
     booking_details.cand_email as cand_email,
     booking_details.address_line_1 as candidate_addr_line1,
     booking_details.address_line_2 as candidate_addr_line2,
     booking_details.address_line_3 as candidate_addr_line3,
     booking_details.address_line_4 as candidate_addr_line4,
     booking_details.address_line_5 as candidate_addr_line5,
     booking_details.post_code as candidate_post_code,
     booking_details.candidate_prn,
    (case
        when booking_details.candidate_prn is not null
          then getPreviousADIAttempts(booking_details.candidate_id, booking_details.vehicle_category)
        else null
     end) as prev_attempts,
     booking_details.business_id, booking_details.business_name as business_name,
     booking_details.business_addr_line1 as business_addr_line1,
     booking_details.business_addr_line2 as business_addr_line2,
     booking_details.business_addr_line3 as business_addr_line3,
     booking_details.business_addr_line4 as business_addr_line4,
     booking_details.business_addr_line5 as business_addr_line5,
     booking_details.business_post_code as business_post_code,
     booking_details.business_telephone as business_telephone,
     booking_details.cancel_initiator
 from
  WORK_SCHEDULE_SLOTS w
    join TEST_CENTRE tc on w.tc_id = tc.tc_id
    join TEST_CENTRE_NAME tcn on w.tc_id = tcn.tc_id
    left join VEHICLE_SLOT_TYPE vst on w.vst_code = vst.vst_code
    left join (
       select b.booking_id as booking_id, b.app_id as app_id, b.slot_id as slot_id,
         a.welsh_test_ind as welsh_test_ind, a.ext_req_ind as ext_req_ind, a.progressive_access,
         a.meeting_place_req_text as meeting_place, a.special_needs_text as special_needs,
         ari.booking_seq as booking_seq,
         ari.check_digit as check_digit, v.cab_seat_count, v.passenger_seat_count,
         v.height_m as height_metres, v.length_m as length_metres, v.width_m as width_metres,
         v.gearbox_code,
         ts.test_category_ref as vehicle_category, i.individual_id as candidate_id,
         title_ref.item_desc1 as candidate_title, i.first_forename as candidate_first_name,
         i.second_forename as candidate_second_name, i.third_forename as candidate_third_name,
         i.family_name as candidate_surname, i.driver_number as candidate_driver_number,
         ccd.contact_details_id as candidate_cd_id, ccd.prim_tel_voicemail_ind, ccd.primary_tel_number,
         ccd.sec_tel_voicemail_ind, ccd.secondary_tel_number, ccd.mobile_voicemail_ind, ccd.mobile_tel_number,
         ccd.email_address as cand_email, cand_addr.address_id as candidate_addr_id, cand_addr.address_line_1,
         cand_addr.address_line_2, cand_addr.address_line_3, cand_addr.address_line_4, cand_addr.address_line_5,
         cand_addr.post_code,
         case when ts.test_category_ref like 'ADI%' then cand_adi.prn else null end as candidate_prn,
         case when co.booker_type_code IN ('B','T') then co.business_id else null end as business_id,
         business_details.business_name, business_details.organisation_id, business_details.organisation_register_id,
         business_details.address_id as business_addr_id, business_details.contact_details_id as business_cd_id,
         business_details.address_line_1 as business_addr_line1, business_details.address_line_2 as business_addr_line2,
         business_details.address_line_3 as business_addr_line3, business_details.address_line_4 as business_addr_line4,
         business_details.address_line_5 as business_addr_line5, business_details.post_code as business_post_code,
         business_details.primary_tel_number as business_telephone,
                 cancellations.cancel_initiator
       from BOOKING  b
         join APPLICATION a on a.app_id = b.app_id
         join APPLICATION_RSIS_INFO ari on b.booking_id = ari.booking_id
         join CUSTOMER_ORDER co on a.order_id = co.order_id
         left join VEHICLE v on a.vehicle_id = v.vehicle_id
         left join TEST_SERVICE ts on a.test_service_id = ts.test_service_id
         left join INDIVIDUAL  i on a.individual_id = i.individual_id
         left join REF_DATA_ITEM_MASTER  title_ref on i.title_code = title_ref.item_id
         left join CONTACT_DETAILS ccd on a.individual_id = ccd.individual_id
         left join ADDRESS cand_addr on cand_addr.address_type_code = 1263 and a.individual_id = cand_addr.individual_id
         left join REGISTER cand_adi on a.individual_id = cand_adi.individual_id
         left join (
               select org_reg.business_id as business_id, org.organisation_name as business_name,
                   org.organisation_id, bus_addr.address_id,
               bus_addr.address_line_1, bus_addr.address_line_2, bus_addr.address_line_3,
               bus_addr.address_line_4, bus_addr.address_line_5, bus_addr.post_code,
               bus_cd.contact_details_id, org_reg.organisation_register_id, bus_cd.primary_tel_number
               from ORGANISATION_REGISTER org_reg
               join ORGANISATION org on org_reg.organisation_id = org.organisation_id
               left join ADDRESS bus_addr on
                 bus_addr.address_type_code = 1280 and org.organisation_id = bus_addr.organisation_id
               left join CONTACT_DETAILS  bus_cd on bus_cd.organisation_register_id = org_reg.organisation_register_id
               ) business_details on co.booker_type_code in ('B','T') and co.business_id = business_details.business_id
         left join (
               select cancelled_bookings.app_id, group_concat(bcr.initiator_code) as cancel_initiator
               from BOOKING cancelled_bookings
               join BOOKING_CANCELLATION_REASON bcr
               on cancelled_bookings.booking_cancel_reason_code = bcr.booking_cancel_reason_code
               where bcr.initiator_code in ('Act of nature', 'DSA')
                             group by cancelled_bookings.app_id
               ) cancellations on cancellations.app_id = a.app_id
       where b.state_code !=2
    ) booking_details on w.slot_id = booking_details.slot_id
 where w.individual_id in (${idGroup.join(',')})
 and w.programme_date between ? and ?
 and w.examiner_end_date >= ?
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
`;
};
