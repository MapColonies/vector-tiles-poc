#!/bin/bash

docker network create vector-tiles
docker run -d --name vector-tiles-pg -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_DBNAME=osm -e POSTGRES_PASS=postgres --network vector-tiles kartoza/postgis:14
wget --directory-prefix=./osm2pgsql https://download.geofabrik.de/asia/israel-and-palestine-latest.osm.pbf
docker run --rm -e PGPASSWORD=postgres --name vector-tiles-osm2pgsql -v $(pwd)/osm2pgsql:/data --entrypoint=osm2pgsql --network vector-tiles acrarolibotnonprod.azurecr.io/osm2pgsql-wrapper:forever-1 -c -O flex -S /data/script.lua -d osm -H vector-tiles-pg -U postgres /data/israel-and-palestine-latest.osm.pbf
docker run -d --name vector-tiles-tipg --env-file=tipg/env -p 8080:8080 --network vector-tiles ghcr.io/developmentseed/tipg:0.5.6
