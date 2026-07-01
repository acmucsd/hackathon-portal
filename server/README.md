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

## Running tests for end-to-end Playwright tests

```bash
  cd server
  yarn run test:e2e
    # Runs the end-to-end tests.

  yarn playwright test --ui
    # Starts the interactive UI mode.

  yarn playwright test --project=chromium
    # Runs the tests only on Desktop Chrome.

  yarn playwright test example
    # Runs the tests in a specific file.

  yarn playwright test --debug
    # Runs the tests in debug mode.

  yarn playwright codegen
    # Auto generate tests with Codegen.
```