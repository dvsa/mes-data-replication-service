import { DynamoDB } from 'aws-sdk';
import { JournalWrapper } from '../../../domain/journal-wrapper';
import { chunk } from 'lodash';

const createDynamoClient = () => {
  return process.env.IS_OFFLINE
    ? new DynamoDB.DocumentClient({ endpoint: 'http://localhost:8000' })
    : new DynamoDB.DocumentClient();
};

const ddb = createDynamoClient();
const tableName = getJournalTableName();

export async function saveJournals(journals: JournalWrapper[]): Promise<void> {
  console.log(`STARTING SAVE: ${new Date()}`);
  const maxBatchWriteRequests = 25;
  const journalWriteBatches = chunk(journals, maxBatchWriteRequests);

  const writePromises = journalWriteBatches.map((batch) => {
    const params = {
      RequestItems: {
        [tableName]: batch.map(journalWrapper => ({
          PutRequest: {
            Item: journalWrapper,
          },
        })),
      },
    };
    return ddb.batchWrite(params).promise();
  });
  await Promise.all(writePromises);
  console.log(`END SAVE: ${new Date()}`);
}

function getJournalTableName(): string {
  let tableName = process.env.JOURNALS_DDB_TABLE_NAME;
  if (tableName === undefined || tableName.length === 0) {
    tableName = 'journals';
  }
  return tableName;
}
