import { DynamoDB } from 'aws-sdk';
import { JournalWrapper } from '../../../domain/journal-wrapper';
import { chunk } from 'lodash';
import { config } from '../../config/config';

const createDynamoClient = () => {
  return config().isOffline
    ? new DynamoDB.DocumentClient({ endpoint: 'http://localhost:8000' })
    : new DynamoDB.DocumentClient();
};

export async function saveJournals(journals: JournalWrapper[]): Promise<void> {
  console.log(`STARTING SAVE: ${new Date()}`);
  const ddb = createDynamoClient();
  const tableName = config().journalDynamodbTableName;
  const maxBatchWriteRequests = 25;
  const journalWriteBatches = chunk(journals, maxBatchWriteRequests);

  const writePromises = journalWriteBatches.map((batch) => {
    const params = {
      RequestItems: {
        [tableName]: batch.map((journalWrapper) => ({
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
