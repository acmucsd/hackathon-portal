## Setup
1. Copy `.env.example` to `.env` and fill in the values
1. Start up Docker Desktop
2. Spin up Postgres:
```bash
docker-compose --env-file .env up
```

## Directly querying Postgres on a local build using `psql`
psql -h localhost -p 5432 -U acmucsd_dev -d hackathon_portal