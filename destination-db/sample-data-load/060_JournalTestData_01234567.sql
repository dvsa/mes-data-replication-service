
/****************************************************************************************************************************

Create the examiner and test centre record if they don't already exist

****************************************************************************************************************************/
-- Initialise variables
SET @TestCentreName			= 'Example Test Centre';
SET @TestCentreCostCode		= 'EXTC1';
SET @Country				= 'England';
SET @StaffNumber			= '01234567';
SET @ExaminerFirstName		= 'MobExaminer';
SET @ExaminerLastName		= '1';
SET @Date					= DATE_ADD(CURRENT_DATE, INTERVAL -5 DAY);

CALL uspGenerateExaminerData(@TestCentreName,@TestCentreCostCode,@Country,@StaffNumber,@ExaminerFirstName,@ExaminerLastName,@Date);


/****************************************************************************************************************************

Create the programme (5 days ago)

****************************************************************************************************************************/
SET @IndividualId           = (SELECT individual_id FROM EXAMINER WHERE staff_number = @StaffNumber);
SET @TestCentreId           = (SELECT tc_id FROM TEST_CENTRE WHERE tc_cost_centre_code = @TestCentreCostCode);

-- PROGRAMME
INSERT INTO PROGRAMME (individual_id, programme_date, tc_id, state_code)
SELECT @IndividualId, @Date, @TestCentreId, 1
FROM DUAL;


/****************************************************************************************************************************

Create the slots, including booking, application, individual, etc.

****************************************************************************************************************************/
/****************************************************
Test Slot 5 Days Ago
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 10;
SET @SlotMinute             = 04;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 86;
SET @NTACode                = NULL;
SET @GearboxType            = 'Manual';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'SHAWX885220A99HC';
SET @DateOfBirth            = '1971-10-22';
SET @Title                  = 'Miss';
SET @FirstName              = 'Anna';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Shaw';
SET @Gender                 = 'Female';
SET @Ethnicity              = 'A';
SET @PrimaryTelNo           = NULL;
SET @SecondaryTelNo         = NULL;
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = NULL;
SET @AddressLine1           = '999 Letsby Avenue';
SET @AddressLine2           = 'Someplace';
SET @AddressLine3           = 'Sometown';
SET @AddressLine4           = NULL;
SET @AddressLine5           = NULL;
SET @PostCode               = 'AB67 8CD';
SET @CancReason1            = NULL;
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'EXTRA';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = 'Candidate has dyslexia';
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 2;
SET @CheckDigit             = 2;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************************************************************************************

Create the programme (3 days ago)

****************************************************************************************************************************/
-- Increment date variable to represent the next working day
SET @Date                   = DATE_ADD(@DATE, INTERVAL 2 DAY);

-- PROGRAMME
INSERT INTO PROGRAMME (individual_id, programme_date, tc_id, state_code)
SELECT @IndividualId, @Date, @TestCentreId, 1
FROM DUAL;


/****************************************************
Test Slot 3 Days Ago
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 10;
SET @SlotMinute             = 04;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 86;
SET @NTACode                = NULL;
SET @GearboxType            = 'Manual';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'SHAWX885220A99HC';
SET @DateOfBirth            = '1971-10-22';
SET @Title                  = 'Miss';
SET @FirstName              = 'Belinda';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Shaw';
SET @Gender                 = 'Female';
SET @Ethnicity              = 'B';
SET @PrimaryTelNo           = NULL;
SET @SecondaryTelNo         = NULL;
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = NULL;
SET @AddressLine1           = 'My House';
SET @AddressLine2           = 'Someplace';
SET @AddressLine3           = 'Sometown';
SET @AddressLine4           = NULL;
SET @AddressLine5           = NULL;
SET @PostCode               = 'AB45 6CD';
SET @CancReason1            = NULL;
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'EXTRA';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = 'Candidate has dyslexia';
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 1;
SET @CheckDigit             = 9;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************************************************************************************

Create the programme (2 days ago)

****************************************************************************************************************************/
-- Increment date variable to represent the next working day
SET @Date                   = DATE_ADD(@DATE, INTERVAL 1 DAY);

