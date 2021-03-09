import { TestCentreDetail } from '../../../common/application/models/test-centre';
import {
  unCacheTestCentreExaminers,
  updateTestCentreExaminers,
} from '../framework/repo/dynamodb/cached-test-centre-repository';

export const reconcileActiveAndCachedTestCentreRows = async (
  activeTestCentreRows: TestCentreDetail[],
  cachedTestCentreRows: TestCentreDetail[],
): Promise<void> => {

  // determine staffNumbers that are no longer active
  const cachedTestCentresEligibleForDeletion: string[] =
    extractCachedTestCentresForDeletion(cachedTestCentreRows, activeTestCentreRows)
      .map((testCentre: TestCentreDetail) => testCentre.staffNumber);

  await unCacheTestCentreExaminers(cachedTestCentresEligibleForDeletion);

  // update Dynamo using activeTestCentreRows
  await updateTestCentreExaminers(activeTestCentreRows);
};

const extractCachedTestCentresForDeletion = (
  cachedTestCentreRows: TestCentreDetail[],
  activeTestCentreRows: TestCentreDetail[],
): TestCentreDetail[] => {
  const activeStaffNumbers: string[] = activeTestCentreRows.map((row: TestCentreDetail) => row.staffNumber);

  return cachedTestCentreRows
    .filter((row: TestCentreDetail) => !activeStaffNumbers.includes(row.staffNumber));
};
