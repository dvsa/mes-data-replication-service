DROP PROCEDURE IF EXISTS tarsreplica.uspGenerateExaminerData;

DELIMITER //

CREATE PROCEDURE tarsreplica.uspGenerateExaminerData
	(
	TestCentreName VARCHAR(50),
	TestCentreCostCode VARCHAR(6),
	Country VARCHAR(8),
	StaffNumber VARCHAR(10),
	ExaminerFirstName VARCHAR(50),
	ExaminerLastName VARCHAR(50),
	Date DATE
	)

	BEGIN
	
		-- Set identifier variables
		SET @TestCentreId		= (SELECT IFNULL((SELECT MAX(tc_id) FROM TEST_CENTRE WHERE tc_id >= 90000000)+1,90000000));
		SET @IndividualId		= (SELECT IFNULL((SELECT MAX(individual_id) FROM INDIVIDUAL WHERE individual_id >= 90000000)+1,90000000));
		SET @CountryId			= (SELECT CASE WHEN Country = 'England' THEN 1 WHEN 'Wales' THEN 2 ELSE 3 END);

		-- TEST_CENTRE
		INSERT INTO TEST_CENTRE (tc_id, tc_cost_centre_code, country_id)
		SELECT @TestCentreId, TestCentreCostCode, @CountryId
		FROM DUAL
		WHERE NOT EXISTS
			(
			SELECT 1
			FROM TEST_CENTRE
			WHERE tc_cost_centre_code = TestCentreCostCode
			)
		LIMIT 1;

		-- TEST_CENTRE_NAME
		INSERT INTO TEST_CENTRE_NAME (tc_id, tc_name)
		SELECT @TestCentreId, TestCentreName
		FROM DUAL
		WHERE NOT EXISTS
			(
			SELECT 1
			FROM TEST_CENTRE_NAME
			WHERE tc_name = TestCentreName
			)
		LIMIT 1;
		
		-- EXAMINER
		INSERT INTO EXAMINER (individual_id, staff_number)
		SELECT @IndividualId, StaffNumber
		FROM DUAL
		WHERE NOT EXISTS
			(
			SELECT 1
			FROM EXAMINER e
			LEFT JOIN EXAMINER_STATUS es ON es.individual_id = e.individual_id
			WHERE IFNULL(e.grade_code, 'ZZZ') <> 'DELE'
			AND IFNULL(es.end_date, '4000-01-01') >= Date
			AND e.staff_number = StaffNumber
			)
		LIMIT 1;

		-- Repoint @Individual_id to the assigned value
		SET @IndividualId		= (SELECT individual_id FROM EXAMINER WHERE staff_number = StaffNumber);

		-- EXAMINER_STATUS
		INSERT INTO EXAMINER_STATUS (individual_id, start_date)
		SELECT @IndividualId, '2014-01-01'
		FROM DUAL
		WHERE NOT EXISTS
			(
			SELECT 1
			FROM EXAMINER_STATUS
			WHERE individual_id = @IndividualId
			)
		LIMIT 1;

		-- INDIVIDUAL
		INSERT INTO INDIVIDUAL (individual_id, driver_number, title_code, family_name, first_forename, second_forename, third_forename)
		SELECT @IndividualId, NULL, NULL, ExaminerLastName, ExaminerFirstName, NULL, NULL
		FROM DUAL
		WHERE NOT EXISTS
			(
			SELECT 1
			FROM INDIVIDUAL
			WHERE individual_id = @IndividualId
			)
		LIMIT 1;

	END//

DELIMITER ;