-- PROGRAMME
INSERT INTO PROGRAMME (individual_id, programme_date, tc_id, state_code)
SELECT @IndividualId, @Date, @TestCentreId, 1
FROM DUAL;


/****************************************************
Test Slot 2 Days Ago
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 09;
SET @SlotMinute             = 07;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 57;
SET @NTACode                = NULL;
SET @GearboxType            = 'Automatic';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'DOEXX625220A99HC';
SET @DateOfBirth            = '1989-05-13';
SET @Title                  = 'Mrs';
SET @FirstName              = 'Carly';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Doe';
SET @Gender                 = 'Female';
SET @Ethnicity              = 'C';
SET @PrimaryTelNo           = NULL;
SET @SecondaryTelNo         = NULL;
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = 'jane.doe@example.com';
SET @AddressLine1           = 'My House';
SET @AddressLine2           = 'Someplace';
SET @AddressLine3           = 'Sometown';
SET @AddressLine4           = NULL;
SET @AddressLine5           = NULL;
SET @PostCode               = 'AB45 6CD';
SET @CancReason1            = 'DSA';
SET @CancReason2            = 'Act of nature';
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'YES';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = 'Candidate has dyslexia';
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 1;
SET @CheckDigit             = 9;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************************************************************************************

Create the programme (1 day ago)

****************************************************************************************************************************/
-- Increment date variable to represent the next working day
SET @Date                   = DATE_ADD(@DATE, INTERVAL 1 DAY);

-- PROGRAMME
INSERT INTO PROGRAMME (individual_id, programme_date, tc_id, state_code)
SELECT @IndividualId, @Date, @TestCentreId, 1
FROM DUAL;


/****************************************************
Test Slot 1 Day Ago
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 08;
SET @SlotMinute             = 10;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 57;
SET @NTACode                = NULL;
SET @GearboxType            = 'Automatic';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'PEARS015220A99HC';
SET @DateOfBirth            = '1977-07-02';
SET @Title                  = 'Miss';
SET @FirstName              = 'Doris';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Pearson';
SET @Gender                 = 'Female';
SET @Ethnicity              = 'D';
SET @PrimaryTelNo           = '01234 567890';
SET @SecondaryTelNo         = '04321 098765';
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = NULL;
SET @AddressLine1           = 'Address Line 1';
SET @AddressLine2           = 'Address Line 2';
SET @AddressLine3           = 'Address Line 3';
SET @AddressLine4           = 'Address Line 4';
SET @AddressLine5           = 'Address Line 5';
SET @PostCode               = 'PO57 0DE';
SET @CancReason1            = 'Act of nature';
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'NONE';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = NULL;
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 3;
SET @CheckDigit             = 1;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************************************************************************************

Create the programme (today)

****************************************************************************************************************************/
-- Increment date variable to represent the next working day
SET @Date                   = CURRENT_DATE;

-- PROGRAMME
INSERT INTO PROGRAMME (individual_id, programme_date, tc_id, state_code)
SELECT @IndividualId, @Date, @TestCentreId, 1
FROM DUAL;


