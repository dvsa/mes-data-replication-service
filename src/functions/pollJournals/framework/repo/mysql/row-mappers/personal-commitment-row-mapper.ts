import { ExaminerPersonalCommitment } from '../../../../domain/examiner-personal-commitment';
import { extractDateFromDateTime, extractTimeFromDateTime } from '../../../../application/formatters/date-formatter';

interface PersonalCommitmentRow {
  individual_id: number;
  commitment_id: number;
  start_date_time: Date;
  end_date_time: Date;
  non_test_activity_code: string;
  reason_desc: string;
}

export const mapRow = (row: PersonalCommitmentRow): ExaminerPersonalCommitment => {
  return {
    examinerId: row.individual_id,
    personalCommitment: {
      commitmentId: row.commitment_id,
      startDate: extractDateFromDateTime(row.start_date_time),
      startTime: extractTimeFromDateTime(row.start_date_time),
      endDate: extractDateFromDateTime(row.end_date_time),
      endTime: extractTimeFromDateTime(row.end_date_time),
      activityCode: row.non_test_activity_code,
      activityDescription: row.reason_desc,
    },
  };
};
