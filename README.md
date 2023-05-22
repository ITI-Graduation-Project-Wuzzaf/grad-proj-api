# Jobify Rest API ☕

Rest API using Node, express, and postgres for ITI graduation project (jobify), which is a job portal application to connect job seekers and recruiters together.

## Table of Contents

- [Technologies](#technologies)
- [Data Shape](#data-shape)
- [Installation](#installation)
- [Using Docker](#using-docker)
- [Usage](#usage)
- [Testing](#testing)
- [Feedback](#feedback)

## Technologies

- [Postgres](https://www.postgresql.org/) - Powerful, open source object-relational database.
- [Node](https://nodejs.org) - Javascript Runtime
- [Express](https://expressjs.com/) - Javascript API Framework
- [TypeScript](https://www.typescriptlang.org/) - Superset of Javascript

## Data Shape

this is still under progress

## Installation

### 1) Clone the repository, install node packages.

```
//on local
git clone https://github.com/ITI-Graduation-Project-Wuzzaf/grad-proj-api
cd backend
npm install
```

### 2) Setting database and user.

For setting up postgres you will need:

1. Create a database for the project.
2. Ensure to have user with privileges to the database.
3. Run migration script `npm run migration:dev`
4. Run seeding script `npm run seed:run` (Optional)

### 3) Environment variables.

To run this project, you will need to add the following environment variables to your .env file

- Database: `POSTGRES_HOST`
  `POSTGRES_PORT`
  `POSTGRES_USER`
  `POSTGRES_PASSWORD`
  `POSTGRES_DB`
  `POSTGRES_DB_TEST`

- JWT: `JWT_SECRET`
  `JWT_ACCESS_EXPIRY`

- Hashing: `SR`
  `PEPPER`

## Using Docker

to start the server with docker you will need to add 2 more environment variables for pgadmin
`PGADMIN_DEFAULT_EMAIL`
and
`PGADMIN_DEFAULT_PASSWORD`
to be able to login into pgadmin
then run

`docker compose up --build`
and you are good to go

## Usage

### Scripts

Make sure you are inside backend folder to be able to run the following scripts.

```
npm start                   - runs the app in production

npm run start:dev           - runs the app watch mode in typescript

npm run start:debug         - runs the app with debugging


npm run build               - compiles typescript to javascript (./dist)



npm run migration:dev        - runs migrations

npm run seed:run             - seeding tables


npm test                     - jest tests in watch mode

npm run test:ci              - runs tests once

npm run test:coverage        - output coverage of the tests


npm run lint                 - linting script
npm run format               - format code with prettier
```

### Endpoints

| Method | Path                       | Description                                   |
| ------ | -------------------------- | --------------------------------------------- |
| GET    | /api-docs                  | Swagger API documentation                     |
| POST   | /v1/signup                 | Signing up                                    |
| POST   | /v1/login                  | login                                         |
| GET    | /v1/profiles/{id}          | retrive user profile                          |
| PATCH  | /v1/profiles               | update current user profile                   |
| POST   | /v1/employers              | signup as an employer                         |
| GET    | /v1/employers/{id}         | retrive employer data                         |
| PATCH  | /v1/employers              | update employer data                          |
| GET    | /v1/jobs                   | fetch all jobs                                |
| POST   | /v1/jobs                   | create new job posting                        |
| GET    | /v1/jobs/{id}              | retrive a job posting data                    |
| PATCH  | /v1/jobs/{id}              | update job posting data                       |
| DELETE | /v1/jobs/{id}              | delete job posting                            |
| GET    | /v1/jobs/{id}/applications | fetch all applications for a job              |
| GET    | /v1/users/applications     | retrives all the user applications            |
| GET    | /v1/applications/{id}      | retrive an application data                   |
| POST   | /v1/applications           | apply for a job, and create a new application |
| PATCH  | /v1/applications/{id}      | update submitted application                  |

## Testing

### Unit Tests:

Unit tests are implemented using jest.

> Note: `still under progress`.

```bash
  npm run test
```

## Feedback

If you have any feedback, please reach out to me at baselsalah2053@gmail.com
