import { NonTestActivity, TestCentre } from '../../../common/domain/Schema';

export const mapNonTestActivityRecord = (record: {[k: string]: any}): NonTestActivity => {
  const testCentre: TestCentre = {
    centreId: record.tc_id,
    centreName: record.tc_name,
    costCode: record.tc_cost_centre_code,
  };
  return {
    testCentre,
    activityCode: record.non_test_activity_code,
    activityDescription: record.reason_desc,
  };
};
