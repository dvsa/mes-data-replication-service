-- MySQL equivalent of Oracle TARS Journal tables
--
-- Oracle to MySQL data type mapping rules as follows:
-- VARCHAR2(n) => VARCHAR(n)
-- DATE => DATETIME
-- NUMBER(1..2) => TINYINT
-- NUMBER(3..4) => SMALLINT
-- NUMBER(5..8) => INT
-- NUMBER(9..18) => BIGINT
-- NUMBER(n, m) if m > 0 => DECIMAL(n,m)
-- check constraints are ignored by MySQL (have to use triggers)
-- foreign keys dropped to allow DMS

CREATE DATABASE tarsreplica;
USE tarsreplica;

--
-- START: examiner tables
--
CREATE TABLE EXAMINER
(	STAFF_NUMBER VARCHAR(10) NOT NULL,
	GRADE_CODE VARCHAR(4),
--	PROB_PER_START_DATE DATETIME,
--	PROB_PER_END_DATE DATETIME,
--	DSA_BIKE_IND TINYINT,
--	DSA_RADIO_IND TINYINT,
--	WELSH_SPKG_CODE TINYINT DEFAULT 1 NOT NULL,
--	DEPLOY_IND INT,
--	NON_DEPLOY_TEXT VARCHAR(255),
--	SKILL_TEXT VARCHAR(400),
--	MAN_PROG_START_DATE DATETIME,
--	MAN_PROG_END_DATE DATETIME,
--	UPDATED_ON DATETIME NOT NULL,
--	CREATED_ON DATETIME NOT NULL,
--	UPDATED_BY BIGINT NOT NULL,
--	CREATED_BY BIGINT NOT NULL,
	INDIVIDUAL_ID BIGINT NOT NULL,
--	MOBILE_IND TINYINT DEFAULT 0 NOT NULL,
--	EMAIL_JOURNALS_IND TINYINT DEFAULT 0 NOT NULL,
--	DVSA_EMAIL VARCHAR(100),
--	STOP_JOURNALS_IND TINYINT,
	CONSTRAINT EXAM_IND_ID_PK PRIMARY KEY (INDIVIDUAL_ID),
	CONSTRAINT EXAM_STAFF_NO_UQ UNIQUE (STAFF_NUMBER)
);

CREATE TABLE INDIVIDUAL
( INDIVIDUAL_ID BIGINT,
  DRIVER_NUMBER VARCHAR(24),
--   DATE_OF_BIRTH DATETIME,
--   TEST_CENTRE_ID INT,
  TITLE_CODE BIGINT,
--   PREVIOUS_TEST_CENTRE_ID INT,
  FAMILY_NAME VARCHAR(50),
  FIRST_FORENAME VARCHAR(50),
  SECOND_FORENAME VARCHAR(50),
  THIRD_FORENAME VARCHAR(50),
--   PERSON_INITIALS VARCHAR(8),
--   PERSON_FULL_NAME VARCHAR(100),
--   PERSON_REQUESTED_NAME VARCHAR(50),
--   VAT_REGISTERED TINYINT,
--   DEFAULT_ADDRESS_CODE BIGINT,
--   GENDER_CODE BIGINT,
--   TOTAL_POINTS DECIMAL(8,2),
--   DATE_OF_FIRST_LICENCE DATETIME,
--   LICENCE_EXPIRY_DATE DATETIME,
--   LAST_UPDATED_BY_DVLA DATETIME,
--   PP_STATUS_CODE BIGINT,
--   PP_DATE_FIRST_ISSUED DATETIME,
--   PP_CERTS_ISSUED INT,
--   PP_PACKS_ORDERED INT,
--   PP_DESPATCH_ADD VARCHAR(20),
--   PP_CONSENT_MARKER INT,
--   PP_STARTER_FEE_PAID DECIMAL(8,2),
--   BAD_DEBT_IND TINYINT,
--   EXTERNAL_MAIL_CONSENT_IND TINYINT,
--   ID_CONFIRMATION_STATUS_CODE BIGINT,
--   IS_ORGAN_DONOR TINYINT,
--   IS_TITLE_ADDRESS TINYINT,
--   DISABLED_MARKER TINYINT,
--   DATE_OF_BIRTH_VERIFIED_CODE VARCHAR(10),
--   DATE_OF_DEATH DATETIME,
--   NOTIFIED_DECEASED_CODE BIGINT,
--   DATE_ENTERED DATETIME,
--   DATE_MOVED DATETIME,
--   COUNTRY_OF_BIRTH VARCHAR(50),
--   COUNTRY_OF_BIRTH_INTERNAL_CODE BIGINT,
--   NATIONALITY_CODE BIGINT,
--   PREFERRED_LANGUAGE_CODE BIGINT,
--   REASON_CODE BIGINT,
--   STATE_CODE BIGINT,
--   COMMUNICATION_PREF_CODE BIGINT,
--   NOTES VARCHAR(255),
--   CREATED_BY BIGINT NOT NULL,
--   CREATED_ON DATETIME NOT NULL,
--   UPDATED_BY BIGINT NOT NULL,
--   UPDATED_ON DATETIME NOT NULL,
--   INCREASE_FEE_IND TINYINT,
--   BOOKING_REVIEW_IND TINYINT,
--   INTEGRITY_IND TINYINT,
--   NO_MAILINGS TINYINT,
--   WEB_IND_CODE BIGINT,
--   ETHNIC_ORIGIN_CODE BIGINT,
--   EU_LICENCE_IND TINYINT,
--   DVLA_PHOTO_AUTH TINYINT,
--   SC_PUBLISH_IND TINYINT,
  CONSTRAINT INDV_INDVID_PK PRIMARY KEY (INDIVIDUAL_ID)
);

CREATE TABLE REF_DATA_ITEM_MASTER
(  ITEM_ID BIGINT,
   ITEM_DESC1 VARCHAR(255),
   ITEM_DESC2 VARCHAR(255),
--    EXT_DESC VARCHAR(255),
   CATEGORY_ID BIGINT,
--    VALID_FROM_DATE DATETIME,
--    VALID_TO_DATE DATETIME,
--    PARENT_ITEM_ID BIGINT,
--    SORTING_ORDER DECIMAL(38) DEFAULT 0,
--    ACTIVE_FLG VARCHAR(1),
--    CREATED_BY BIGINT NOT NULL,
--    CREATED_ON DATETIME NOT NULL,
--    UPDATED_BY BIGINT NOT NULL,
--    UPDATED_ON DATETIME NOT NULL,
--    DSA_UPDATABLE VARCHAR(2),
  CONSTRAINT PK_REF_DATA_ITEM_MASTER PRIMARY KEY (CATEGORY_ID, ITEM_ID)
);

