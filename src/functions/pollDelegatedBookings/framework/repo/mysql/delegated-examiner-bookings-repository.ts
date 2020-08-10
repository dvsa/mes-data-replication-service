import { config } from '../../config/config';
import * as mysql from 'mysql2';
import { certificate } from '../../../../../common/certs/ssl_profiles';
import { query } from '../../../../../common/framework/mysql/database';
import { DelegatedExaminerTestSlot } from '../../../../pollJournals/domain/examiner-test-slot';
import {
  formatDateToIso8601,
  formatDateToStartTime,
} from '../../../../pollJournals/application/formatters/date-formatter';
import { Application, Candidate } from '@dvsa/mes-journal-schema';
import {
  setCapitalisedStringIfPopulated,
  setNumberIfNotNull,
  setNumberIfTruthy, setStringIfPopulated,
} from '../../../../pollJournals/framework/repo/mysql/row-mappers/test-slot-row-mapper';

interface DelegatedTestSlotRow {
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

export const getDelegatedExaminerBookings = async (): Promise<DelegatedExaminerTestSlot[]> => {
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
  return queryResult.map(delegatedBooking => mapDelegatedExaminerBooking(delegatedBooking));
};

const mapDelegatedExaminerBooking = (row: DelegatedTestSlotRow): DelegatedExaminerTestSlot => {

  const app: Application = { applicationId: 0, bookingSequence: 0, checkDigit: 0 };
  setNumberIfTruthy(app, 'applicationId', row.booking_id);
  setNumberIfTruthy(app, 'bookingSequence', row.booking_seq);
  setNumberIfNotNull(app, 'checkDigit', row.check_digit);

  const candidateDetails: Candidate = {};
  setStringIfPopulated(candidateDetails, 'driverNumber', row.driver_number);
  setStringIfPopulated(candidateDetails, 'dateOfBirth', formatDateToIso8601(row.date_of_birth));
  candidateDetails.candidateName = {};
  setCapitalisedStringIfPopulated(candidateDetails.candidateName, 'firstName', row.first_forename);
  setCapitalisedStringIfPopulated(candidateDetails.candidateName, 'lastName', row.family_name);

  const slot: DelegatedExaminerTestSlot = {
    examinerId: row.staff_number,
    testSlot: {
      slotDetail: {
        slotId: row.slot_id,
        start: formatDateToStartTime(row.start_time),
      },
      vehicleTypeCode: row.vehicle_type_code,
      vehicleSlotTypeCode: row.vehicle_slot_type_code,
      booking: {
        candidate: candidateDetails,
        application: app,
      },
    },
  };

  return slot;
};
