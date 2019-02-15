import * as examinerRepo from '../../framework/repo/mysql/examiner-repository';
import * as testSlotRepo from '../../framework/repo/mysql/test-slot-repository';
import * as personalCommitmentRepo from '../../framework/repo/mysql/personal-commitment-repository';
import * as nonTestActivityRepo from '../../framework/repo/mysql/non-test-activity-repository';
import * as advanceTestSlotsRepo from '../../framework/repo/mysql/advance-test-slots-repository';
import * as deploymentRepo from '../../framework/repo/mysql/deployment-repository';
import * as journalRepo from '../../framework/repo/dynamodb/journal-repository';
import * as journalBuilder from '../journal-builder';
import { transferDatasets } from '../transfer-datasets';
import * as config from '../../framework/config/config';
import { dummyConfig } from '../../framework/config/__mocks__/config';

const dummyNonTestActivityDataset = [{ examinerId: 3, nonTestActivity: {} }];
const dummyAdvanceTestSlotDataset = [{ examinerId: 4, advanceTestSlot: {} }];
const dummyDeploymentDataset = [{ examinerId: 5, deployment: {} }];

describe('transferDatasets', () => {
  let getTestSlotSpy: jasmine.Spy;
  let getPersonalCommitmentsSpy: jasmine.Spy;
  let getNonTestActivitesSpy: jasmine.Spy;
  let getAdvanceTestSlotsSpy: jasmine.Spy;
  let getDeploymentsSpy: jasmine.Spy;
  let journalBuilderSpy: jasmine.Spy;
  let saveJournalsSpy: jasmine.Spy;

  const dummyExaminers = [
    { examiner_id: 1 },
    { examiner_id: 2 },
    { examiner_id: 3 },
    { examiner_id: 4 },
    { examiner_id: 5 },
  ];
  const dummyTestSlotDataset = [{ examinerId: 1, testSlot: {} }];
  const dummyPersonalCommitmentDataset = [{ examinerId: 2, personalCommitment: {} }];
  const dummyTransformedJournals = { transformed: 'object' };

  beforeEach(async () => {
    spyOn(config, 'bootstrapConfig');
    spyOn(config, 'config').and.returnValue(dummyConfig);
    spyOn(examinerRepo, 'getExaminers')
      .and.returnValue(dummyExaminers);
    getTestSlotSpy = spyOn(testSlotRepo, 'getTestSlots')
      .and.returnValue(Promise.resolve(dummyTestSlotDataset));
    getPersonalCommitmentsSpy = spyOn(personalCommitmentRepo, 'getPersonalCommitments')
      .and.returnValue(Promise.resolve(dummyPersonalCommitmentDataset));
    getNonTestActivitesSpy = spyOn(nonTestActivityRepo, 'getNonTestActivities')
      .and.returnValue(Promise.resolve(dummyNonTestActivityDataset));
    getAdvanceTestSlotsSpy = spyOn(advanceTestSlotsRepo, 'getAdvanceTestSlots')
      .and.returnValue(Promise.resolve(dummyAdvanceTestSlotDataset));
    getDeploymentsSpy = spyOn(deploymentRepo, 'getDeployments')
      .and.returnValue(Promise.resolve(dummyDeploymentDataset));
    journalBuilderSpy = spyOn(journalBuilder, 'buildJournals')
      .and.returnValue(dummyTransformedJournals);
    saveJournalsSpy = spyOn(journalRepo, 'saveJournals');
  });

  it('should retrieve all the datasets and transform into a journal and save', async () => {
    await transferDatasets();

    expect(getTestSlotSpy).toHaveBeenCalled();
    expect(getPersonalCommitmentsSpy).toHaveBeenCalled();
    expect(getNonTestActivitesSpy).toHaveBeenCalled();
    expect(getAdvanceTestSlotsSpy).toHaveBeenCalled();
    expect(getDeploymentsSpy).toHaveBeenCalled();

    const expectedDatasets = {
      testSlots: dummyTestSlotDataset,
      personalCommitments: dummyPersonalCommitmentDataset,
      nonTestActivities: dummyNonTestActivityDataset,
      advanceTestSlots: dummyAdvanceTestSlotDataset,
      deployments: dummyDeploymentDataset,
    };
    expect(journalBuilderSpy).toHaveBeenCalledWith(dummyExaminers, expectedDatasets);
    expect(saveJournalsSpy).toHaveBeenCalledWith(dummyTransformedJournals);
  });
});
