CREATE USER IF NOT EXISTS 'poller' IDENTIFIED WITH AWSAuthenticationPlugin as 'RDS';
GRANT SELECT, EXECUTE ON tarsreplica.* TO 'poller';