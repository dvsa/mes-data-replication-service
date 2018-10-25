# mes-data-replication-service

Service that implements data replication from the TARS source database (Oracle) to target database (Aurora MySQL), for data required by the Mobile Examiner system (primarily Journal Data).

## source

The source database schema (Oracle) and DMS CDC grants.

## destination

The destination database schema (Aurora MySQL).

## dms-configurator

A small node.js CLI app to generate DMS task JSON configurations from much simpler logical input.
Will be re-used within a periodic Lambda.
