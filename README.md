# Jobify Rest API ☕

Rest API using Node, express, and postgres for ITI graduation project (jobify), which is a job portal application to connect job seekers and recruiters together.

## Table of Contents

- [Technologies](#technologies)
- [Data Shape](#data-shape)
- [Installation](#installation)
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

- JWT:  `JWT_SECRET`
`JWT_ACCESS_EXPIRY`

- Hashing: `SR`
`PEPPER`

## Usage

### Scripts

### Endpoints

## Testing

### Unit Tests:

Unit tests are implemented using jest.

> Note: `still under progress`.

```bash
  npm run test
```

## Feedback

If you have any feedback, please reach out to me at baselsalah2053@gmail.com
