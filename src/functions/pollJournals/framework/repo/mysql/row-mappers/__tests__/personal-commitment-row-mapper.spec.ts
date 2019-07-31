import { mapRow } from '../personal-commitment-row-mapper';

describe('PersonalCommitment Row Mapper', () => {
  it('should map a PersonalCommitmentRow to an ExaminerPersonalCommitment', () => {
    const result = mapRow({
      individual_id: 1,
      commitment_id: 2,
      start_date_time: new Date('2019-02-12 08:20:00'),
      end_date_time: new Date('2019-02-12 09:20:00'),
      non_test_activity_code: 'pcom',
      reason_desc: 'reason',
    });
    expect(result).toEqual(
      {
        examinerId: 1,
        personalCommitment: {
          activityCode: 'pcom',
          activityDescription: 'reason',
          commitmentId: 2,
          startDate: '12/02/2019',
          startTime: '08:20:00',
          endDate: '12/02/2019',
          endTime: '09:20:00',
        },
      },
    );
  });
});