/****************************************************
Test Slot Today - Slot 1
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 08;
SET @SlotMinute             = 10;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 57;
SET @NTACode                = NULL;
SET @GearboxType            = 'Automatic';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'PEARS015220A99HC';
SET @DateOfBirth            = '1977-07-02';
SET @Title                  = 'Miss';
SET @FirstName              = 'Florence';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Pearson';
SET @Gender                 = 'Female';
SET @Ethnicity              = 'E';
SET @PrimaryTelNo           = '01234 567890';
SET @SecondaryTelNo         = '04321 098765';
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = NULL;
SET @AddressLine1           = 'Address Line 1';
SET @AddressLine2           = 'Address Line 2';
SET @AddressLine3           = 'Address Line 3';
SET @AddressLine4           = 'Address Line 4';
SET @AddressLine5           = 'Address Line 5';
SET @PostCode               = 'PO57 0DE';
SET @CancReason1            = 'Act of nature';
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'NONE';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = NULL;
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 3;
SET @CheckDigit             = 1;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************
Test Slot Today - Slot 2
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 09;
SET @SlotMinute             = 07;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 57;
SET @NTACode                = NULL;
SET @GearboxType            = 'Automatic';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'DOEXX625220A99HC';
SET @DateOfBirth            = '1989-05-13';
SET @Title                  = 'Mrs';
SET @FirstName              = 'Jane';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Doe';
SET @Gender                 = 'Female';
SET @Ethnicity              = 'F';
SET @PrimaryTelNo           = NULL;
SET @SecondaryTelNo         = NULL;
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = 'jane.doe@example.com';
SET @AddressLine1           = 'My House';
SET @AddressLine2           = 'Someplace';
SET @AddressLine3           = 'Sometown';
SET @AddressLine4           = NULL;
SET @AddressLine5           = NULL;
SET @PostCode               = 'AB45 6CD';
SET @CancReason1            = 'DSA';
SET @CancReason2            = 'Act of nature';
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'YES';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = 'Candidate has dyslexia';
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 1;
SET @CheckDigit             = 9;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************
Test Slot Today - Slot 3
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 10;
SET @SlotMinute             = 04;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 86;
SET @NTACode                = NULL;
SET @GearboxType            = 'Manual';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'SHAWX885220A99HC';
SET @DateOfBirth            = '1971-10-22';
SET @Title                  = 'Miss';
SET @FirstName              = 'Theresa';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Shaw';
SET @Gender                 = 'Female';
SET @Ethnicity              = 'G';
SET @PrimaryTelNo           = NULL;
SET @SecondaryTelNo         = NULL;
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = NULL;
SET @AddressLine1           = '999 Letsby Avenue';
SET @AddressLine2           = 'Someplace';
SET @AddressLine3           = 'Sometown';
SET @AddressLine4           = NULL;
SET @AddressLine5           = NULL;
SET @PostCode               = 'AB67 8CD';
SET @CancReason1            = NULL;
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'EXTRA';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = 'Candidate has dyslexia';
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 2;
SET @CheckDigit             = 2;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************
Test Slot Today - Slot 4
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 11;
SET @SlotMinute             = 30;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 114;
SET @NTACode                = NULL;
SET @GearboxType            = 'Automatic';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'CAMPB805220A89HC';
SET @DateOfBirth            = '1986-10-20';
SET @Title                  = 'Mr';
SET @FirstName              = 'Ali';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Campbell';
SET @Gender                 = 'Male';
SET @Ethnicity              = 'A';
SET @PrimaryTelNo           = '01234 567890';
SET @SecondaryTelNo         = NULL;
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = NULL;
SET @AddressLine1           = '1 Station Street';
SET @AddressLine2           = 'Someplace';
SET @AddressLine3           = 'Somearea';
SET @AddressLine4           = 'Somecity';
SET @AddressLine5           = NULL;
SET @PostCode               = 'UB40 1AA';
SET @CancReason1            = NULL;
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'NONE';
SET @EntitlementCheck       = 1;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = NULL;
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 2;
SET @CheckDigit             = 6;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************
Test Slot Today - Slot 5
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 13;
SET @SlotMinute             = 24;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 114;
SET @NTACode                = NULL;
SET @GearboxType            = 'Manual';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'BROWN915220A99HC';
SET @DateOfBirth            = '1973-01-07';
SET @Title                  = 'Mr';
SET @FirstName              = 'James';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Brown';
SET @Gender                 = 'Male';
SET @Ethnicity              = 'B';
SET @PrimaryTelNo           = '01234 567890';
SET @SecondaryTelNo         = '04321 098765';
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = NULL;
SET @AddressLine1           = 'The Gables Cottage';
SET @AddressLine2           = 'Home Farm';
SET @AddressLine3           = 'Farm Road';
SET @AddressLine4           = 'Farm Area';
SET @AddressLine5           = 'Farmtown';
SET @PostCode               = 'FA43 9XY';
SET @CancReason1            = NULL;
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'YES';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = 'Candidate has dyslexia';
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 1;
SET @CheckDigit             = 3;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************
Test Slot Today - Slot 6
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 15;
SET @SlotMinute             = 18;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 114;
SET @NTACode                = NULL;
SET @GearboxType            = 'Manual';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'SMYTH375220A99HC';
SET @DateOfBirth            = '1973-01-07';
SET @Title                  = 'Captain';
SET @FirstName              = 'Montague';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Smythe';
SET @Gender                 = 'Male';
SET @Ethnicity              = 'C';
SET @PrimaryTelNo           = '01234 567890';
SET @SecondaryTelNo         = NULL;
SET @MobileTelNo            = NULL;
SET @EmailAddress           = 'm.smythe@example.com';
SET @AddressLine1           = '1 Hangar Lane';
SET @AddressLine2           = 'Someplace';
SET @AddressLine3           = 'Sometown';
SET @AddressLine4           = NULL;
SET @AddressLine5           = NULL;
SET @PostCode               = 'AB78 9CD';
SET @CancReason1            = NULL;
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'EXTRA';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 1;
SET @SpecialNeedsText       = 'Candidate has dyslexia';
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 7;
SET @CheckDigit             = 7;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************************************************************************************

Create the programme (next day)

****************************************************************************************************************************/
-- Increment date variable to represent the next working day
SET @Date                   = (SELECT getJournalEndDate(1,@Date));

