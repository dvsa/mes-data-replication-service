-- REF_DATA_ITEM_MASTER
REPLACE INTO REF_DATA_ITEM_MASTER (item_id, item_desc1, item_desc2, category_id)
VALUES
	(879,'Male',NULL,38),
	(880,'Female',NULL,38),
	(1242,'Mr',NULL,89),
	(1243,'Mrs',NULL,89),
	(1244,'Miss',NULL,89),
	(2047,'Ms',NULL,89),
	(2220,'Dr',NULL,89),
	(2221,'Rev',NULL,89),
	(3692,'Captain',NULL,89),
	(8003,'Lady',NULL,89),
	(8063,'Lord',NULL,89),
	(9284,'Sir',NULL,89),
	(9385,'Pastor',NULL,89),
	(10410,'Mx',NULL,89);


-- NON_TEST_ACTIVITY_REASON
REPLACE INTO NON_TEST_ACTIVITY_REASON (NON_TEST_ACTIVITY_CODE, REASON_DESC)
VALUES
	('081','Annual Leave'),
	('082','Bank Holiday/Privilege Holiday'),
	('083','Special Leave'),
	('084','Sick Leave'),
	('085','Secondment to SE ADI/SM duties'),
	('086','Conducting ADI Part II tests DO NOT USE'),
	('087','Conducting ADI Part III tests DO NOT USE'),
	('088','Administrative duties'),
	('089','Management period'),
	('090','Examiner Check Test'),
	('091','Travel period to detached TC and/or outstation'),
	('092','Route learning'),
	('094','Motorcycle maintenance/cleaning'),
	('095','Motorcycle cleaning - DO NOT USE'),
	('096','Motorcycle changeover period'),
	('100','CBT duties'),
	('101','Theory test duties'),
	('102','Traffic Disruption/Local Event'),
	('103','staff survey'),
	('104','Medical appointment'),
	('105','Restricted Programme'),
	('107','Training course'),
	('108','Delivery Instruction at Cardington'),
	('109','DSA Conference'),
	('110','TUS Activities'),
	('111','OHS Activities'),
	('112','TUS - Working Parties'),
	('113','TUS-leave granted for TUS reps (conferences etc) '),
	('114','Receiving Appraisal'),
	('115','Disciplinary case DO NOT USE'),
	('116','Office familiarisation/induction'),
	('118','Legal matters'),
	('119','Visit solicitor to prepare court case DO NOT USE'),
	('120','Court appearance DO NOT USE'),
	('121','Jury service DO NOT USE'),
	('122','Justice of the peace duties DO NOT USE'),
	('123','Taxi Assessment DO NOT USE'),
	('124','Hazard Perception DO NOT USE'),
	('125','Industrial action'),
	('126','Foot & Mouth Outbreak DO NOT USE'),
	('127','Examiner Travel Problems'),
	('128','Clerical Error'),
	('129','Examiner TOIL'),
	('130','Staffing Issues DO NOT USE'),
	('131','Previous test late finishing'),
	('132','Risk to Public Safety'),
	('133','Bad Weather'),
	('134','ADI Check Test'),
	('135','ORDIT Duties'),
	('136','Fleet Register DO NOT USE'),
	('137','Register duties'),
	('138','Supervision of delegated/authorised Examiners'),
	('139','MOD Supervision DO NOT USE'),
	('140','Purchase Protective Clothing'),
	('141','Supervisor Check Test'),
	('142','Personal Development'),
	('143','Cascade Briefings'),
	('144','Management visits'),
	('145','New examiner - development'),
	('146','Mentor Duties'),
	('147','SE/SM meetings'),
	('148','Focus group meetings'),
	('149','Recruitment work'),
	('150','DTC site searches'),
	('151','Pre and Post course briefings DO NOT USE'),
	('152','Staggered Test Programme'),
	('153','DO NOT USE'),
	('154','Testing for other Authority'),
	('155','Equality and Diversity issues'),
	('156','CIG/similar meetings'),
	('157','Test did not take place- alleged illegal activity'),
	('158','CBT site assessments/inspections'),
	('159','CBT site visit co-ordination'),
	('160','CBT monitoring'),
	('161','DL196 collation'),
	('162','liaison with examiners who undertake CBT duties'),
	('163','CBT check tests'),
	('164','RAT testing'),
	('165','IAT testing'),
	('166','Post register check tests'),
	('167','CBT research'),
	('168','CBT supervision'),
	('169','CBT covert duties'),
	('170','Attendance at events'),
	('171','CBT rest days'),
	('172','Analysis of MI'),
	('173','Pass rates & Variances'),
	('174','HR information'),
	('175','Finance information'),
	('176','QAT visit'),
	('177','Performance Development Team visit'),
	('178','Fraud and Integrity Team visit'),
	('179','Motorcycle Test Review'),
	('180','Hospital Appointment (not Doctors)'),
	('181','Disability Adjustment Leave'),
	('182','DVLA Special Eyesight Test'),
	('183','Discussion following absence'),
	('184','Undergoing recruitment process'),
	('185','DSA module 1 equipment unavailable'),
	('186','Mod 2 test cancelled due to agency cancelled mod 1'),
	('187','Test Centre surgeries'),
	('188','Defect - DO NOT USE'),
	('189','Pre strike cancellation - DO NOT USE'),
	('190','Term-time work'),
	('191','Periodic Training'),
	('192','Delivering Appraisal'),
	('193','Maternity/paternity leave'),
	('194','Float EANTB'),
	('195','DVLA Medical Appraisal'),
	('196','e-learning'),
	('197','Not actively testing'),
	('198','Corporate Connectivity'),
	('199','Test already passed for this category');


