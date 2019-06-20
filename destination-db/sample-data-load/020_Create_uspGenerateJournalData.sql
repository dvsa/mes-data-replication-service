DROP PROCEDURE IF EXISTS tarsreplica.uspGenerateJournalData;

DELIMITER //

CREATE PROCEDURE tarsreplica.uspGenerateJournalData
	(
	Date DATE,
	IndividualId BIGINT,
	TestCentreId BIGINT,	
	CancReason1 VARCHAR(20),
	CancReason2 VARCHAR(20),
	CancReason3 VARCHAR(20),
	SlotHr TINYINT,
	SlotMinute TINYINT,
	TestCategoryRef VARCHAR(10),
	Minutes SMALLINT,
	NTACode VARCHAR(4),
	GearboxType VARCHAR(20),
	LargeVehicle TINYINT,
	DriverNumber VARCHAR(24),
	DateOfBirth DATE,
	Title VARCHAR(20),
	FirstName VARCHAR(50),
	SecondName VARCHAR(50),
	ThirdName VARCHAR(50),
	Surname VARCHAR(50),
	Gender VARCHAR(6),
	Ethnicity VARCHAR(33),
	PrimaryTelNo VARCHAR(30),
	SecondaryTelNo VARCHAR(30),
	MobileTelNo VARCHAR(30),
	EmailAddress VARCHAR(100),
	AddressLine1 VARCHAR(255),
	AddressLine2 VARCHAR(100),
	AddressLine3 VARCHAR(100),
	AddressLine4 VARCHAR(100),
	AddressLine5 VARCHAR(255),
	PostCode VARCHAR(255),
	ExtendedTest TINYINT,
	SpecialNeedsCode VARCHAR(20),
	EntitlementCheck TINYINT,
	WelshTest TINYINT,
	SpecialNeedsText VARCHAR(512),
	ProgressiveAccess TINYINT,
	BookingSeq TINYINT,
	CheckDigit TINYINT
	)

	BEGIN
	
		-- Set identifier variables
		SET @CandidateId			= (SELECT IFNULL((SELECT MAX(individual_id) FROM INDIVIDUAL WHERE individual_id >= 90000000)+1,90000000));
		SET @ContactDetailsId		= (SELECT IFNULL((SELECT MAX(contact_details_id) FROM CONTACT_DETAILS WHERE contact_details_id >= 90000000)+1,90000000));
		SET @AddressId				= (SELECT IFNULL((SELECT MAX(address_id) FROM ADDRESS WHERE address_id >= 90000000)+1,90000000));
		SET @BookingId				= (SELECT IFNULL((SELECT MAX(booking_id) FROM BOOKING WHERE booking_id >= 90000000)+1,90000000));
		SET @AppId					= (SELECT IFNULL((SELECT MAX(app_id) FROM APPLICATION WHERE app_id >= 90000000)+1,90000000));
		SET @SlotId					= (SELECT IFNULL((SELECT MAX(slot_id) FROM PROGRAMME_SLOT WHERE slot_id >= 90000000)+1,90000000));
		
		-- Set calculated variables
		SET @GearboxCode			= (SELECT CASE WHEN GearboxType = 'Manual' THEN 1 ELSE 2 END);
		SET @VehicleId				= (SELECT MAX(vehicle_id) FROM (SELECT vehicle_id, gearbox_code, CASE WHEN height_m IS NULL THEN 0 ELSE 1 END AS large_vehicle FROM VEHICLE LIMIT 1000) v WHERE gearbox_code = @GearboxCode AND large_vehicle = LargeVehicle);
		SET @TestServiceId			= (SELECT MAX(test_service_id) FROM TEST_SERVICE WHERE test_category_ref = TestCategoryRef AND extended_ind = ExtendedTest AND special_needs_code = SpecialNeedsCode);
		SET @VSTCode				= (SELECT VST_CODE FROM TEST_SERVICE WHERE test_service_id = @TestServiceId);
		SET @AppStateCode			= (SELECT CASE WHEN EntitlementCheck = 1 THEN 3 ELSE 2 END);

		-- PROGRAMME_SLOT
		INSERT INTO PROGRAMME_SLOT (slot_id, start_time, minutes, vst_code, non_test_activity_code, individual_id, programme_date, tc_id, deployed_to_from_code, tc_closed_ind)
		SELECT @SlotId, DATE_ADD(DATE_ADD(Date, INTERVAL SlotHr HOUR), INTERVAL SlotMinute MINUTE), Minutes, @VSTCode, NTACode, IndividualId, Date, TestCentreId, 0, 0
		FROM DUAL;
		
		-- INDIVIDUAL
		INSERT INTO INDIVIDUAL (individual_id, driver_number, date_of_birth, title_code, family_name, first_forename, second_forename, third_forename, gender_code, ethnic_origin_code)
		SELECT @CandidateId, DriverNumber, DateOfBirth, (SELECT ITEM_ID FROM REF_DATA_ITEM_MASTER WHERE ITEM_DESC1 = Title), Surname, FirstName, SecondName, ThirdName, (SELECT ITEM_ID FROM REF_DATA_ITEM_MASTER WHERE ITEM_DESC1 = Gender), (SELECT ITEM_ID FROM REF_DATA_ITEM_MASTER WHERE ITEM_DESC1 = Ethnicity)
		FROM DUAL
		WHERE NTACode IS NULL;
		
		-- CONTACT_DETAILS
		INSERT INTO CONTACT_DETAILS (contact_details_id, organisation_register_id, individual_id, primary_tel_number, secondary_tel_number, email_address, mobile_tel_number, prim_tel_voicemail_ind, sec_tel_voicemail_ind, mobile_voicemail_ind)
		SELECT @ContactDetailsId, NULL, @CandidateId, PrimaryTelNo, SecondaryTelNo, EmailAddress, MobileTelNo, 1, 1, 1
		FROM DUAL
		WHERE NTACode IS NULL;

		-- ADDRESS
		INSERT INTO ADDRESS (address_id, address_line_1, address_line_2, address_line_3, address_line_4, address_line_5, post_code, address_type_code, organisation_id, individual_id)
		SELECT @AddressId, AddressLine1, AddressLine2, AddressLine3, AddressLine4, AddressLine5, PostCode, 1263, NULL, @CandidateId
		FROM DUAL
		WHERE NTACode IS NULL;
		
		-- BOOKING (1st cancellation)
		INSERT INTO BOOKING (booking_id, app_id, booking_cancel_reason_code, state_code, slot_id)
		SELECT @BookingId, @AppId, (SELECT MIN(booking_cancel_reason_code) FROM BOOKING_CANCELLATION_REASON WHERE initiator_code = 'DSA'), 1, NULL
		FROM DUAL
		WHERE cancReason1 = 'DSA';

		INSERT INTO BOOKING (booking_id, app_id, booking_cancel_reason_code, state_code, slot_id)
		SELECT @BookingId, @AppId, (SELECT MIN(booking_cancel_reason_code) FROM BOOKING_CANCELLATION_REASON WHERE initiator_code = 'Act of nature'), 1, NULL
		FROM DUAL
		WHERE cancReason1 = 'Act of nature';
		
		UPDATE PROGRAMME_SLOT
		SET programme_date = DATE_ADD(programme_date, INTERVAL -1 MONTH)
		,start_time = DATE_ADD(start_time, INTERVAL -1 MONTH)
		WHERE slot_id = @SlotId
		AND cancReason1 IS NOT NULL;

		SET @SlotId			= (SELECT IFNULL((SELECT IFNULL((SELECT MAX(slot_id) FROM PROGRAMME_SLOT WHERE slot_id >= 90000000)+1,90000000) FROM DUAL WHERE cancReason1 IS NOT NULL),@SlotId));
		SET @BookingId		= (SELECT IFNULL((SELECT IFNULL((SELECT MAX(booking_id) FROM BOOKING WHERE booking_id >= 90000000)+1,90000000) FROM DUAL WHERE cancReason1 IS NOT NULL),@BookingId));
				
		INSERT INTO PROGRAMME_SLOT (slot_id, start_time, minutes, vst_code, non_test_activity_code, individual_id, programme_date, tc_id, deployed_to_from_code, tc_closed_ind)
		SELECT @SlotId, DATE_ADD(DATE_ADD(Date, INTERVAL SlotHr HOUR), INTERVAL SlotMinute MINUTE), Minutes, @VSTCode, NTACode, IndividualId, Date, TestCentreId, 0, 0
		FROM DUAL
		WHERE cancReason1 IS NOT NULL;
			
		-- BOOKING (2nd cancellation)
		INSERT INTO BOOKING (booking_id, app_id, booking_cancel_reason_code, state_code, slot_id)
		SELECT @BookingId, @AppId, (SELECT MIN(booking_cancel_reason_code) FROM BOOKING_CANCELLATION_REASON WHERE initiator_code = 'DSA'), 1, NULL
		FROM DUAL
		WHERE cancReason2 = 'DSA';

		INSERT INTO BOOKING (booking_id, app_id, booking_cancel_reason_code, state_code, slot_id)
		SELECT @BookingId, @AppId, (SELECT MIN(booking_cancel_reason_code) FROM BOOKING_CANCELLATION_REASON WHERE initiator_code = 'Act of nature'), 1, NULL
		FROM DUAL
		WHERE cancReason2 = 'Act of nature';
		
		UPDATE PROGRAMME_SLOT
		SET programme_date = DATE_ADD(programme_date, INTERVAL -2 MONTH)
		,start_time = DATE_ADD(start_time, INTERVAL -2 MONTH)
		WHERE slot_id = @SlotId
		AND cancReason2 IS NOT NULL;
			
		SET @SlotId			= (SELECT IFNULL((SELECT IFNULL((SELECT MAX(slot_id) FROM PROGRAMME_SLOT WHERE slot_id >= 90000000)+1,90000000) FROM DUAL WHERE cancReason2 IS NOT NULL),@SlotId));
		SET @BookingId		= (SELECT IFNULL((SELECT IFNULL((SELECT MAX(booking_id) FROM BOOKING WHERE booking_id >= 90000000)+1,90000000) FROM DUAL WHERE cancReason2 IS NOT NULL),@BookingId));
						
		INSERT INTO PROGRAMME_SLOT (slot_id, start_time, minutes, vst_code, non_test_activity_code, individual_id, programme_date, tc_id, deployed_to_from_code, tc_closed_ind)
		SELECT @SlotId, DATE_ADD(DATE_ADD(Date, INTERVAL SlotHr HOUR), INTERVAL SlotMinute MINUTE), Minutes, @VSTCode, NTACode, IndividualId, Date, TestCentreId, 0, 0
		FROM DUAL
		WHERE cancReason2 IS NOT NULL;
			
		-- BOOKING (3rd cancellation)
		INSERT INTO BOOKING (booking_id, app_id, booking_cancel_reason_code, state_code, slot_id)
		SELECT @BookingId, @AppId, (SELECT MIN(booking_cancel_reason_code) FROM BOOKING_CANCELLATION_REASON WHERE initiator_code = 'DSA'), 1, NULL
		FROM DUAL
		WHERE cancReason3 = 'DSA';

		INSERT INTO BOOKING (booking_id, app_id, booking_cancel_reason_code, state_code, slot_id)
		SELECT @BookingId, @AppId, (SELECT MIN(booking_cancel_reason_code) FROM BOOKING_CANCELLATION_REASON WHERE initiator_code = 'Act of nature'), 1, NULL
		FROM DUAL
		WHERE cancReason3 = 'Act of nature';
		
		UPDATE PROGRAMME_SLOT
		SET programme_date = DATE_ADD(programme_date, INTERVAL -3 MONTH)
		,start_time = DATE_ADD(start_time, INTERVAL -3 MONTH)
		WHERE slot_id = @SlotId
		AND cancReason3 IS NOT NULL;
			
		SET @SlotId			= (SELECT IFNULL((SELECT IFNULL((SELECT MAX(slot_id) FROM PROGRAMME_SLOT WHERE slot_id >= 90000000)+1,90000000) FROM DUAL WHERE cancReason3 IS NOT NULL),@SlotId));
		SET @BookingId		= (SELECT IFNULL((SELECT IFNULL((SELECT MAX(booking_id) FROM BOOKING WHERE booking_id >= 90000000)+1,90000000) FROM DUAL WHERE cancReason3 IS NOT NULL),@BookingId));		
						
		INSERT INTO PROGRAMME_SLOT (slot_id, start_time, minutes, vst_code, non_test_activity_code, individual_id, programme_date, tc_id, deployed_to_from_code, tc_closed_ind)
		SELECT @SlotId, DATE_ADD(DATE_ADD(Date, INTERVAL SlotHr HOUR), INTERVAL SlotMinute MINUTE), Minutes, @VSTCode, NTACode, IndividualId, Date, TestCentreId, 0, 0
		FROM DUAL
		WHERE cancReason3 IS NOT NULL;
			
		-- BOOKING			
		INSERT INTO BOOKING (booking_id, app_id, booking_cancel_reason_code, state_code, slot_id)
		SELECT @BookingId, @AppId, NULL, 1, @SlotId
		FROM DUAL
		WHERE NTACode IS NULL;
		
		-- APPLICATION
		INSERT INTO APPLICATION (app_id, ext_req_ind, meeting_place_req_text, state_code, welsh_test_ind, order_id, vehicle_id, individual_id, test_service_id, special_needs_text, progressive_access)
		SELECT @AppId, ExtendedTest, NULL, @AppStateCode, WelshTest, 0, @VehicleId, @CandidateId, @TestServiceId, SpecialNeedsText, ProgressiveAccess
		FROM DUAL
		WHERE NTACode IS NULL;

		-- APPLICATION_RSIS_INFO
		INSERT INTO APPLICATION_RSIS_INFO (app_id, booking_seq, check_digit, booking_id)
		SELECT @AppId, BookingSeq, CheckDigit, @BookingId
		FROM DUAL
		WHERE NTACode IS NULL;

	END//

DELIMITER ;