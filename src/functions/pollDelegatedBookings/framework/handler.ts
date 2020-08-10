import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import Response from '../../../common/application/api/Response';
import createResponse from '../../../common/application/utils/createResponse';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import { bootstrapLogging } from '@dvsa/mes-microservice-common/application/utils/logger';
import { bootstrapDelegatedExaminerConfig } from './config/config';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context): Promise<Response> {
  try {
    bootstrapLogging('delegated-bookings-poller', event);
    await bootstrapDelegatedExaminerConfig();
    return createResponse({});
  } catch (err) {
    return createResponse({}, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
