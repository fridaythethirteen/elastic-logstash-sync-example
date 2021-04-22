## DOCKER COMPOSE + ELASTICSEARCH + LOGSTASH

### Description

This repository compose of example of how to setup logstash with elastic search over docker compose for pushing data from files using logstash plugin 

### Pre-requesties

(Docker)[https://www.docker.com/]


#### How to run

```bash
docker-compose up --build # if not build previously
```

#### Swagger docs api

http://localhost:8888/api/docs

#### Common Issue while running elastic search

If you face issue like: `too_many_requests/12/disk usage exceeded flood-stage watermark index has read-only-allow-delete dockerise`

Then use the following curl to update the elastic search settings

```bash
curl --location --request PUT 'http://localhost:9200/_all/_settings' \
--header 'Content-Type: application/json' \
--header 'Cookie: storeInfo=mafpak|en|PAK' \
--data-raw '{"index.blocks.read_only_allow_delete": null}'
``` 


```bash
curl --location --request PUT 'http://localhost:9200/_cluster/settings' \
--header 'Content-Type: application/json' \
--header 'Cookie: storeInfo=mafpak|en|PAK' \
--data-raw '{ "transient": { "cluster.routing.allocation.disk.threshold_enabled": false } }'
```