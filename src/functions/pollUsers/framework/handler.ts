import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { bootstrapConfig } from '../../pollUsers/framework/config';
import { transferUsers } from '../domain/transferUsers';
import { HttpStatus } from '../../../common/application/api/HttpStatus';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context): Promise<Response> {
  try {
    await bootstrapConfig();
    await transferUsers();
    return createResponse({});
  } catch (error) {
    console.error(error);
    return createResponse({}, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