CREATE TABLE TEST_CENTRE
(  TC_ID BIGINT NOT NULL,
   TC_COST_CENTRE_CODE VARCHAR(6) NOT NULL,
--    OPENING_TIME DATETIME,
--    CLOSING_TIME DATETIME,
--    COMMISSION_DATE DATETIME NOT NULL,
--    DECOMMISSION_DATE DATETIME,
--    TC_TYPE_CODE TINYINT NOT NULL,
--    MAIN_TEST_CENTRE_ID BIGINT,
--    EXAMINER_CAPACITY_COUNT SMALLINT,
--    TEST_ROUTE_CAPACITY_COUNT SMALLINT,
--    WAITING_ROOM_CAPACITY_COUNT SMALLINT,
--    FWD_PROGRAM_CREATE_WEEKS SMALLINT,
--    DIRECTION_TEXT VARCHAR(255),
--    BAD_WEATHER_INSTR_TEXT VARCHAR(255),
--    MALE_WC_COUNT SMALLINT,
--    FEMALE_WC_COUNT SMALLINT,
--    MALE_STAFF_WC_COUNT SMALLINT,
--    FEMALE_STAFF_WC_COUNT SMALLINT,
--    PARKING_CAPACITY_COUNT SMALLINT,
--    RESERVE_PROGRAM_COUNT SMALLINT,
--    OPEN_RESERVE_PROGRAM_DAYS SMALLINT,
--    TC_PROG_PERIOD_END_DATE DATETIME,
--    PLANNED_MGMT_SLOT_COUNT SMALLINT,
--    SPECIAL_MESSAGE_TEXT VARCHAR(255),
--    MAX_REMOTE_WAIT_WEEKS SMALLINT,
--    MIN_REMOTE_TEST_COUNT SMALLINT,
--    REMOTE_TC_LAST_OPEN_DATE DATETIME,
--    DEPLOY_CREATED_TO_DATE DATETIME,
   COUNTRY_ID BIGINT NOT NULL,
--    SECTOR_ID BIGINT NOT NULL,
--    INDIVIDUAL_ID BIGINT,
--    TEST_CATEGORY_REF VARCHAR(10),
--    AUTOFILL_IND TINYINT DEFAULT 0 NOT NULL,
--    TB_DAY_OF_WEEK TINYINT DEFAULT 1 NOT NULL,
--    SPECIAL_NEEDS_INFORMATION VARCHAR(255),
--    LA_ID BIGINT,
--    PWL_IND TINYINT DEFAULT 0 NOT NULL,
--    UPDATED_ON DATETIME NOT NULL,
--    CREATED_ON DATETIME NOT NULL,
--    CREATED_BY BIGINT NOT NULL,
--    UPDATED_BY BIGINT NOT NULL,
--    UPDATE_FLAG TINYINT,
--    SECURITY_COMPANY_ID BIGINT,
--    BRANCH_PRINTER_ID BIGINT DEFAULT 0,
--    TC_RESOURCE_PERIOD_END_DATE DATETIME,
--    LAST_NOTIF_PRODUCED_DATE DATETIME,
--    LAST_SCHEDULE_PRODUCED_DATE DATETIME,
--    DISABLED_WC_COUNT SMALLINT,
--    LATITUDE DECIMAL(10,8),
--    LONGITUDE DECIMAL(11,8),
   CONSTRAINT TC_COST_CENTRE_CODE_UQ UNIQUE (TC_COST_CENTRE_CODE),
   CONSTRAINT TC_TC_ID_PK PRIMARY KEY (TC_ID)
);

CREATE TABLE TEST_CENTRE_NAME
( TC_ID BIGINT NOT NULL,
  TC_NAME VARCHAR(50) NOT NULL,
--   DISPLAY_ORDER TINYINT NOT NULL,
--   UPDATED_ON DATETIME NOT NULL,
--   CREATED_ON DATETIME NOT NULL,
--   CREATED_BY BIGINT NOT NULL,
--   UPDATED_BY BIGINT NOT NULL,
  CONSTRAINT TCN_TC_NAME_UQ UNIQUE (TC_NAME),
--   CONSTRAINT TCN_TC_ID_PK PRIMARY KEY (TC_ID, DISPLAY_ORDER)
  CONSTRAINT TCN_TC_ID_PK PRIMARY KEY (TC_ID)
);

CREATE TABLE EXAMINER_STATUS
( INDIVIDUAL_ID BIGINT,
  START_DATE DATETIME NOT NULL,
  END_DATE DATETIME,
--   EXAMINER_STATUS_TYPE_CODE VARCHAR(1) NOT NULL,
--   CONTRACT_TYPE_CODE VARCHAR(2),
--   AREA_ID BIGINT,
--   CREATED_BY BIGINT NOT NULL,
--   CREATED_ON DATETIME NOT NULL,
--   UPDATED_BY BIGINT NOT NULL,
--   UPDATED_ON DATETIME NOT NULL,
  CONSTRAINT ES_II_SD_PK PRIMARY KEY (INDIVIDUAL_ID, START_DATE)
);

CREATE TABLE AREA (
  AREA_ID DECIMAL(12,0) NOT NULL,
  DAYS_IN_ADVANCE_COUNT INT(11) NOT NULL,
  COUNTRY_ID INT(11) DEFAULT NULL,
  PRIMARY KEY (AREA_ID)
);

CREATE TABLE NON_WORKING_DAY (
  COUNTRY_ID INT(11) NOT NULL,
  NON_WORKING_DATE DATETIME NOT NULL,
  STATUTORY_IND TINYINT(4) NOT NULL,
  PRIMARY KEY (COUNTRY_ID,NON_WORKING_DATE)
);

--
-- START: slot tables
--

CREATE TABLE PROGRAMME
( INDIVIDUAL_ID BIGINT NOT NULL,
  PROGRAMME_DATE DATETIME NOT NULL,
  TC_ID BIGINT NOT NULL,
--   CHANGE_IND TINYINT NOT NULL,
  STATE_CODE INT NOT NULL,
--   MODIFICATION_SEQ_NUMBER BIGINT,
  CONSTRAINT PRO_II_PD_TI_PK PRIMARY KEY (INDIVIDUAL_ID, PROGRAMME_DATE, TC_ID)
);

CREATE TABLE PROGRAMME_SLOT
( SLOT_ID BIGINT NOT NULL,
  START_TIME DATETIME NOT NULL,
  MINUTES SMALLINT NOT NULL,
--   STATE_CODE INT NOT NULL,
--   GHOST_IND TINYINT NOT NULL,
--   SLOT_TYPE_CODE TINYINT NOT NULL,
  VST_CODE BIGINT,
  NON_TEST_ACTIVITY_CODE VARCHAR(4),
  INDIVIDUAL_ID BIGINT NOT NULL,
  PROGRAMME_DATE DATETIME NOT NULL,
  TC_ID BIGINT NOT NULL,
  DEPLOYED_TO_FROM_CODE TINYINT,
--   DEPLOYED_TO_FROM_TC_COST_CODE VARCHAR(6),
--   CLOSURE_CODE INT,
--   REPEATED_CLOSURE_CODE INT,
--   SUSPENDED_IND TINYINT NOT NULL,
--   DEPLOYMENT_ID BIGINT,
  TC_CLOSED_IND TINYINT NOT NULL,
--   INSTRUCTOR_ID BIGINT,
--   RESERVED_USER_NAME VARCHAR(50),
--   RESERVED_DATE_TIME DATETIME,
--   CANCELLED_DEPLOYMENT_IND TINYINT,
--   MODIFICATION_SEQ_NUMBER BIGINT DEFAULT 1 NOT NULL,
  CONSTRAINT PS_SLOT_ID_PK PRIMARY KEY (SLOT_ID)
);

