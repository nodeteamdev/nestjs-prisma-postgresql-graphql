# nestjs-prisma-postgresql-graphql

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