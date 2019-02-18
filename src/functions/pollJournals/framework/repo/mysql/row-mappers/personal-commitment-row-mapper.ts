import { ExaminerPersonalCommitment } from '../../../../domain/examiner-personal-commitment';

interface PersonalCommitmentRow {
  individual_id: number;
  commitment_id: number;
  start_date_time: string;
  end_date_time: string;
  non_test_activity_code: string;
  reason_desc: string;
}

// TODO: Split out start/end date/time
export const mapRow = (row: PersonalCommitmentRow): ExaminerPersonalCommitment => {
  return {
    examinerId: row.individual_id,
    personalCommitment: {
      commitmentId: row.commitment_id,
      startDate: row.start_date_time,
      startTime: row.start_date_time,
      endDate: row.end_date_time,
      endTime: row.end_date_time,
      activityCode: row.non_test_activity_code,
      activityDescription: row.reason_desc,
    },
  };
};