CREATE TABLE BOOKING
(	BOOKING_ID BIGINT NOT NULL,
	APP_ID BIGINT NOT NULL,
	-- ACTUAL_TEST_FEE_AMOUNT DECIMAL(5,2) NOT NULL,
	-- BOOKED_DATE DATETIME,
	BOOKING_CANCEL_REASON_CODE INT,
	-- CANCELLED_DATE_TIME DATETIME,
	-- CANCELLED_TC_ID BIGINT,
	-- LOST_FEE_IND TINYINT,
	-- NO_CANCEL_ACCEPT_IND TINYINT NOT NULL,
	-- NON_COMPLETION_CODE INT,
	-- RETEST_REFUND_IND TINYINT NOT NULL,
	STATE_CODE INT NOT NULL,
	-- TEST_SERVICE_ITEM_ID BIGINT NOT NULL,
	-- INCOME_ACCRUED_IND TINYINT,
	SLOT_ID BIGINT,
	-- FULL_TEST_FEE_AMOUNT DECIMAL(10,2),
	-- EXPECTED_TEST_FEE_AMOUNT DECIMAL(10,2),
	-- ACCRUED_FIN_TRAN_ID BIGINT,
	-- CREATED_BY BIGINT NOT NULL,
	-- CREATED_ON DATETIME NOT NULL,
	-- UPDATED_BY BIGINT NOT NULL,
	-- UPDATED_ON DATETIME NOT NULL,
	-- RESOURCE_SLOT_ID BIGINT,
	CONSTRAINT BO_AI_BSN_PK PRIMARY KEY (BOOKING_ID),
	CONSTRAINT BKG_SLOT_ID_UNIQUE UNIQUE (SLOT_ID)
);

--
-- personalCommitmentDataSet tables
--

CREATE TABLE PERSONAL_COMMITMENT
(	COMMITMENT_ID BIGINT NOT NULL, 
	-- COMMITMENT_TEXT VARCHAR(255), 
	END_DATE_TIME DATETIME NOT NULL, 
	INDIVIDUAL_ID BIGINT NOT NULL, 
	NON_TEST_ACTIVITY_CODE VARCHAR(4) NOT NULL, 
	START_DATE_TIME DATETIME NOT NULL, 
	-- STATE_CODE INT NOT NULL, 
	-- CREATED_BY BIGINT NOT NULL, 
	-- CREATED_ON DATETIME NOT NULL, 
	-- UPDATED_BY BIGINT NOT NULL, 
	-- UPDATED_ON DATETIME NOT NULL, 
	CONSTRAINT PC_COMMITMENT_ID_PK PRIMARY KEY (COMMITMENT_ID)
);

CREATE TABLE NON_TEST_ACTIVITY_REASON
(	NON_TEST_ACTIVITY_CODE VARCHAR(4) NOT NULL, 
	-- DEPLOYMENT_PRIORITY_NUMBER BIGINT NOT NULL, 
	-- PAYABLE_IND TINYINT NOT NULL, 
	REASON_DESC VARCHAR(50) NOT NULL, 
	-- WORK_PATTERN_IND TINYINT NOT NULL, 
	-- CREATED_BY BIGINT NOT NULL, 
	-- CREATED_ON DATETIME NOT NULL, 
	-- UPDATED_BY BIGINT NOT NULL, 
	-- UPDATED_ON DATETIME NOT NULL, 
	-- START_DATE DATETIME, 
	-- END_DATE DATETIME, 
	-- QUALIFICATION_IND TINYINT, 
	-- SKILL_THRESHOLD_DAYS INT, 
	CONSTRAINT NTAR_NTAC_PK PRIMARY KEY (NON_TEST_ACTIVITY_CODE)
);


--
-- advanceTestSlotDataSet tables
--
CREATE TABLE VEHICLE_SLOT_TYPE
(	VST_CODE BIGINT NOT NULL, 
	-- VEHICLE_TYPE_CODE VARCHAR(2) NOT NULL, 
	-- MINUTES SMALLINT NOT NULL, 
	-- VST_DESC VARCHAR(50) NOT NULL, 
	-- CREATED_ON DATETIME NOT NULL, 
	-- CREATED_BY BIGINT NOT NULL, 
	-- UPDATED_ON DATETIME NOT NULL, 
	-- UPDATED_BY BIGINT NOT NULL, 
	SHORT_VST_DESC VARCHAR(11), 
	CONSTRAINT VST_VC_VTC_PK PRIMARY KEY (VST_CODE)
);


--
-- deploymentDataSet tables
--
CREATE TABLE DEPLOYMENT
(	DEPLOYMENT_ID BIGINT NOT NULL, 
	START_DATE DATETIME NOT NULL, 
	END_DATE DATETIME NOT NULL, 
	-- STATE_CODE INT NOT NULL, 
	-- REQUEST_DATE DATETIME NOT NULL, 
	-- DEPLOYMENT_TYPE_CODE TINYINT NOT NULL, 
	-- ALLOWED_TRAVEL_MINUTES SMALLINT, 
	-- AREA_ID BIGINT NOT NULL, 
	-- AREA_DEPLOYMENT_NUMBER VARCHAR(16), 
	-- CANCELLED_DATE DATETIME, 
	-- FINANCIAL_YEAR SMALLINT, 
	-- VERSION_NUMBER TINYINT NOT NULL, 
	-- WELSH_IND TINYINT NOT NULL, 
	-- COMMENTS_TEXT VARCHAR(255), 
	TC_ID BIGINT NOT NULL, 
	INDIVIDUAL_ID BIGINT, 
	-- AREA_DECISION_DATE DATETIME NOT NULL, 
	-- CREATED_BY BIGINT NOT NULL, 
	-- CREATED_ON DATETIME NOT NULL, 
	-- UPDATED_BY BIGINT NOT NULL, 
	-- UPDATED_ON DATETIME NOT NULL, 
	-- DEPLOYMENT_REASON_ID BIGINT, 
	-- NUM_CANCELLATIONS_SAVED SMALLINT, 
	CONSTRAINT DE_DEPLOYMENT_ID_PK PRIMARY KEY (DEPLOYMENT_ID)
);


--
-- START: slot detail tables
--