-- BOOKING_CANCELLATION_REASON
REPLACE INTO BOOKING_CANCELLATION_REASON (booking_cancel_reason_code, initiator_code)
VALUES
	(1,'Candidate'),
	(10,'Act of nature'),
	(20,'DSA');


-- VEHICLE
REPLACE INTO VEHICLE (vehicle_id, cab_seat_count, gearbox_code, height_m, length_m, width_m, passenger_seat_count)
VALUES
	(1,NULL,1,NULL,NULL,NULL,NULL),
	(2,NULL,2,NULL,NULL,NULL,NULL),
	(3,2,1,5.00,10.00,2.50,0),
	(4,2,2,5.00,10.00,2.50,0);


-- VEHICLE_SLOT_TYPE
REPLACE INTO VEHICLE_SLOT_TYPE (VST_CODE, VEHICLE_TYPE_CODE)
VALUES
	(6,'L'),
	(7,'C'),
	(8,'C'),
	(9,'C'),
	(10,'B'),
	(14,'C'),
	(15,'B'),
	(16,'B'),
	(17,'C'),
	(18,'T'),
	(20,'T'),
	(21,'T'),
	(22,'A2'),
	(23,'A3'),
	(62,'L'),
	(63,'L'),
	(64,'V4'),
	(82,'B1'),
	(83,'B1'),
	(84,'B2'),
	(85,'B2'),
	(86,'B2'),
	(102,'B1'),
	(122,'V4'),
	(1300,'O'),
	(2301,'V4'),
	(2321,'BE'),
	(2341,'TC'),
	(2342,'TC'),
	(2361,'SC');

-- TEST_CATEGORY
REPLACE INTO TEST_CATEGORY (test_category_ref, theory_type_code)
VALUES
	('A',2),
	('A1',2),
	('A1M1',2),
	('A1M2',2),
	('A2',2),
	('A2M1',2),
	('A2M2',2),
	('ADI2',5),
	('ADI3',5),
	('AM1',2),
	('AM2',2),
	('B',1),
	('B+E',9),
	('B+E MMA',9),
	('B1',1),
	('BTRIAL',1),
	('C',3),
	('C+E',9),
	('C1',3),
	('C1+E',9),
	('CCPC',11),
	('D',4),
	('D+E',9),
	('D1',4),
	('D1+E',9),
	('DCPC',12),
	('DE A1M1',9),
	('DE A1M2',9),
	('DE A2M1',9),
	('DE A2M2',9),
	('DE AM1',9),
	('DE AM2',9),
	('DE B',9),
	('DE C',9),
	('DE C+E',9),
	('DE C1',9),
	('DE C1+E',9),
	('DE D',9),
	('DE D+E',9),
	('DE D1',9),
	('DE D1+E',9),
	('DE M4 B',9),
	('DE M4 L',9),
	('DE PM1',9),
	('DE PM2',9),
	('DEM3',9),
	('DEM4',9),
	('EUA1M1',2),
	('EUA1M2',2),
	('EUA2M1',2),
	('EUA2M2',2),
	('EUAM1',2),
	('EUAM2',2),
	('EUAMM1',2),
	('EUAMM2',2),
	('F',9),
	('G',9),
	('H',9),
	('K',9),
	('O',10),
	('P',2),
	('PM1',2),
	('PM2',2),
	('SC',9),
	('Z',9),
	('Z1',9),
	('Z2',9);
	

