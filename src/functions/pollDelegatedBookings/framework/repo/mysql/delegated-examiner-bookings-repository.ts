import * as mysql from 'mysql2';

import { config } from '../../config';
import { certificate } from '../../../../../common/certs/ssl_profiles';
import { query } from '../../../../../common/framework/mysql/database';
import { buildDelegatedBookingsFromQueryResult } from './delegated-examiner-bookings-row-mapper';
import { DelegatedBookingDetail } from '../../../../../common/application/models/delegated-booking-details';

export interface DelegatedTestSlotRow {
  slot_id: number;
  start_time: Date;
  vehicle_type_code: string | null; // nullable
  vehicle_slot_type_code: number | null; // nullable
  booking_id: number | null;
  driver_number: string | null;
  first_forename: string | null;
  family_name: string | null;
  test_category_ref: string | null;
  booking_seq: number;
  check_digit: number;
  date_of_birth: Date | null;
  staff_number: string;
}

export const getActiveDelegatedExaminerBookings = async (): Promise<DelegatedBookingDetail[]> => {
  const configuration = config();

  const connection = mysql.createConnection({
    host: configuration.tarsReplicaDatabaseHostname,
    database: configuration.tarsReplicaDatabaseName,
    user: configuration.tarsReplicaDatabaseUsername,
    password: configuration.tarsReplicaDatabasePassword,
    charset: 'UTF8_GENERAL_CI',
    ssl: process.env.TESTING_MODE ? null : certificate,
    authSwitchHandler(data, cb) {
      if (data.pluginName === 'mysql_clear_password') {
        cb(null, Buffer.from(`${configuration.tarsReplicaDatabasePassword}\0`));
      }
    },
  });

  const queryResult: DelegatedTestSlotRow[] = await query(
      connection,
      `SELECT ps.slot_id
     , ps.start_time
     , bk.booking_id
     , ex.staff_number
     , cd.driver_number
     , cd.first_forename
     , cd.family_name
     , ts.test_category_ref
     , app_rsis.booking_seq
     , app_rsis.check_digit
     , cd.date_of_birth
     , vst.vehicle_type_code
     , vst.vst_code vehicle_slot_type_code
  FROM tarsreplica.EXAMINER ex
  JOIN tarsreplica.PROGRAMME_SLOT ps
    ON ps.individual_id = ex.individual_id
  JOIN tarsreplica.BOOKING bk
    ON bk.slot_id = ps.slot_id
  JOIN tarsreplica.APPLICATION app
    ON app.app_id = bk.app_id
  JOIN tarsreplica.INDIVIDUAL cd
    ON cd.individual_id = app.individual_id
  JOIN tarsreplica.TEST_SERVICE ts
    ON ts.test_service_id = app.test_service_id
  JOIN tarsreplica.APPLICATION_RSIS_INFO app_rsis
    ON app_rsis.app_id = app.app_id
  JOIN tarsreplica.VEHICLE_SLOT_TYPE vst
    ON vst.VST_CODE = ps.VST_CODE
WHERE ex.grade_code = 'DELE'`,
  );

  const queryResult1: DelegatedTestSlotRow[] = [
    {
      slot_id: 1,
      start_time: null,
      vehicle_type_code: 'B',
      vehicle_slot_type_code: 15,
      booking_id: 24306179,
      driver_number: 'HOMER146246AJ9AG',
      first_forename: 'Homer',
      family_name: 'Simpson',
      test_category_ref: 'B',
      booking_seq: 2,
      check_digit: 1,
      date_of_birth: new Date('1990-12-15'),
      staff_number: '1234567',
    },
    {
      slot_id: 2,
      start_time: null,
      vehicle_type_code: 'C',
      vehicle_slot_type_code: 14,
      booking_id: 24306180,
      driver_number: 'LISA9146246AJ9AG',
      first_forename: 'Lisa',
      family_name: 'Simpson',
      test_category_ref: 'C',
      booking_seq: 3,
      check_digit: 4,
      date_of_birth: new Date('1906-02-05'),
      staff_number: '4583912',
    },
    {
      slot_id: 3,
      start_time: null,
      vehicle_type_code: 'D',
      vehicle_slot_type_code: 4,
      booking_id: 24306141,
      driver_number: 'DAVID146246AJ9AG',
      first_forename: 'David',
      family_name: 'Simpson',
      test_category_ref: 'D',
      booking_seq: 5,
      check_digit: 9,
      date_of_birth: new Date('1999-01-2'),
      staff_number: '2468353',
    },
    {
      slot_id: 4,
      start_time: null,
      vehicle_type_code: 'B',
      vehicle_slot_type_code: 15,
      booking_id: 24306182,
      driver_number: 'MARGE146246AJ9AG',
      first_forename: 'Marge',
      family_name: 'Simpson',
      test_category_ref: 'B',
      booking_seq: 6,
      check_digit: 4,
      date_of_birth: new Date('1992-01-20'),
      staff_number: '9865321',
    },
  ];

  return buildDelegatedBookingsFromQueryResult(queryResult1);
};
