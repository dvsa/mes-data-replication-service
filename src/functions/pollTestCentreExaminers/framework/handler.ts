import { bootstrapLogging, error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import Response from '../../../common/application/api/Response';
import createResponse from '../../../common/application/utils/createResponse';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import { bootstrapTestCentreConfig } from './config';
import { transferTestCentreExaminers } from '../domain/transfer-test-centre-examiners';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context): Promise<Response> {
  try {
    console.log('Invoked Test Centre lambda');
    bootstrapLogging('test-centre-poller', event);
    console.log('bootstrapTestCentreConfig');
    await bootstrapTestCentreConfig();
    console.log('transferTestCentreExaminers');
    await transferTestCentreExaminers();
    return createResponse({});
  } catch (err) {
    error(err);
    return createResponse({}, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