-- TEST_SERVICE
REPLACE INTO TEST_SERVICE (test_service_id, extended_ind, special_needs_code, test_category_ref, vst_code)
VALUES
	(1,0,'YES','A',10),
	(2,0,'NONE','A',10),
	(3,0,'EXTRA','A',15),
	(4,1,'NONE','A',16),
	(5,0,'NONE','A1',10),
	(6,0,'YES','A1',10),
	(7,0,'EXTRA','A1',15),
	(8,1,'NONE','A1',16),
	(9,0,'NONE','P',10),
	(10,0,'NONE','B',7),
	(11,0,'YES','B',7),
	(12,0,'EXTRA','B',8),
	(13,1,'NONE','B',9),
	(14,0,'NONE','B1',7),
	(15,0,'NONE','B1',14),
	(16,0,'NONE','F',14),
	(17,0,'NONE','G',14),
	(18,0,'NONE','H',14),
	(19,0,'NONE','K',14),
	(20,0,'NONE','C',6),
	(21,0,'NONE','C+E',6),
	(22,0,'NONE','C1',6),
	(23,0,'NONE','C1+E',6),
	(24,0,'NONE','D',6),
	(25,0,'NONE','D+E',6),
	(26,0,'NONE','D1',6),
	(27,0,'NONE','D1+E',6),
	(28,0,'NONE','F',14),
	(29,0,'NONE','B+E',6),
	(50,1,'YES','B',9),
	(51,0,'EXTRA','P',15),
	(72,0,'YES','B1',7),
	(73,0,'EXTRA','B1',8),
	(74,0,'YES','B+E',6),
	(75,0,'EXTRA','B+E',6),
	(76,0,'NONE','A2',10),
	(77,0,'YES','A2',10),
	(78,0,'EXTRA','A2',15),
	(79,1,'NONE','A2',16),
	(81,0,'YES','C',6),
	(82,0,'YES','C+E',6),
	(83,0,'YES','C1',6),
	(84,0,'YES','C1+E',6),
	(85,0,'YES','D',6),
	(86,0,'YES','D+E',6),
	(87,0,'YES','D1',6),
	(88,0,'YES','D1+E',6),
	(105,0,'NONE','Z',18),
	(106,0,'NONE','Z1',20),
	(107,0,'NONE','Z2',21),
	(110,0,'YES','Z',18),
	(111,0,'EXTRA','Z',18),
	(112,0,'YES','Z1',20),
	(113,0,'EXTRA','Z1',20),
	(114,0,'YES','Z2',21),
	(115,0,'EXTRA','Z2',21),
	(116,0,'YES','F',14),
	(118,0,'EXTRA','F',14),
	(138,0,'YES','P',10),
	(176,0,'NONE','ADI2',22),
	(197,0,'NONE','ADI3',23),
	(216,0,'YES','ADI2',22),
	(236,0,'YES','ADI3',23),
	(258,0,'NONE','DEM3',62),
	(259,0,'NONE','DEM4',63),
	(263,0,'NONE','DCPC',64),
	(264,0,'YES','DCPC',64),
	(276,0,'NONE','A1M1',82),
	(277,0,'EXTRA','A1M1',83),
	(278,0,'NONE','A1M2',84),
	(279,0,'YES','A1M2',84),
	(280,0,'EXTRA','A1M2',85),
	(281,1,'NONE','A1M2',86),
	(282,0,'NONE','A2M1',82),
	(283,0,'EXTRA','A2M1',83),
	(284,0,'NONE','A2M2',84),
	(285,0,'YES','A2M2',84),
	(286,0,'EXTRA','A2M2',85),
	(287,1,'NONE','A2M2',86),
	(288,0,'NONE','AM1',82),
	(289,0,'YES','AM1',82),
	(290,0,'EXTRA','AM1',83),
	(292,0,'NONE','AM2',84),
	(293,0,'YES','AM2',84),
	(294,0,'EXTRA','AM2',85),
	(295,1,'NONE','AM2',86),
	(296,0,'NONE','PM1',82),
	(297,0,'EXTRA','PM1',83),
	(298,0,'NONE','PM2',84),
	(299,0,'YES','PM2',84),
	(300,0,'EXTRA','PM2',85),
	(301,1,'NONE','PM2',86),
	(317,0,'YES','A1M1',82),
	(318,1,'NONE','A1M1',82),
	(319,1,'NONE','AM1',82),
	(320,0,'YES','A2M1',82),
	(321,1,'NONE','A2M1',82),
	(322,0,'YES','PM1',82),
	(323,1,'NONE','PM1',82),
	(336,0,'NONE','CCPC',122),
	(337,0,'YES','CCPC',122),
	(356,0,'NONE','DE A1M1',62),
	(357,0,'NONE','DE A1M2',62),
	(358,0,'NONE','DE A2M1',62),
	(359,0,'NONE','DE A2M2',62),
	(360,0,'NONE','DE AM1',62),
	(361,0,'NONE','DE AM2',62),
	(362,0,'NONE','DE B',62),
	(363,0,'NONE','DE C',62),
	(364,0,'NONE','DE C+E',62),
	(365,0,'NONE','DE C1',62),
	(366,0,'NONE','DE C1+E',62),
	(367,0,'NONE','DE D',62),
	(368,0,'NONE','DE D+E',62),
	(369,0,'NONE','DE D1',62),
	(370,0,'NONE','DE D1+E',62),
	(371,0,'NONE','DE M4 B',62),
	(372,0,'NONE','DE M4 L',63),
	(373,0,'NONE','DE PM1',62),
	(374,0,'NONE','DE PM2',62),
	(1375,0,'NONE','O',1300),
	(1395,0,'NONE','CCPC',2301),
	(1396,0,'YES','CCPC',2301),
	(1415,0,'NONE','DCPC',2301),
	(1416,0,'YES','DCPC',2301),
	(1435,0,'NONE','B+E MMA',2321),
	(1436,0,'YES','B+E MMA',2321),
	(1437,0,'EXTRA','B+E MMA',2321),
	(1455,0,'NONE','EUAMM1',82),
	(1456,0,'EXTRA','EUAMM1',83),
	(1457,0,'YES','EUAMM1',82),
	(1458,1,'NONE','EUAMM1',82),
	(1459,0,'NONE','EUAMM2',84),
	(1460,0,'YES','EUAMM2',84),
	(1461,0,'EXTRA','EUAMM2',85),
	(1462,1,'NONE','EUAMM2',86),
	(1463,0,'YES','EUA1M1',82),
	(1464,1,'NONE','EUA1M1',82),
	(1465,0,'NONE','EUA1M1',82),
	(1466,0,'EXTRA','EUA1M1',83),
	(1467,0,'NONE','EUA1M2',84),
	(1468,0,'YES','EUA1M2',84),
	(1469,0,'EXTRA','EUA1M2',85),
	(1470,1,'NONE','EUA1M2',86),
	(1471,0,'YES','EUA2M1',82),
	(1472,1,'NONE','EUA2M1',82),
	(1473,0,'NONE','EUA2M1',82),
	(1474,0,'EXTRA','EUA2M1',83),
	(1475,0,'NONE','EUA2M2',84),
	(1476,0,'YES','EUA2M2',84),
	(1477,0,'EXTRA','EUA2M2',85),
	(1478,1,'NONE','EUA2M2',86),
	(1479,0,'NONE','EUAM1',82),
	(1480,0,'YES','EUAM1',82),
	(1481,0,'EXTRA','EUAM1',83),
	(1482,1,'NONE','EUAM1',82),
	(1483,0,'NONE','EUAM2',84),
	(1484,0,'YES','EUAM2',84),
	(1485,0,'EXTRA','EUAM2',85),
	(1486,1,'NONE','EUAM2',86),
	(1495,0,'NONE','BTRIAL',2341),
	(1496,0,'YES','BTRIAL',2341),
	(1497,0,'EXTRA','BTRIAL',2342),
	(1515,0,'NONE','SC',2361),
	(1516,0,'YES','SC',2361),
	(1536,0,'YES','SC',2361);