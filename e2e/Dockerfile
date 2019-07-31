FROM mysql:5.7

ENV DOCKERIZE_VERSION v0.6.0
RUN apt-get update -y && apt-get install -y wget
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

CMD dockerize -wait tcp://mes-data-replication-service-e2e-mysql:3306 -timeout 60m \
    cat /Script0_CreateTables.sql Script3_GenerateCalendarData.sql Script4_GenerateReferenceData.sql | mysql -u root -pPa55word1 -h mes-data-replication-service-e2e-mysql
