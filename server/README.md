## Setup

1. Copy `.env.example` to `.env` and fill in the values
2. Add Firebase Admin credentials to a file named `firebaseServiceAccountKey.json`, at the same level as the `.env` file.
3. Start up Docker Desktop
4. Spin up Postgres:

```bash
docker-compose --env-file .env up
```

## Directly querying Postgres on a local build using `psql`

psql -h localhost -p 5432 -U acmucsd_dev -d hackathon_portal