CREATE TABLE APPLICATION
(	APP_ID BIGINT NOT NULL,
	EXT_REQ_IND BIT NOT NULL,
--  FREE_RETEST_IND BIT NOT NULL,
--  FREE_TEST_IND BIT NOT NULL,
--  MEDICAL_IND BIT NULL,
--  MEETING_PLACE_REQ_IND BIT NOT NULL,
	MEETING_PLACE_REQ_TEXT VARCHAR(512) NULL,
--  PREF_EARLIEST_DATE DATETIME NULL,
--  PREF_INS_OVERRIDE_IND BIT NOT NULL,
-- 	PREF_NOT_AFTER_TIME DATETIME NULL,
-- 	PREF_NOT_BEFORE_TIME DATETIME NULL,
-- 	PUT_ON_HOLD_DATE DATETIME NULL,
-- 	SPECIAL_NEEDS_CODE VARCHAR(20) NOT NULL,
	STATE_CODE INT NOT NULL,
	WELSH_TEST_IND BIT NOT NULL,
-- 	APP_DATE DATETIME NOT NULL,
-- 	NOTIFY_WHO_CODE VARCHAR(15) NOT NULL,
-- 	RECEIPT_DATE DATETIME NOT NULL,
-- 	NOTIFY_HOW_CODE VARCHAR(10) NOT NULL,
-- 	TRAINER_PROFILE_OVERRIDE_IND BIT NOT NULL,
	ORDER_ID BIGINT NOT NULL,
-- 	APP_CANCELLATION_REASON_CODE INT NULL,
-- 	HOLD_STATE_CODE INT NULL,
-- 	PREF1_TEST_CENTRE_ID BIGINT NULL,
-- 	PREF2_TEST_CENTRE_ID BIGINT NULL,
	VEHICLE_ID BIGINT NULL,
-- 	INSTRUCTOR_ID BIGINT NULL,
	INDIVIDUAL_ID BIGINT NULL,
	TEST_SERVICE_ID BIGINT NULL,
	SPECIAL_NEEDS_TEXT VARCHAR(512) NULL,
-- 	PREF_LATEST_DATE DATETIME NULL,
-- 	PREF_WEEKDAY_IND BIT NOT NULL,
-- 	PREF_EVENING_IND BIT NOT NULL,
-- 	PREF_SAT_IND BIT NOT NULL,
-- 	PREF_SUN_IND BIT NOT NULL,
-- 	DTCS_USER_ID BIGINT NULL,
-- 	HOLD_TEST_SERVICE_ITEM_ID BIGINT NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	CREATED_ON DATETIME NOT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATETIME NOT NULL,
-- 	PREFERRED_DATE DATETIME NULL,
-- 	CANCELLED_BOOKING_SEQ TINYINT NULL,
-- 	RESEND_NOTIF_IND BIT NULL,
	PROGRESSIVE_ACCESS BIT NOT NULL,
	CONSTRAINT APP_APP_ID_PK PRIMARY KEY (APP_ID)
);

CREATE TABLE APPLICATION_HISTORY
(-- APP_HISTORY_ID BIGINT NOT NULL,
	APP_ID BIGINT NOT NULL,
-- 	ACTIONEE_NAME VARCHAR(50) NULL,
	EVENT_CODE BIGINT NOT NULL,
	EVENT_DATE_TIME DATETIME NOT NULL,
-- 	INDIVIDUAL_ID BIGINT NULL,
-- 	INDIVIDUAL_SURNAME VARCHAR(50) NULL,
-- 	REASON_DESC VARCHAR(255) NULL,
-- 	TEST_CATEGORY_REF VARCHAR(10) NULL,
-- 	TC_NAME VARCHAR(50) NULL,
-- 	TEST_DATE DATETIME NULL,
-- 	OTHER_APP_ID BIGINT NULL,
-- 	DRIVER_NUMBER VARCHAR(16) NULL,
-- 	HOLD_STATE_DESC VARCHAR(60) NULL,
-- 	VEHICLE_REGISTRATION_NUMBER VARCHAR(20) NULL,
-- 	BKG_SUP_USER_NAME VARCHAR(50) NULL,
-- 	BOOKING_ID BIGINT NULL,
-- 	NON_COMPLETION_DESC VARCHAR(50) NULL,
-- 	THEORY_NUMBER VARCHAR(9) NULL,
-- 	CHANGE_REASON VARCHAR(50) NULL,
-- 	RELATIONSHIP VARCHAR(100) NULL,
-- 	CREATED_BY BIGINT NULL,
-- 	CREATED_ON DATETIME NULL,
-- 	UPDATED_BY BIGINT NULL,
-- 	UPDATED_ON DATETIME NULL,
-- 	FINANCE_ENTITY_REF VARCHAR(255) NULL,
	CONSTRAINT AH_APPID_EDT_PK PRIMARY KEY (APP_ID, EVENT_DATE_TIME)
);

CREATE TABLE APPLICATION_RSIS_INFO
(	APP_ID BIGINT NOT NULL,
	BOOKING_SEQ TINYINT NOT NULL,
	CHECK_DIGIT TINYINT NOT NULL,
	BOOKING_ID BIGINT NOT NULL,
-- 	SENT_FOR_SCANNING BIT NULL,
	CONSTRAINT ARI_BK_ID_PK PRIMARY KEY (APP_ID, BOOKING_SEQ)
);

CREATE TABLE VEHICLE 
(	VEHICLE_ID BIGINT NOT NULL,
	CAB_SEAT_COUNT SMALLINT NULL,
-- 	ENGINE_CAPACITY_CC INT NULL,
-- 	ENGINE_POWER_KW INT NULL,
	GEARBOX_CODE TINYINT NULL,
	HEIGHT_M DECIMAL(5,2) NULL,
	LENGTH_M DECIMAL(5,2) NULL,
	WIDTH_M DECIMAL(5,2) NULL,
	PASSENGER_SEAT_COUNT TINYINT NULL,
-- 	VEHICLE_REGISTRATION_NUMBER VARCHAR(10) NULL,
-- 	TRAILER_LENGTH_M DECIMAL(5,2) NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	CREATED_ON DATETIME NOT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATETIME NOT NULL,
	CONSTRAINT VEH_VEH_ID_PK PRIMARY KEY (VEHICLE_ID)
);

CREATE TABLE TEST_SERVICE 
(	TEST_SERVICE_ID BIGINT NOT NULL,
-- 	TEST_SERVICE_DESCRIPTION VARCHAR(50) NOT NULL,
 	EXTENDED_IND BIT NOT NULL,
 	SPECIAL_NEEDS_CODE VARCHAR(20) NOT NULL,
-- 	MEETING_PLACE_IND BIT NOT NULL,
-- 	START_DATE DATETIME NOT NULL,
-- 	END_DATE DATETIME NULL,
	TEST_CATEGORY_REF VARCHAR(10) NOT NULL,
 	VST_CODE BIGINT NOT NULL,
-- 	CREATED_ON DATETIME NOT NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATETIME NOT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	PRICE_OPTION TINYINT NOT NULL,
	CONSTRAINT TS_TS_ID_PK PRIMARY KEY (TEST_SERVICE_ID)
);

CREATE TABLE CUSTOMER_ORDER 
(	ORDER_ID BIGINT NOT NULL,
-- 	STATE_CODE INT NOT NULL,
	BUSINESS_ID BIGINT NULL,
-- 	RECEIVED_HOW_CODE VARCHAR(1) NOT NULL,
-- 	PLANNED_APP_COUNT SMALLINT NOT NULL,
-- 	ACTUAL_APP_COUNT SMALLINT NOT NULL,
-- 	PAYMENT_RECEIPT_REQD_IND BIT NOT NULL,
	BOOKER_TYPE_CODE VARCHAR(1) NOT NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	CREATED_ON DATETIME NOT NULL,
-- 	INDIVIDUAL_ID BIGINT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATETIME NOT NULL,
-- 	CHARGEABLE_ACTIVITY_ID BIGINT NULL,
-- 	DELEGATED_AUTHORITY_ID BIGINT NULL,
	CONSTRAINT CO_ORDER_ID_PK PRIMARY KEY (ORDER_ID)
);

