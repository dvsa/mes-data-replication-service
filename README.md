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

## Integration tests
There are some integration tests in the solution. These spin up DynamoDB local + require MySQL in Docker to test against.

### Integration pre-requisites
In order to run the integration tests, you need:

* A JRE (tested with Java 8)
* Docker (tested with Docker Desktop for Mac)

### Running integration tests

To run the integration tests, open a cmd window and change to the e2e directory and run 

docker-compose up --build

In a separate window 
run:

```shell
npm run test:int
```

If you get issues starting the integration tests due to ports already being bound, you can kill old instances of the test components by running:

```shell
npm run stack:down
```

remember to run 

```shell
docker-compose down
```
 to clean up the docker container.
## E2E tests

There are some e2e tests for the journal and users pollers. These spin up DynamoDB local + MySQL in Docker to test against.

### E2E pre-requisites

In order to run the E2E tests, you need:

* A JRE (tested with Java 8)
* Docker (tested with Docker Desktop for Mac)
* A valid AWS credentials profile (either set as default or reference in the `AWS_PROFILE` envvar)

### Running E2E tests

To run the E2E tests, open a cmd window and change to the e2e directory and run 

docker-compose up --build

In a separate window 
run:

```shell
npm run e2e
```

If you get issues starting the E2E tests due to ports already being bound, you can kill old instances of the test components by running:

```shell
npm run stack:down
```

remember to run 

```shell
docker-compose down
```
 to clean up the docker container.
