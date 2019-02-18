import { ExaminerAdvanceTestSlot } from '../../../../domain/examiner-advance-test-slot';

interface AdvanceTestSlotRow {
  individual_id: number;
  slot_id: number;
  start_time: string;
  minutes: number;
  tc_id: number;
  tc_name: string;
  tc_cost_centre_code: string;
  short_vst_desc: string;
}

export const mapRow = (row: AdvanceTestSlotRow): ExaminerAdvanceTestSlot => {
  return {
    examinerId: row.individual_id,
    advanceTestSlot: {
      slotDetail: {
        slotId: row.slot_id,
        start: row.start_time,
        duration: row.minutes,
      },
      testCentre: {
        centreId: row.tc_id,
        centreName: row.tc_name,
        costCode: row.tc_cost_centre_code,
      },
      vehicleSlotType: row.short_vst_desc,
    },
  };
};
