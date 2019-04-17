# mes-data-replication-service

Service that implements polling data from the replicated database (Aurora MySQL), writing to Dynamo DB tables.

## source-db

The source database schema (Oracle) and DMS CDC grants.

## destination-db

The destination database schema (Aurora MySQL).

## E2E tests

There are some e2e tests for the journal and users pollers. These spin up DynamoDB local + MySQL in Docker to test against.

### E2E pre-requisites

In order to run the E2E tests, you need:

* A JRE (tested with Java 8)
* Docker (tested with Docker Desktop for Mac)
* A valid AWS credentials profile (either set as default or reference in the `AWS_PROFILE` envvar)

### Running E2E tests

To run the E2E tests, run:

```shell
npm run e2e
```

If you get issues starting the E2E tests due to ports already being bound, you can kill old instances of the test components by running:

```shell
npm run stack:down
```