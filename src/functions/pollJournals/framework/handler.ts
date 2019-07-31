import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { transferDatasets } from '../application/transfer-datasets';
import { bootstrapConfig } from './config/config';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context): Promise<Response> {
  try {
    // cache the Lambda function start time
    const startTime = new Date();

    await bootstrapConfig();
    await transferDatasets(startTime);
    return createResponse({});
  } catch (error) {
    console.error(error);
    return createResponse({}, 500);
  }
}
