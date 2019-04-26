# mes-data-replication-service

Service that implements polling data from the replicated database (Aurora MySQL), writing to Dynamo DB tables.

## source-db

The source database schema (Oracle) and DMS CDC grants.

## destination-db

The destination database schema (Aurora MySQL).  Contains the following two sub-folders:

### sample-data-load

These scripts should be run sequentially on a non-integrated Aurora MySQL environment to create the tables and seed them with some sample data scenarios. Further details can be found at https://wiki.i-env.net/display/MES/TARS+Replica+-+Sample+Journal+Data

### post-data-load

These should be run after the scripts in sample-data-load (for a non-integrated environment) or after DMS has set up and initial load completed (for a TARS integrated environment).  Further details can be found at https://wiki.i-env.net/display/MES/TARS+Replica+-+Database+Objects

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