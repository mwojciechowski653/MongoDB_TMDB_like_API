# TMDB-like API — MongoDB + Express.js (Docker)

> Polish version below / Wersja polska poniżej

Final project for the **Databases 2** course, focused on topics related to non-relational databases (NoSQL), in particular MongoDB and Neo4j. The application provides a REST API based on **Express.js** and **MongoDB**, with data inspired by the_movie_database ([TMDB](https://www.themoviedb.org/)). Everything runs inside Docker containers.

## Architecture

- **API**: Node.js + Express (`server.js`, routes in `routes/*`).
- **Database**: MongoDB (`mongo`), database name: `mongo_database`.
- **Seed data**: `database_init/mongo_database.{TMDB,Users,Playlists,Watchlist}.json` (automatically imported on first run).

## Running the Project

1. Clone the repository:

```bash
git clone https://github.com/mwojciechowski653/mongodb-tmdb-like-api.git
cd mongodb-tmdb-like-api
```

2. Build and start containers:

```bash
docker compose up -d --build

# API: http://localhost:5000
# MongoDB: mongodb://localhost:27017/mongo_database
```

**Database URL inside the Docker network (used by the API service):** `mongodb://mongo:27017` (database selected in code: `client.db("mongo_database")`).

## Endpoints (overview)

The following table shows API paths and methods. Details (parameters, request bodies) can be found in the **Postman** collections inside the `postman_queries/` folder.

| Method | Path                                 |
| ------ | ------------------------------------ |
|        | Admin                                |
| GET    | `/admin/users`                       |
| PUT    | `/admin/users/:userId`               |
| POST   | `/admin/movies`                      |
| DELETE | `/admin/movies/:movieId`             |
| PUT    | `/admin/movies/:movieId`             |
|        | Playlists                            |
| GET    | `/playlists`                         |
| POST   | `/playlists`                         |
| PUT    | `/playlists/:playlistsId`            |
| DELETE | `/playlists/:playlistsId`            |
|        | Recommendations                      |
| POST   | `/movie/watched`                     |
| GET    | `/recommendations`                   |
|        | Reviews                              |
| GET    | `/movies/:movieId/reviews`           |
| POST   | `/movies/:movieId/reviews`           |
| DELETE | `/movies/:movieId/reviews/:reviewId` |
|        | Tmdb                                 |
| GET    | `/tmdb`                              |
| GET    | `/tmdb/movies/popular`               |
| GET    | `/tmdb/movies/:id`                   |
| GET    | `/tmdb/movies/search`                |
| GET    | `/tmdb/movies/genres`                |
|        | Users                                |
| GET    | `/users`                             |
| POST   | `/users/register`                    |
| POST   | `/users/login`                       |
| GET    | `/users/profile`                     |
| PUT    | `/users/profile`                     |
| GET    | `/users/:userId/stats`               |
|        | Watchlist                            |
| GET    | `/watchlist`                         |
| POST   | `/watchlist`                         |
| DELETE | `/watchlist/:movieid`                |

### Postman collections

The repository includes ready-to-use Postman collections in the `postman_queries/` folder.  
You can import them directly into Postman and run requests.

## Resetting data

```bash
docker compose down
rm -rf mongo-data
docker compose up -d --build
```

## Author

- **Marcin Wojciechowski**
  [GitHub](https://github.com/mwojciechowski653)

## License

This project is licensed under the **MIT** license.
The full license text can be found in the [LICENSE](LICENSE) file.

In short: you are free to use, copy, modify, and distribute this code under the MIT terms. The software is provided “as is”, without any warranty.

---

# TMDB-like API — MongoDB + Express.js (Docker) wersja po polsku

Projekt zaliczeniowy z przedmiotu **Bazy Danych 2**, który dotyczył zagadnień związanych z nierelacyjnymi bazami danych (typu NoSQL), w szczególności MongoDB i Neo4j. Aplikacja udostępnia REST API oparte na **Express.js** i bazie **MongoDB**, z danymi wzorowanymi na the_movie_database ([TMDB](https://www.themoviedb.org/)). Całość uruchamiana w kontenerach Docker.

## Architektura

- **API**: Node.js + Express (`server.js`, route'y w `routes/*`).
- **Baza**: MongoDB (`mongo`), nazwa bazy: `mongo_database`.
- **Dane startowe**: `database_init/mongo_database.{TMDB,Users,Playlists,Watchlist}.json` (importowane automatycznie przy pierwszym starcie).

## Uruchomienie projektu

1. Sklonuj repozytorium:

```bash
git clone https://github.com/mwojciechowski653/mongodb-tmdb-like-api.git
cd mongodb-tmdb-like-api
```

2. Zbuduj i uruchom kontenery:

```bash
docker compose up -d --build

# API: http://localhost:5000
# MongoDB: mongodb://localhost:27017/mongo_database
```

**URL bazy danych w sieci dockerowej (używany przez serwis API):** `mongodb://mongo:27017` (DB wybierana w kodzie: `client.db("mongo_database")`).

## Endpointy (skrót)

Poniższa tabela przedstawia ścieżki i metody API. Szczegóły (parametry, body) znajdziesz w kolekcjach **Postmana** w folderze `postman_queries/`.

| Metoda | Fragment URL                         |
| ------ | ------------------------------------ |
|        | Admin                                |
| GET    | `/admin/users`                       |
| PUT    | `/admin/users/:userId`               |
| POST   | `/admin/movies`                      |
| DELETE | `/admin/movies/:movieId`             |
| PUT    | `/admin/movies/:movieId`             |
|        | Playlisty                            |
| GET    | `/playlists`                         |
| POST   | `/playlists`                         |
| PUT    | `/playlists/:playlistsId`            |
| DELETE | `/playlists/:playlistsId`            |
|        | Rekomendacje                         |
| POST   | `/movie/watched`                     |
| GET    | `/recommendations`                   |
|        | Recenzje                             |
| GET    | `/movies/:movieId/reviews`           |
| POST   | `/movies/:movieId/reviews`           |
| DELETE | `/movies/:movieId/reviews/:reviewId` |
|        | Tmdb                                 |
| GET    | `/tmdb`                              |
| GET    | `/tmdb/movies/popular`               |
| GET    | `/tmdb/movies/:id`                   |
| GET    | `/tmdb/movies/search`                |
| GET    | `/tmdb/movies/genres`                |
|        | Użytkownicy                          |
| GET    | `/users`                             |
| POST   | `/users/register`                    |
| POST   | `/users/login`                       |
| GET    | `/users/profile`                     |
| PUT    | `/users/profile`                     |
| GET    | `/users/:userId/stats`               |
|        | Playlisty "do zobaczenia później"    |
| GET    | `/watchlist`                         |
| POST   | `/watchlist`                         |
| DELETE | `/watchlist/:movieid`                |

### Kolekcje Postmana

W repozytorium znajdują się gotowe kolekcje Postmana w folderze `postman_queries/`.  
Możesz je zaimportować bezpośrednio do Postmana i wykonywać żądania.

## Reset danych

```bash
docker compose down
rm -rf mongo-data
docker compose up -d --build
```

## Autor

- **Marcin Wojciechowski**  
  [GitHub](https://github.com/mwojciechowski653)

## Licencja

Projekt jest udostępniany na licencji **MIT**.  
Pełny tekst licencji znajdziesz w pliku [LICENSE](LICENSE).

W skrócie: możesz używać, kopiować, modyfikować i rozpowszechniać ten kod na warunkach MIT. Oprogramowanie dostarczane jest „tak jak jest”, bez żadnych gwarancji.
