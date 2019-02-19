import { ExaminerPersonalCommitment } from '../../../../domain/examiner-personal-commitment';
import { formatDateToStartTime } from '../../../../application/formatters/date-formatter';

interface PersonalCommitmentRow {
  individual_id: number;
  commitment_id: number;
  start_date_time: Date;
  end_date_time: Date;
  non_test_activity_code: string;
  reason_desc: string;
}

// TODO: Split out start/end date/time
export const mapRow = (row: PersonalCommitmentRow): ExaminerPersonalCommitment => {
  return {
    examinerId: row.individual_id,
    personalCommitment: {
      commitmentId: row.commitment_id,
      startDate: formatDateToStartTime(row.start_date_time),
      startTime: formatDateToStartTime(row.start_date_time),
      endDate: formatDateToStartTime(row.end_date_time),
      endTime: formatDateToStartTime(row.end_date_time),
      activityCode: row.non_test_activity_code,
      activityDescription: row.reason_desc,
    },
  };
};
