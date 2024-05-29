# General

This is starter of a Nest.js 10 application with Prisma ORM, PostgreSQL, Redis and GraphQL.

# Technology stack
- JWT Authentication
- Prisma ORM
- GraphQL
- Apollo Driver for GraphQL
- Docker Compose
- PostgreSQL
- Redis
- Health Check

# Providers implemented
- Prisma
- Redis (using [@nestjs/cache-manager](https://www.npmjs.com/package/@nestjs/cache-manager))

# Requirements
- Node.js >= 16 
- NPM
- Nest.js 10
- Docker
- Docker Compose

# Development

## Setup postgres Volume

1. Create volume for PostgreSQL database
```bash
docker volume create --name postgres_data0 -d local
```

## Start

0. Setup env files.

They should be in `config` folder, where you can find `.env` templates for them.

1. Install dependencies

```bash
npm install
```

2. Start DB containers

```bash
npm run db:up
```

3. Generate Prisma Types
    
```bash
npm run db:generate
```

4. Push PostgreSQL Schema 

```bash
npm run db:push
```

5. Start the application

```bash
npm run start:dev
```

# Apollo driver for GraphQL

Project is using [Apollo driver](https://www.apollographql.com/) for managing GraphQL, so by default - there's avalaible `http://localhost:3000/graphql` request, which is accessible from browser, where you can use GraphQL with auto-generated schemas, docs and write queries and mutations with autocomplete feature.

# Tests

For unit tests there's Jest module, that will look for `*.spec.ts` files.

To run tests just exec:
```bash
npm run test
```

Also, we can have set up E2E testing. With `npm run db:up` we already started a testing database, that will be used as a clean e2e environment. All e2e tests are located in `tests/e2e` folder, and should be specified in `base.e2e-spec.ts` as followed:

```ts
// base.e2e-spec.ts
describe('YourResolver (e2e)', yourTests.bind(null, ctx));

// tests/e2e/modules/yourModule/your.resolver.e2e.ts
import BaseContext from '@tests/e2e/context/base-context';

const yourTests = (ctx: BaseContext) => {
  // ...
};
```

To run them, use:
```bash
npm run test:e2e
```

Notice: When starting in E2E mode, testing db is always cleaned up before tests