import { handler } from '../handler';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
const lambdaTestUtils = require('aws-lambda-test-utils');
import * as examinerRepo from '../repo/mysql/examiner-repository';
import * as testSlotRepo from '../repo/mysql/test-slot-repository';
import * as personalCommitmentRepo from '../repo/mysql/personal-commitment-repository';
import * as nonTestActivityRepo from '../repo/mysql/non-test-activity-repository';
import * as advanceTestSlotsRepo from '../repo/mysql/advance-test-slots-repository';
import * as deploymentRepo from '../repo/mysql/deployment-repository';
import * as journalRepo from '../repo/dynamodb/journal-repository';
import * as transformer from '../../application/transformer';

const dummyNonTestActivityDataset = [{ examinerId: 3, nonTestActivity: {} }];
const dummyAdvanceTestSlotDataset = [{ examinerId: 4, advanceTestSlot: {} }];
const dummyDeploymentDataset = [{ examinerId: 5, deployment: {} }];
describe('pollJournals handler', () => {
  let dummyApigwEvent: APIGatewayProxyEvent;
  let dummyContext: Context;

  let getTestSlotSpy: jasmine.Spy;
  let getPersonalCommitmentsSpy: jasmine.Spy;
  let getNonTestActivitesSpy: jasmine.Spy;
  let getAdvanceTestSlotsSpy: jasmine.Spy;
  let getDeploymentsSpy: jasmine.Spy;
  let transformerSpy: jasmine.Spy;
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

  beforeEach(() => {
    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent();
    dummyContext = lambdaTestUtils.mockContextCreator(() => null);
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
    transformerSpy = spyOn(transformer, 'transform')
      .and.returnValue(dummyTransformedJournals);
    saveJournalsSpy = spyOn(journalRepo, 'saveJournals');
  });

  it('should retrieve all the datasets and transform into a journal and save', async () => {
    await handler(dummyApigwEvent, dummyContext);

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
    expect(transformerSpy).toHaveBeenCalledWith(dummyExaminers, expectedDatasets);
    expect(saveJournalsSpy).toHaveBeenCalledWith(dummyTransformedJournals);
  });
});
