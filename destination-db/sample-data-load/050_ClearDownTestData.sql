/****************************************************************************************************************************

Clean down test data

****************************************************************************************************************************/
SET @ThresholdId		= 90000000;

DELETE FROM TEST_CENTRE WHERE tc_id >= @ThresholdId;
DELETE FROM TEST_CENTRE_NAME WHERE tc_id >= @ThresholdId;
DELETE FROM EXAMINER WHERE individual_id >= @ThresholdId;
DELETE FROM EXAMINER_STATUS WHERE individual_id >= @ThresholdId;
DELETE FROM PROGRAMME WHERE individual_id >= @ThresholdId;
DELETE FROM PROGRAMME_SLOT WHERE slot_id >= @ThresholdId;
DELETE FROM INDIVIDUAL WHERE individual_id >= @ThresholdId;
DELETE FROM CONTACT_DETAILS WHERE contact_details_id >= @ThresholdId;
DELETE FROM ADDRESS WHERE address_id >= @ThresholdId;
DELETE FROM BOOKING WHERE booking_id >= @ThresholdId;
DELETE FROM APPLICATION WHERE app_id >= @ThresholdId;
DELETE FROM APPLICATION_RSIS_INFO WHERE app_id >= @ThresholdId;
DELETE FROM ETHNIC_ORIGIN;