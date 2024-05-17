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

# Development

## Postgres Volume

1. Create volume for PostgreSQL database
```bash
docker volume create --name postgres_data0 -d local
```

2. Start the Docker containers using docker-compose
```bash
docker-compose up -d
```

## Start
1. Install dependencies

```
npm install
```

...