CREATE TABLE CONTACT_DETAILS 
(	CONTACT_DETAILS_ID BIGINT NOT NULL,
-- 	ORGANISATION_ID BIGINT NULL,
	ORGANISATION_REGISTER_ID DECIMAL(20,2) NULL,
-- 	REGISTER_ID BIGINT NULL,
	INDIVIDUAL_ID BIGINT NULL,
-- 	PP_PUPILS_ID BIGINT NULL,
-- 	TEST_CENTRE_ID BIGINT NULL,
-- 	PREMISES_ID BIGINT NULL,
-- 	CONTACT_TYPE_CODE BIGINT NULL,
-- 	CONTACT_NAME VARCHAR(50) NULL,
	PRIMARY_TEL_NUMBER VARCHAR(20) NULL,
	SECONDARY_TEL_NUMBER VARCHAR(20) NULL,
	EMAIL_ADDRESS VARCHAR(100) NULL,
-- 	FAX_NUMBER VARCHAR(30) NULL,
	MOBILE_TEL_NUMBER VARCHAR(30) NULL,
-- 	VALID_FROM DATETIME NULL,
-- 	VALID_TO DATETIME NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	CREATED_ON DATETIME NOT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATETIME NOT NULL,
-- 	PREF_CONTACT_MODE VARCHAR(50) NULL,
-- 	AREA_ID BIGINT NULL,
	PRIM_TEL_VOICEMAIL_IND BIT NULL,
	SEC_TEL_VOICEMAIL_IND BIT NULL,
	MOBILE_VOICEMAIL_IND BIT NULL,
-- 	EMERGENCY_CONTACT_NUMBER VARCHAR(30) NULL,
-- 	SC_ID BIGINT NULL,
	CONSTRAINT CD_CONTACT_DETAILS_ID_PK PRIMARY KEY (CONTACT_DETAILS_ID)
);

CREATE TABLE ADDRESS
(	ADDRESS_ID BIGINT NOT NULL,
	ADDRESS_LINE_1 VARCHAR(255) NOT NULL,
	ADDRESS_LINE_2 VARCHAR(100) NULL,
	ADDRESS_LINE_3 VARCHAR(100) NULL,
	ADDRESS_LINE_4 VARCHAR(100) NULL,
	ADDRESS_LINE_5 VARCHAR(255) NULL,
	POST_CODE VARCHAR(255) NULL,
 	ADDRESS_TYPE_CODE BIGINT NULL,
-- 	AREA_ID BIGINT NULL,
	ORGANISATION_ID BIGINT NULL,
	INDIVIDUAL_ID BIGINT NULL,
-- 	PREMISES_ID BIGINT NULL,
-- 	PP_PUPILS_ID BIGINT NULL,
-- 	TEST_CENTRE_ID BIGINT NULL,
-- 	VALID_FROM DATETIME NULL,
-- 	VALID_TO DATETIME NULL,
-- 	CARE_OF VARCHAR(100) NULL,
-- 	IS_HISTORIC BIT NULL,
-- 	IS_VANITY_ADDRESS BIT NULL,
-- 	IS_WELSH_ADDRESS BIT NULL,
-- 	COUNTRY_CODE BIGINT NULL,
-- 	IS_INSECURE_ADDRESS BIT NULL,
-- 	BARRACKS VARCHAR(100) NULL,
-- 	BFPO_NUMBER BIGINT NULL,
-- 	RANK VARCHAR(100) NULL,
-- 	REGIMENT VARCHAR(100) NULL,
-- 	SERVICE_NUMBER VARCHAR(100) NULL,
-- 	UNIT VARCHAR(100) NULL,
-- 	UNKNOWN_ADDRESS BIT NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	CREATED_ON DATE NOT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATE NOT NULL,
-- 	PAYMENT_CARD_ID BIGINT NULL,
-- 	SC_ID BIGINT NULL,
	CONSTRAINT ADDR_ADDRESS_ID_PK PRIMARY KEY (ADDRESS_ID)
);

CREATE TABLE REGISTER 
(-- REGISTER_ID BIGINT NOT NULL NULL,
	INDIVIDUAL_ID BIGINT NULL NULL,
-- 	ORGANISATION_ID BIGINT NULL,
-- 	REGISTER_CODE BIGINT NULL,
	PRN BIGINT
-- 	APPLICATION_DATE DATETIME NULL,
-- 	COMMENCEMENT_DATE DATETIME NULL,
-- 	CURRENT_CERTIFICATE BIT NULL,
-- 	CERTIFICATE_PREFIX VARCHAR(1) NULL,
-- 	CERTIFICATE_SUFFIX VARCHAR(1) NULL,
-- 	CERTIFICATE_NUMBER BIGINT NULL,
-- 	DATE_OF_ISSUE DATETIME NULL,
-- 	DATE_OF_EXPIRY DATETIME NULL,
-- 	REFUSAL_REASON_CODE INT NULL,
-- 	REASON_FOR_REFUSAL VARCHAR(50) NULL,
-- 	DATE_OF_REFUSAL DATETIME NULL,
-- 	DATE_OF_REMOVAL DATETIME NULL,
-- 	REVOKED_REASON_CODE BIGINT NULL,
-- 	DATE_REVOKED DATETIME NULL,
-- 	DATE_OF_REJECTION DATETIME NULL,
-- 	RENEWAL_DETAILS VARCHAR(20) NULL,
-- 	DATE_CERTIFICATE_RETURNED DATETIME NULL,
-- 	LAST_CHECK_TEST_DATE DATETIME NULL,
-- 	STATUS_CODE INT NULL,
-- 	PREVIOUS_STATUS_CODE BIGINT NULL,
-- 	CONSENT_STATUS_CODE INT NULL,
-- 	CBT_CAT_A_LICENCE_FULL INT NULL,
-- 	CBT_PARTNER BIT NULL,
-- 	CBT_CARDINGTON_TRAINED DATETIME NULL,
-- 	CBT_MAIN_TRAINING_SITE_ID INT NULL,
-- 	CBT_DOWN_TRAINED DATETIME NULL,
-- 	CBT_SUPERVISE_LARGE_MC BIT NULL,
-- 	CBT_LAST_INVOLVED_TRAINING DATETIME NULL,
-- 	ATB_AUTHORISED_BY VARCHAR(50) NULL,
-- 	DATE_AUTHORISED DATETIME NULL,
-- 	INTERNET_APPLICATION BIT NULL,
-- 	VEHICLE_TYPE_CODE VARCHAR(12) NULL,
-- 	SE_ID INT NULL,
-- 	PREVIOUS_SE_ID INT NULL,
-- 	DATE_MOVED DATETIME NULL,
-- 	MOVED_REASON_CODE BIGINT NULL,
-- 	STARTER_PACK_ISSUED BIGINT NULL,
-- 	STARTER_PACK_NUMBER BIGINT NULL,
-- 	NUMBER_ATTEMPTS_PART2_TEST INT NULL,
-- 	NUMBER_ATTEMPTS_PART3_TEST INT NULL,
-- 	NUMBER_ATTEMPTS_THEORY INT NULL,
-- 	NUMBER_TRAINEE_LICENCES INT NULL,
-- 	NUMBER_PP_PACKS_ISSUED INT NULL,
-- 	PASS_PLUS_IND BIT NULL,
-- 	PAYMENT_VALUE DECIMAL(8,2) NULL,
-- 	PDI_TRAINEE_IND BIGINT NULL,
-- 	SECURITY_CODE BIGINT NULL,
-- 	AREA_ID BIGINT NULL,
-- 	SECTOR_ID BIGINT NULL,
-- 	CENTRE_OF_ACCREDITATION BIT NULL,
-- 	PREVIOUS_LICENCE_NO BIGINT NULL,
-- 	PREVIOUS_LICENCE_ISSUE_DATE DATETIME NULL,
-- 	PREVIOUS_LICENCE_EXPIRY_DATE DATETIME NULL,
-- 	APPEAL_STATUS_CODE BIGINT NULL,
-- 	APPEAL_ACTION_CODE BIGINT NULL,
-- 	REJECTED_BY VARCHAR(50) NULL,
-- 	THEORY_TEST_EXTRACT_FILE VARCHAR(100) NULL,
-- 	THEORY_TEST_EXTRACT_DATE DATETIME NULL,
-- 	DVLA_EXTRACT_DATE DATETIME NULL,
-- 	ADD_REMOVE BIT NULL,
-- 	ISVALID BIT NULL,
-- 	CREATED_ON DATETIME NOT NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATETIME NOT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	TESTCENTRE_ID INT NULL,
-- 	APPLICATION_STATUS_CODE BIGINT NULL,
-- 	LICENCE_TYPE VARCHAR(10) NULL,
-- 	DATE_21AT_21S_RECVD DATETIME NULL,
-- 	ELIGIBILITY_RESEND_IND BIT NULL,
-- 	ADIHPT_SEND_IND BIT NULL,
-- 	ADIHPT_EXTRACT_FILE VARCHAR(100) NULL,
-- 	ADIHPT_EXTRACT_DATE DATETIME NULL,
-- 	PREMISES_ID INT NULL,
-- 	DOWN_TRAINER_ID BIGINT NULL,
-- 	DOWN_TRAINER_CERT VARCHAR(58) NULL,
-- 	USE_BUSINESS_ADDRESS_IND BIT NULL,
-- 	TEST_GAP_MINUTES SMALLINT NULL,
-- 	CPD_IND BIT NULL,
-- 	COMMENTS VARCHAR(1024) NULL,
-- 	REJECTION_REASON_CODE BIGINT NULL,
-- 	EU_LICENCE_TRANSFER_IND BIT NULL,
-- 	COP_IND BIT NULL,
-- 	INSTRUCTOR_WEBSITE_URL VARCHAR(1024) NULL,
-- 	DATE_LAST_APPROVED DATETIME NULL,
-- 	LAST_SC_RESULT_DESC VARCHAR(100) NULL,
-- 	SC_INVITATION_DATE DATETIME
);

