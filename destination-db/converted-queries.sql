-- example queries for Aurora (MySQL)
-- converted from the iBatis work schedule DAO Sql Map

-- insert into work_schedule_slots
-- select ps.slot_id, DATE(p.programme_date), ps.start_time, ps.minutes,
--     ps.individual_id, ps.tc_id, ps.vst_code, ps.non_test_activity_code
-- from PROGRAMME p join PROGRAMME_SLOT ps on
--     (DATE(ps.programme_date) = DATE(p.programme_date)
--         and ps.individual_id = p.individual_id
--         and ps.tc_id = p.tc_id)
--     join EXAMINER e on e.individual_id = p.individual_id
-- where DATE(p.programme_date) between STR_TO_DATE('07/08/2017', '%d/%m/%Y') and STR_TO_DATE('08/08/2017', '%d/%m/%Y')
-- and (p.state_code not in (2, 3)
--         or exists (select book.booking_id
--             from BOOKING book, PROGRAMME_SLOT slot
--             where slot.slot_id = book.slot_id
--             and DATE(slot.programme_date) = DATE(p.programme_date)
--             and slot.individual_id = p.individual_id
--             and slot.tc_id = p.tc_id
--             and book.state_code = 1)
-- )
-- and ps.tc_closed_ind != 1
-- and IFNULL(ps.deployed_to_from_code, 0) != 1
-- and IFNULL(e.grade_code, 'ZZZ') != 'DELE'
-- and exists (
--     select end_date from EXAMINER_STATUS es
--         where es.individual_id = e.individual_id
--         and IFNULL(es.end_date, STR_TO_DATE('01/01/4000', '%d/%m/%Y')) > STR_TO_DATE('08/08/2017', '%d/%m/%Y')
-- )
-- using the view
-- Note: only filter programme_date if need less data than the total replicated
select slot_id, programme_date, start_time, minutes, individual_id, tc_id, vst_code, 
    non_test_activity_code, examiner_end_date
from WORK_SCHEDULE_SLOTS
where programme_date between STR_TO_DATE('03/08/2017', '%d/%m/%Y') and STR_TO_DATE('06/08/2017', '%d/%m/%Y')
and examiner_end_date > STR_TO_DATE('06/08/2017', '%d/%m/%Y')

 -- select examinerDataSet - for a single day
 -- todo: no mysql equiv of initcap(..) for name fields, do in code...
select e.individual_id, e.staff_number, title_ref.item_desc1 as title,
        i.first_forename as first_forename, i.second_forename as second_forename,
        i.third_forename as third_forename, i.family_name as family_name,
        active_posting.tc_id, active_posting.tc_name, active_posting.tc_cost_centre_code
from INDIVIDUAL i 
    left join REF_DATA_ITEM_MASTER title_ref on i.title_code = title_ref.item_id
    join EXAMINER e on e.individual_id = i.individual_id
    left join (
        select p.individual_id as posting_indv_id, p.tc_id as tc_id, tcn.tc_name as tc_name, tc.tc_cost_centre_code
        from POSTING p
          left join TEST_CENTRE tc on p.tc_id = tc.tc_id
          left join TEST_CENTRE_NAME tcn on p.tc_id = tcn.tc_id
        -- where STR_TO_DATE('14/08/2017', '%d/%m/%Y') between DATE(p.start_date) and DATE(p.end_date)
        -- and p.tc_id = tcn.tc_id
        -- and p.tc_id = tc.tc_id
    --    and tcn.display_order = 1
        ) active_posting on e.individual_id = active_posting.posting_indv_id
-- where e.individual_id = i.individual_id
-- and e.mobile_ind = 1
-- and i.title_code = title_ref.item_id
-- and e.individual_id = active_posting.posting_indv_id
-- and IFNULL(e.grade_code, 'ZZZ') != 'DELE'
where IFNULL(e.grade_code, 'ZZZ') != 'DELE'
and exists (
    select end_date from EXAMINER_STATUS es
    where es.individual_id = e.individual_id
    and IFNULL(es.end_date, STR_TO_DATE('01/01/4000', '%d/%m/%Y')) > STR_TO_DATE('14/08/2017', '%d/%m/%Y')
)

 -- select testSlotDataSet
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
    round((w.programme_date - booking_details.date_of_birth) / 365) as candidate_age,
    booking_details.candidate_title, booking_details.candidate_first_name, booking_details.candidate_second_name,
    booking_details.candidate_third_name, booking_details.candidate_surname, booking_details.candidate_driver_number,
    booking_details.cand_primary_tel, booking_details.cand_secondary_tel, booking_details.cand_mobile_tel, booking_details.cand_email,
    booking_details.address_line_1 as candidate_addr_line1, booking_details.address_line_2 as candidate_addr_line2,
    booking_details.address_line_3 as candidate_addr_line3, booking_details.address_line_4 as candidate_addr_line4,
    booking_details.address_line_5 as candidate_addr_line5, booking_details.post_code as candidate_post_code,
    booking_details.candidate_gender, booking_details.candidate_prn,
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
            ts.test_category_ref as vehicle_category, i.individual_id as candidate_id, i.date_of_birth as date_of_birth,
            initcap(title_ref.item_desc1) as candidate_title, initcap(i.first_forename) as candidate_first_name,
            initcap(i.second_forename) as candidate_second_name, initcap(i.third_forename) as candidate_third_name,
            initcap(i.family_name) as candidate_surname, i.driver_number as candidate_driver_number,
            cand_cd.contact_details_id as candidate_cd_id, cand_cd.cand_primary_tel, cand_cd.cand_secondary_tel, cand_cd.cand_mobile_tel, cand_cd.cand_email,
            cand_addr.address_id as candidate_addr_id, cand_addr.address_line_1, cand_addr.address_line_2, cand_addr.address_line_3,
            cand_addr.address_line_4, cand_addr.address_line_5, cand_addr.post_code,
            gender_ref.item_desc1 as candidate_gender,
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
                left join REF_DATA_ITEM_MASTER  gender_ref on i.gender_code = gender_ref.item_id
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
                -- where register_code = 195
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
                                                                                         -- where org_reg.register_code = 1418
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
-- and tcn.display_order = 1
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

