import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { getExaminers } from './repo/mysql/examiner-repository';
import { getTestSlots } from './repo/mysql/test-slot-repository';
import * as mysql from 'mysql';
import { chunk } from 'lodash';
import { getNonTestActivities } from './repo/mysql/non-test-activity-repository';
import { getPersonalCommitments } from './repo/mysql/personal-commitment-repository';
import { getAdvanceTestSlots } from './repo/mysql/advance-test-slots-repository';
import { getDeployments } from './repo/mysql/deployment-repository';
import { transform } from '../applications/transformer';
import { ExaminerAdvanceTestSlot } from '../domain/examiner-advance-test-slot';
import { ExaminerDeployment } from '../domain/examiner-deployment';
import { ExaminerNonTestActivity } from '../domain/examiner-non-test-activity';
import { ExaminerPersonalCommitment } from '../domain/examiner-personal-commitment';
import { ExaminerTestSlot } from '../domain/examiner-test-slot';
import { JournalWrapper } from '../domain/journal-wrapper';
import { saveJournals } from './repo/dynamodb/journal-repository';

export interface AllDatasets {
  testSlots: ExaminerTestSlot[];
  personalCommitments: ExaminerPersonalCommitment[];
  nonTestActivities: ExaminerNonTestActivity[];
  advanceTestSlots: ExaminerAdvanceTestSlot[];
  deployments: ExaminerDeployment[];
}

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context): Promise<Response> {
  const examinerBatchSize = Number.parseInt(process.env.EXAMINER_BATCH_SIZE || '250', 10);
  const pool: mysql.Pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    connectionLimit: 50,
  });

  console.log(`STARTING QUERY PHASE: ${new Date()}`);
  const examiners = await getExaminers(pool);
  const examinerIds = examiners.map(examiner => examiner.individual_id);
  const examinerIdGroups = chunk(examinerIds, examinerBatchSize);

  const queryResults = await Promise.all([
    getTestSlots(pool, examinerIdGroups),
    getPersonalCommitments(pool),
    getNonTestActivities(pool),
    getAdvanceTestSlots(pool),
    getDeployments(pool),
  ]);

  const datasets: AllDatasets = {
    testSlots: queryResults[0],
    personalCommitments: queryResults[1],
    nonTestActivities: queryResults[2],
    advanceTestSlots: queryResults[3],
    deployments: queryResults[4],
  };
  console.log(`FINISHED QUERY PHASE: ${new Date()}`);
  console.log(`STARTING TRANSFORM PHASE: ${new Date()}`);
  const journals: JournalWrapper[] = transform(examiners, datasets);
  console.log(`FINISHED TRANFORM PHASE: ${new Date()}`);

  await saveJournals(journals);
  console.log(`FINISHED SAVE PHASE: ${new Date()}`);

  return createResponse({});
}