CREATE TABLE ORGANISATION_REGISTER 
(	ORGANISATION_REGISTER_ID BIGINT NOT NULL,
	ORGANISATION_ID BIGINT NULL,
-- 	REGISTER_CODE BIGINT NULL,
	BUSINESS_ID BIGINT NULL,
-- 	BRN BIGINT NULL,
-- 	TRAINING_OFFERED_CODE BIGINT NULL,
-- 	TYPES_OF_COURSE_CODE BIGINT NULL,
-- 	APPLICATION_DATE DATETIME NULL,
-- 	PREFERRED_TEST_CENTRE_ID BIGINT NULL,
-- 	CONSENT_STATUS_CODE INT NULL,
-- 	STATUS_CODE BIGINT NULL,
-- 	COMMENTS VARCHAR(50) NULL,
-- 	CREATED_ON DATETIME NOT NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATETIME NOT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	CURRENT_CERTIFICATE BIT NULL,
-- 	CERTIFICATE_PREFIX VARCHAR(1) NULL,
-- 	CERTIFICATE_SUFFIX VARCHAR(1) NULL,
-- 	CERTIFICATE_NUMBER INT NULL,
-- 	DATE_AUTHORISED DATETIME NULL,
-- 	DATE_OF_ISSUE DATETIME NULL,
-- 	DATE_OF_EXPIRY DATETIME NULL,
-- 	TEST_NOTIFICATION VARCHAR(30) NULL,
-- 	BAD_DEBT_CODE VARCHAR(30) NULL,
-- 	CARD_NUMBER_ENCR VARCHAR(255) NULL,
	CONSTRAINT ORGREG_ORGREGID_PK PRIMARY KEY (ORGANISATION_REGISTER_ID)
);

CREATE TABLE ORGANISATION 
(	ORGANISATION_ID BIGINT NOT NULL,
	ORGANISATION_NAME VARCHAR(100) NULL,
-- 	NAMED_PRINCIPAL VARCHAR(100) NULL,
-- 	VAT_REGISTERED BIT NULL,
-- 	COMMUNICATION_PREFERENCE_CODE BIGINT NULL,
-- 	PREFERRED_TEST_CENTRE_ID BIGINT NULL,
-- 	AREA_ID BIGINT NULL,
-- 	SECTOR_ID BIGINT NULL,
-- 	STATUS_CODE BIGINT NULL,
-- 	UNUSED_DL196_CERTS BIT NULL,
-- 	REFUND_REQUIRED BIT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATETIME NOT NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	CREATED_ON DATETIME NOT NULL,
-- 	SOUNDEX_CODE VARCHAR(4) NULL,
-- 	WEB_BUS_CODE BIGINT NULL,
-- 	ABBR_ORGANISATION_NAME VARCHAR(100) NULL,
	CONSTRAINT ORG_ORGID_PK PRIMARY KEY (ORGANISATION_ID)
);

CREATE TABLE BOOKING_CANCELLATION_REASON 
(	BOOKING_CANCEL_REASON_CODE BIGINT NOT NULL,
-- 	BOOKING_CANCEL_REASON_DESC VARCHAR(50) NOT NULL,
	INITIATOR_CODE VARCHAR(15) NOT NULL,
-- 	START_DATE DATETIME NOT NULL,
-- 	END_DATE DATETIME NULL,
-- 	AUTO_NTA_CODE VARCHAR(4) NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	CREATED_ON DATETIME NOT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATETIME NOT NULL,
-- 	EXPENSES_PAYABLE TINYINT NULL,
	CONSTRAINT BCR_BCR_CODE_PK PRIMARY KEY (BOOKING_CANCEL_REASON_CODE)
);

CREATE TABLE TEST_HISTORY 
(-- HISTORY_ID BIGINT NOT NULL,
	INDIVIDUAL_ID BIGINT NULL,
-- 	ORGANISATION_ID BIGINT NULL,
-- 	REGISTER_ID BIGINT NULL,
-- 	APPLICATION_ID BIGINT NULL,
	EXAM_TYPE_CODE BIGINT NULL,
	DATE_OF_TEST DATETIME NULL,
	RESULT_CODE BIGINT NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	CREATED_ON DATETIME NOT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATETIME NOT NULL,
-- 	MARK BIGINT NULL,
-- 	CERTIFICATE_NUMBER BIGINT NULL,
-- 	HPT_CERT_NUMBER BIGINT NULL,
-- 	SOURCE_FILE VARCHAR(100) NULL,
-- 	ACTIVE_FLAG BIT NULL,
-- 	CHANGE_IND BIT NULL,
	THEORY_PASS_STATE_CODE TINYINT NULL,
	THEORY_TYPE_CODE INT NULL
-- 	THEORY_PASS_DATE_NEGATED DATETIME NULL,
-- 	GRADE_ID SMALLINT NULL,
-- 	BOOKING_ID BIGINT NULL
);