-- PROGRAMME
INSERT INTO PROGRAMME (individual_id, programme_date, tc_id, state_code)
SELECT @IndividualId, @Date, @TestCentreId, 1
FROM DUAL;


/****************************************************
Test Slot Tomorrow - Slot 1
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 8;
SET @SlotMinute             = 10;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 57;
SET @NTACode                = NULL;
SET @GearboxType            = 'Automatic';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'POTSX015220A99HC';
SET @DateOfBirth            = '1985-03-04';
SET @Title                  = 'Mr';
SET @FirstName              = 'Bill';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Pots';
SET @Gender                 = 'Male';
SET @Ethnicity              = 'D';
SET @PrimaryTelNo           = '01234 567890';
SET @SecondaryTelNo         = '04321 098765';
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = NULL;
SET @AddressLine1           = '1234 Station Street';
SET @AddressLine2           = 'Someplace';
SET @AddressLine3           = 'Sometown';
SET @AddressLine4           = NULL;
SET @AddressLine5           = NULL;
SET @PostCode               = 'AB12 3CD';
SET @CancReason1            = 'Act of nature';
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'YES';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = NULL;
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 3;
SET @CheckDigit             = 1;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************
Test Slot Tomorrow - Slot 2
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 9;
SET @SlotMinute             = 07;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 57;
SET @NTACode                = NULL;
SET @GearboxType            = 'Automatic';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'COOPE625220A99HC';
SET @DateOfBirth            = '1975-09-01';
SET @Title                  = 'Miss';
SET @FirstName              = 'Alice';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Cooper';
SET @Gender                 = 'Female';
SET @Ethnicity              = 'E';
SET @PrimaryTelNo           = '01234 567890';
SET @SecondaryTelNo         = '04321 098765';
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = NULL;
SET @AddressLine1           = '2345 Station Street';
SET @AddressLine2           = 'Someplace';
SET @AddressLine3           = 'Sometown';
SET @AddressLine4           = NULL;
SET @AddressLine5           = NULL;
SET @PostCode               = 'AB12 3CD';
SET @CancReason1            = 'Act of nature';
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'EXTRA';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = NULL;
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 3;
SET @CheckDigit             = 1;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************
Test Slot Tomorrow - Slot 3
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 10;
SET @SlotMinute             = 04;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 57;
SET @NTACode                = NULL;
SET @GearboxType            = 'Automatic';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'BUXTO015220A99HC';
SET @DateOfBirth            = '1977-10-16';
SET @Title                  = 'Mr';
SET @FirstName              = 'Phil';
SET @SecondName             = NULL;
SET @ThirdName              = NULL;
SET @Surname                = 'Buxton';
SET @Gender                 = 'Male';
SET @Ethnicity              = 'F';
SET @PrimaryTelNo           = '01234 567890';
SET @SecondaryTelNo         = '04321 098765';
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = NULL;
SET @AddressLine1           = '3456 Station Street';
SET @AddressLine2           = 'Someplace';
SET @AddressLine3           = 'Sometown';
SET @AddressLine4           = NULL;
SET @AddressLine5           = NULL;
SET @PostCode               = 'AB12 3CD';
SET @CancReason1            = 'Act of nature';
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'YES';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = NULL;
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 3;
SET @CheckDigit             = 1;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);


/****************************************************
Test Slot Tomorrow - Slot 4
****************************************************/
-- Set test characteristic variables
SET @SlotHr                 = 11;
SET @SlotMinute             = 01;
SET @TestCategoryRef        = 'B';
SET @Minutes                = 57;
SET @NTACode                = NULL;
SET @GearboxType            = 'Automatic';
SET @LargeVehicle           = 0;
SET @DriverNumber           = 'SHIRT015220A99HC';
SET @DateOfBirth            = '1977-10-16';
SET @Title                  = 'Mr';
SET @FirstName              = 'Polo';
SET @SecondName             = 'Ralph';
SET @ThirdName              = 'Lauren';
SET @Surname                = 'Shirt';
SET @Gender                 = 'Male';
SET @Ethnicity              = 'G';
SET @PrimaryTelNo           = '01234 567890';
SET @SecondaryTelNo         = '04321 098765';
SET @MobileTelNo            = '07654 123456';
SET @EmailAddress           = NULL;
SET @AddressLine1           = '4567 Station Street';
SET @AddressLine2           = 'Someplace';
SET @AddressLine3           = 'Sometown';
SET @AddressLine4           = NULL;
SET @AddressLine5           = NULL;
SET @PostCode               = 'AB12 3CD';
SET @CancReason1            = 'Act of nature';
SET @CancReason2            = NULL;
SET @CancReason3            = NULL;
SET @ExtendedTest           = 0;
SET @SpecialNeedsCode       = 'EXTRA';
SET @EntitlementCheck       = 0;
SET @WelshTest              = 0;
SET @SpecialNeedsText       = NULL;
SET @ProgressiveAccess      = 0;
SET @BookingSeq             = 3;
SET @CheckDigit             = 1;

-- Call stored procedure
CALL uspGenerateJournalData(@Date,@IndividualId,@TestCentreId,@CancReason1,@CancReason2,@CancReason3,@SlotHr,@SlotMinute,@TestCategoryRef,@Minutes,@NTACode,@GearboxType,@LargeVehicle,@DriverNumber,@DateOfBirth,@Title,@FirstName,@SecondName,@ThirdName,@Surname,@Gender,@Ethnicity
,@PrimaryTelNo,@SecondaryTelNo,@MobileTelNo,@EmailAddress,@AddressLine1,@AddressLine2,@AddressLine3,@AddressLine4,@AddressLine5,@PostCode,@ExtendedTest,@SpecialNeedsCode,@EntitlementCheck,@WelshTest,@SpecialNeedsText,@ProgressiveAccess,@BookingSeq,@CheckDigit);
