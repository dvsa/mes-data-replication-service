import { handler } from '../handler';
import { APIGatewayEvent, Context } from 'aws-lambda';
import * as createResponse from '../../../../common/application/utils/createResponse';
import { Mock, It, Times } from 'typemoq';
const lambdaTestUtils = require('aws-lambda-test-utils');
import Response from '../../../../common/application/api/Response';

describe('pollJournals handler', () => {
  let dummyApigwEvent: APIGatewayEvent;
  let dummyContext: Context;

  const moqCreateResponse = Mock.ofInstance(createResponse.default);

  const moqResponse = Mock.ofType<Response>();

  beforeEach(() => {
    moqCreateResponse.reset();
    moqResponse.reset();

    moqResponse.setup((x: any) => x.then).returns(() => undefined);

    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent();
    dummyContext = lambdaTestUtils.mockContextCreator(() => null);

    moqCreateResponse.setup((x) => x(It.isAny())).returns(() => moqResponse.object);
    moqCreateResponse.setup((x) => x(It.isAny(), It.isAny())).returns(() => moqResponse.object);

    spyOn(createResponse, 'default').and.callFake(moqCreateResponse.object);
  });

  it('should return a blank response', async () => {
    const result = await handler(dummyApigwEvent, dummyContext);

    moqCreateResponse.verify((x) => x(It.isValue({})), Times.once());
    expect(result).toBe(moqResponse.object);
  });

});
