import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { transferDatasets } from '../application/transfer-datasets';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context): Promise<Response> {
  await transferDatasets();
  return createResponse({});
}