CREATE TABLE TEST_CATEGORY 
(	TEST_CATEGORY_REF VARCHAR(10) NOT NULL,
-- 	TEST_CATEGORY_DESCRIPTION VARCHAR(60) NOT NULL,
-- 	MAX_ENGINE_KW BIGINT NULL,
-- 	MAX_PASSENGER_COUNT TINYINT NULL,
-- 	MIN_AGE_YEARS TINYINT NULL,
-- 	MIN_CANDIDATE_NOTICE_DAYS SMALLINT NOT NULL,
-- 	MIN_COMBINED_KG BIGINT NULL,
-- 	MIN_COMBINED_LENGTH_M DECIMAL(5,2) NULL,
-- 	MAX_COMBINED_LENGTH_M DECIMAL(5,2) NULL,
-- 	MIN_ENGINE_KW BIGINT NULL,
-- 	MIN_PASSENGER_COUNT TINYINT NULL,
-- 	MIN_TRAILER_LENGTH_M DECIMAL(5,2) NULL,
-- 	MAX_TRAILER_LENGTH_M DECIMAL(5,2) NULL,
-- 	MIN_VEHICLE_LENGTH_M DECIMAL(5,2) NULL,
-- 	MAX_VEHICLE_LENGTH_M DECIMAL(5,2) NULL,
-- 	MIN_VEHICLE_NOTICE_DAYS SMALLINT NOT NULL,
	THEORY_TYPE_CODE INT NOT NULL,
-- 	START_DATE DATETIME NOT NULL,
-- 	MIN_ENGINE_CC SMALLINT NULL,
-- 	MAX_ENGINE_CC SMALLINT NULL,
-- 	END_DATE DATETIME NULL,
-- 	COOLING_OFF_DAYS SMALLINT NOT NULL,
-- 	SHORT_NOTICE_DAYS SMALLINT NOT NULL,
-- 	REBOOK_SERVICE_LEVEL_DAYS SMALLINT NOT NULL,
-- 	VEHICLE_TYPE_CODE VARCHAR(2) NOT NULL,
-- 	MIN_VEHICLE_CAB_SEAT_COUNT SMALLINT NULL,
-- 	MAX_VEHICLE_CAB_SEAT_COUNT SMALLINT NULL,
-- 	MIN_VEHICLE_HEIGHT_M DECIMAL(5,2) NULL,
-- 	MAX_VEHICLE_HEIGHT_M DECIMAL(5,2) NULL,
-- 	MIN_VEHICLE_WIDTH_M DECIMAL(5,2) NULL,
-- 	MAX_VEHICLE_WIDTH_M DECIMAL(5,2) NULL,
-- 	REQUIRED_LICENCE_CATEGORY CHAR(4) NULL,
-- 	REQUIRED_ENTITLEMENT_TYPE CHAR(4) NULL,
-- 	DEFAULT_CATEGORY BIT NOT NULL,
-- 	AUTO_NCT_IND BIT NULL,
-- 	CREATED_ON DATETIME NOT NULL,
-- 	CREATED_BY BIGINT NOT NULL,
-- 	UPDATED_ON DATETIME NOT NULL,
-- 	UPDATED_BY BIGINT NOT NULL,
-- 	VEHICLE_REG_NUMBER_REQD BIT NULL,
-- 	MEETING_PLACE_REQD BIT NULL,
-- 	ADI_PRN_REQD BIT NULL,
-- 	TEST_CATEGORY_GROUP_CODE BIGINT NULL,
-- 	INTEREST_ID BIGINT NULL,
-- 	MIN_CANDIDATE_NOTICE_TIME DATETIME NULL,
-- 	IS_NOMINATED_TB_CATEGORY BIT NOT NULL,
-- 	NOMINATED_TB_CATEGORY_DESC VARCHAR(50) NULL,
-- 	PROG_ACCESS_LICENCE_CATEGORY CHAR(4) NULL,
-- 	MIN_PROGRESSIVE_AGE_YEARS TINYINT NULL,
	CONSTRAINT TC_TEST_CAT_REF_PK PRIMARY KEY (TEST_CATEGORY_REF)
);

-- create the work_schedule_slots as a view so that other legacy queries can be kept
-- as simple as possible
CREATE VIEW WORK_SCHEDULE_SLOTS AS
select ps.slot_id, DATE(p.programme_date) as programme_date, ps.start_time, ps.minutes,
	ps.individual_id, ps.tc_id, ps.vst_code, ps.non_test_activity_code,
	IFNULL(es.end_date, '4000-01-01') as examiner_end_date
from PROGRAMME p 
join PROGRAMME_SLOT ps
	on ps.programme_date = p.programme_date
	and ps.individual_id = p.individual_id
	and ps.tc_id = p.tc_id
join EXAMINER e on e.individual_id = p.individual_id
join EXAMINER_STATUS es on es.individual_id = e.individual_id
where ps.tc_closed_ind != 1
and IFNULL(ps.deployed_to_from_code, 0) != 1
and IFNULL(e.grade_code, 'ZZZ') != 'DELE'
and (
	p.state_code not in (2, 3)
	or exists
		(
		select book.booking_id
		from BOOKING book
		join PROGRAMME_SLOT slot on slot.slot_id = book.slot_id
		where slot.programme_date = p.programme_date
		and slot.individual_id = p.individual_id
		and slot.tc_id = p.tc_id
		and book.state_code = 1
		)
	);

-- Additional indexes added for query performance
-- First, create the stored procedure
DROP PROCEDURE IF EXISTS tarsreplica.CreateIndex;

DELIMITER //

CREATE PROCEDURE tarsreplica.CreateIndex
(
    schemaName	VARCHAR(64),
    tableName   VARCHAR(64),
    indexName   VARCHAR(64),
    columnNames VARCHAR(64)
)
BEGIN

    DECLARE IndexIsThere INT;

    SELECT COUNT(1) INTO IndexIsThere
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE table_schema = schemaName
    AND table_name = tableName
    AND index_name = indexName;

    IF IndexIsThere = 0 THEN
        SET @sqlstmt = CONCAT('CREATE INDEX ',indexName,' ON ', schemaName,'.',tableName,' (',columnNames,')');
        PREPARE st FROM @sqlstmt;
        EXECUTE st;
        DEALLOCATE PREPARE st;
    ELSE
        SELECT CONCAT('Index ',indexName,' already exists on Table ', schemaName,'.',tableName) CreateIndexErrorMessage;   
    END IF;

END //

DELIMITER ;

-- Then create the indexes
-- Examiner tables
CALL CreateIndex ('tarsreplica','REF_DATA_ITEM_MASTER','IX_RDIM_ITEMID','item_id');

-- Slot tables
CALL CreateIndex ('tarsreplica','BOOKING','IX_B_APPID','app_id');
CALL CreateIndex ('tarsreplica','BOOKING','IX_B_CANREASON','booking_cancel_reason_code');
CALL CreateIndex ('tarsreplica','BOOKING','IX_B_SLOTID','slot_id');
CALL CreateIndex ('tarsreplica','BOOKING','IX_B_STATECODE','state_code'); -- helps the select work_schedule_slots query
CALL CreateIndex ('tarsreplica','PROGRAMME','IX_P_PROGDATE','programme_date');
CALL CreateIndex ('tarsreplica','PROGRAMME_SLOT','IX_PS_PROGDATE','programme_date');  