-- select personalCommitmentDataSet
select e.individual_id, pc.commitment_id, pc.start_date_time, pc.end_date_time, pc.non_test_activity_code, reason.reason_desc
from EXAMINER e 
    left join PERSONAL_COMMITMENT pc on e.individual_id = pc.individual_id
    left join NON_TEST_ACTIVITY_REASON reason on pc.non_test_activity_code = reason.non_test_activity_code
-- where pc.non_test_activity_code = reason.non_test_activity_code
-- and e.individual_id = pc.individual_id
-- and e.mobile_ind = 1
-- and
where (
    DATE(pc.start_date_time) between STR_TO_DATE('03/08/2017', '%d/%m/%Y') and STR_TO_DATE('16/08/2017', '%d/%m/%Y')
    or DATE(pc.end_date_time) between STR_TO_DATE('03/08/2017', '%d/%m/%Y') and STR_TO_DATE('16/08/2017', '%d/%m/%Y')
)
-- and pc.state_code = 1
and IFNULL(e.grade_code, 'ZZZ') != 'DELE'
and exists (
    select end_date 
    from EXAMINER_STATUS es
    where es.individual_id = e.individual_id
    and IFNULL(es.end_date, STR_TO_DATE('01/01/4000', '%d/%m/%Y')) > STR_TO_DATE('16/08/2017', '%d/%m/%Y')
)

-- select nonTestActivityDataSet
select w.individual_id, w.slot_id, w.start_time, w.minutes, w.non_test_activity_code,
    reason.reason_desc, w.tc_id, tcn.tc_name, tc.tc_cost_centre_code
from WORK_SCHEDULE_SLOTS w
    left join NON_TEST_ACTIVITY_REASON reason on w.non_test_activity_code = reason.non_test_activity_code
    left join TEST_CENTRE tc on w.tc_id = tc.tc_id
    left join TEST_CENTRE_NAME tcn on w.tc_id = tcn.tc_id
where w.programme_date between STR_TO_DATE('03/08/2017', '%d/%m/%Y') and STR_TO_DATE('16/08/2017', '%d/%m/%Y')
and w.examiner_end_date > STR_TO_DATE('03/08/2017', '%d/%m/%Y')
-- and w.non_test_activity_code = reason.non_test_activity_code
-- and w.tc_id = tc.tc_id
-- and w.tc_id = tcn.tc_id
-- and tcn.display_order = 1


-- select advanceTestSlotDataSet
select w.individual_id, w.slot_id, w.start_time, w.minutes, w.tc_id, tcn.tc_name, tc.tc_cost_centre_code, vst.short_vst_desc
from WORK_SCHEDULE_SLOTS w
    left join TEST_CENTRE tc on w.tc_id = tc.tc_id
    left join TEST_CENTRE_NAME tcn on w.tc_id = tcn.tc_id
    left join VEHICLE_SLOT_TYPE vst on w.vst_code = vst.vst_code
where w.programme_date between STR_TO_DATE('03/08/2017', '%d/%m/%Y') and STR_TO_DATE('16/08/2017', '%d/%m/%Y')
and w.examiner_end_date > STR_TO_DATE('03/08/2017', '%d/%m/%Y')
-- and w.tc_id = tc.tc_id
-- and w.tc_id = tcn.tc_id
-- and tcn.display_order = 1
-- and w.vst_code = vst.vst_code

 -- select deploymentDataSet
select d.deployment_id, e.individual_id, d.tc_id, tcn.tc_name, tc.tc_cost_centre_code, p.programme_date
from EXAMINER e
    left join DEPLOYMENT d on e.individual_id = d.individual_id
    left join TEST_CENTRE tc on d.tc_id = tc.tc_id
    left join TEST_CENTRE_NAME tcn on d.tc_id = tcn.tc_id
    left join PROGRAMME p on p.individual_id = e.individual_id
-- where e.individual_id = d.individual_id
-- and e.mobile_ind = 1
where (
    DATE(d.start_date) between STR_TO_DATE('03/08/2017', '%d/%m/%Y') and STR_TO_DATE('02/02/2018', '%d/%m/%Y')
    or DATE(d.end_date) between STR_TO_DATE('03/08/2017', '%d/%m/%Y') and STR_TO_DATE('02/02/2018', '%d/%m/%Y')
)
-- and d.state_code = 1002
-- and d.tc_id = tc.tc_id
-- and d.tc_id = tcn.tc_id
-- and tcn.display_order = 1
and DATE(p.programme_date) between DATE(d.start_date) and DATE(d.end_date)
-- and p.individual_id = e.individual_id
and p.tc_id = d.tc_id
and IFNULL(e.grade_code, 'ZZZ') != 'DELE'
and exists (
    select end_date 
    from EXAMINER_STATUS es
    where es.individual_id = e.individual_id
    and IFNULL(es.end_date, STR_TO_DATE('01/01/4000', '%d/%m/%Y')) > STR_TO_DATE('02/02/2018', '%d/%m/%Y')
)
