#!/usr/bin/env bash
set -euo pipefail

# Import kolekcji w formacie JSON Array do bazy mongo_database
mongoimport --host localhost --port 27017 --db mongo_database --collection TMDB --file /docker-entrypoint-initdb.d/mongo_database.TMDB.json --jsonArray

mongoimport --host localhost --port 27017 --db mongo_database --collection Users --file /docker-entrypoint-initdb.d/mongo_database.Users.json --jsonArray

mongoimport --host localhost --port 27017 --db mongo_database --collection Playlists --file /docker-entrypoint-initdb.d/mongo_database.Playlists.json --jsonArray

mongoimport --host localhost --port 27017 --db mongo_database --collection Watchlist --file /docker-entrypoint-initdb.d/mongo_database.Watchlist.json --jsonArray