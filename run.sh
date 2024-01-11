#!/bin/bash

# docker network create vector-tiles
# docker run -d --name vector-tiles-pg -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_DBNAME=osm -e POSTGRES_PASS=postgres --network vector-tiles kartoza/postgis:14
# wget --directory-prefix=./osm2pgsql https://download.geofabrik.de/asia/israel-and-palestine-latest.osm.pbf
# docker run --rm -e PGPASSWORD=postgres --name vector-tiles-osm2pgsql -v $(pwd)/osm2pgsql:/data --entrypoint=osm2pgsql --network vector-tiles acrarolibotnonprod.azurecr.io/osm2pgsql-wrapper:forever-1 -c -O flex -S /data/script.lua -d osm -H vector-tiles-pg -U postgres /data/israel-and-palestine-latest.osm.pbf
# docker run -d --name vector-tiles-tipg --env-file=tipg/env -p 8080:8080 --network vector-tiles ghcr.io/developmentseed/tipg:0.5.6
docker run -d --name vector-tiles-pg-tileserv -p 7800:7800 --network vector-tiles -v $(pwd)/pg-tileserv:/tmp -e DATABASE_URL=postgresql://postgres:postgres@vector-tiles-pg/osm pg_tileserv --config /tmp/pg_tileserv.toml
docker run \
  --name vector-tiles-martin -d --network vector-tiles \
  -v $(pwd)/martin:/tmp \
  -p 4000:3000 \
  ghcr.io/maplibre/martin --config /tmp/config.yaml

docker run \
  --name vector-tiles-t-rex -d --network vector-tiles \
  -v $(pwd)/t-rex:/tmp \
  -p 9090:9090 \
  sourcepole/t-rex:v0.14.3 serve --config /tmp/config.toml

docker run \
  --name vector-tiles-tegola -d --network vector-tiles \
  -v $(pwd)/tegola:/tmp \
  -p 7070:7070 \
  gospatial/tegola:v0.19.0 serve --config /tmp/tegola.toml