-- Slot Detail tables
CALL CreateIndex ('tarsreplica','ADDRESS','IX_ADDR_INDID','individual_id');
CALL CreateIndex ('tarsreplica','ADDRESS','IX_ADDR_ORGID','organisation_id');
CALL CreateIndex ('tarsreplica','ADDRESS','IX_ADDR_TYPE','address_type_code');
CALL CreateIndex ('tarsreplica','CONTACT_DETAILS','IX_CD_INDID','individual_id');
CALL CreateIndex ('tarsreplica','CONTACT_DETAILS','IX_CD_ORGREG','organisation_register_id');
CALL CreateIndex ('tarsreplica','CUSTOMER_ORDER','IX_CO_BUSINESS_ID','business_id');
CALL CreateIndex ('tarsreplica','ORGANISATION_REGISTER','IX_OR_ORGID','organisation_id');
CALL CreateIndex ('tarsreplica','REGISTER','IX_REG_INDID','individual_id');
CALL CreateIndex ('tarsreplica','TEST_HISTORY','IX_TH_INDID','individual_id');

-- Application tables
CALL CreateIndex ('tarsreplica','APPLICATION_HISTORY','IX_AH_APP_ID','app_id');
CALL CreateIndex ('tarsreplica','APPLICATION_RSIS_INFO','IX_RSIS_BOOKID','booking_id');

-- Other tables


-- Functions
DELIMITER //
USE tarsreplica
//
  
/*
* Determines the number of previous ADI test attempts.
*/
DROP FUNCTION IF EXISTS getPreviousADIAttempts
//
  
CREATE FUNCTION getPreviousADIAttempts(p_candidate_id INT, p_vehicle_category varchar(30) ) returns INT
    BEGIN
        DECLARE l_part1_date  DATE;
        DECLARE l_count       INT;
/*
* This logic is taken from the Journal reports - to calculate the number of ADI part 2 or 3 attempts since
* the examiner's latest ADI part 1 (theory) attempt
*
* In practice the eligability logic is more restrictive than this but TARS should have applied that when the
* test is booked, and we don't want top replicate all that logic here...
*/
        SELECT MAX(date_of_test) INTO l_part1_date
        FROM TEST_HISTORY
        WHERE individual_id = p_candidate_id
            AND exam_type_code = 2097;
 
        SELECT COUNT(*) INTO l_count
        FROM TEST_HISTORY t, REF_DATA_ITEM_MASTER category_ref, REF_DATA_ITEM_MASTER result_ref
        WHERE t.individual_id = p_candidate_id
            AND t.exam_type_code = category_ref.item_id
            AND category_ref.category_id = 29
            AND category_ref.item_desc2 = p_vehicle_category
            AND t.result_code = result_ref.item_id
            AND result_ref.item_desc2 IN ('F','U')    -- Failed or Unknown Test Result
            AND t.date_of_test > l_part1_date;
        RETURN l_count;
    END
//
  
/*
* Determines the entitlement check indicator for this booking.
*/
DROP FUNCTION IF EXISTS getEntitlementCheckIndicator
//
 
CREATE FUNCTION getEntitlementCheckIndicator(p_application_id INT) RETURNS INT
    BEGIN
        DECLARE l_count         INT;
        DECLARE TRUE_RESULT     INT DEFAULT 1;
        DECLARE FALSE_RESULT    INT DEFAULT 0;
 
        DECLARE c1 CURSOR FOR
            SELECT COUNT(*)
            FROM APPLICATION
            WHERE app_id = p_application_id
                AND state_code = 3;
 
        DECLARE c2 CURSOR FOR
            SELECT COUNT(*)
            FROM APPLICATION_HISTORY
            WHERE app_id = p_application_id
                AND event_code = 1030
                AND event_date_time >=
                    (
                    SELECT MAX(DATE(event_date_time))
                    FROM APPLICATION_HISTORY
                    WHERE app_id = p_application_id
                    AND event_code = 1020
                    );
           
        DECLARE c3 CURSOR FOR
            SELECT COUNT(app.app_id)
            FROM TEST_HISTORY theory, TEST_SERVICE ts, APPLICATION app, TEST_CATEGORY tc
            WHERE app.app_id = p_application_id
                AND ts.test_service_id = app.test_service_id
                AND ts.test_category_ref = tc.test_category_ref
                AND tc.theory_type_code = theory.theory_type_code
                AND theory.individual_id = app.individual_id
                AND theory.theory_pass_state_code IS NOT NULL
                AND theory.theory_pass_state_code > 1;
 
  
/*
* This logic is taken from the Journal reports and also outlined at a high level in the Journal requirements
* spec...
*
* The examiner should check the candidate's entitlement thoroughly if any of the following are true...
*/
 
/*
* 1. Is the application's state code is 3 (booked but unchecked)?
*/
        SET l_count = 0;
 
        OPEN c1;
        FETCH c1 INTO l_count;
        CLOSE c1;
 
        IF l_count > 0 THEN
        RETURN TRUE_RESULT;
        END IF;
         
/*
* 2. Did a booking supervisor override the entitlement check (event 1030) on or after booking made (event 1020)?
*/
        SET l_count = 0;
         
        OPEN c2;
        FETCH c2 INTO l_count;
        CLOSE c2;
         
        IF l_count > 0 THEN
        RETURN TRUE_RESULT;
        END IF;
        
/*
* 3. Is an associated (by test category) theory pass unchecked?
* (theory_pass_state_code: 1 = Checked, 2 = Not yet checked, 3 = Not found after check)
*/
        SET l_count = 0;
         
        OPEN c3;
        FETCH c3 INTO l_count;
        CLOSE c3;
 
        IF l_count > 0 THEN
        RETURN TRUE_RESULT;
        ELSE
        RETURN FALSE_RESULT;
        END IF;
    END
//
 
/*
* Determines the next available working day (after today) for the journal.
*/
DROP FUNCTION IF EXISTS getJournalEndDate;
//
 
CREATE FUNCTION getJournalEndDate(pCountryId INT, pStartDate DATE) RETURNS DATE
    BEGIN
        SET @Days           = (SELECT MAX(DAYS_IN_ADVANCE_COUNT) FROM AREA WHERE COUNTRY_ID = pCountryId);
        SET @ValidEndDay    = 0;
        SET @JournalEndDate = DATE_ADD(DATE(pStartDate), INTERVAL @Days-1 DAY);
         
            BEGIN
                WHILE @ValidEndDay < 1 DO
                    IF
                        (
                        SELECT DAYOFWEEK(@JournalEndDate)) BETWEEN 2 AND 6
                            AND NOT EXISTS (SELECT NON_WORKING_DATE FROM NON_WORKING_DAY WHERE STATUTORY_IND = 1 AND COUNTRY_ID = pCountryId AND NON_WORKING_DATE = @JournalEndDate
                        )
                    THEN
                        SET @ValidEndDay = 1;
                    ELSE
                        SET @JournalEndDate = DATE_ADD(DATE(@JournalEndDate), INTERVAL 1 DAY);                 
                    END IF;
                END WHILE;
                 
                RETURN @JournalEndDate;
            END;
 
    END;
//
 
  
DELIMITER ;