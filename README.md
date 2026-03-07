# Hackathon Portal

## Repo Structure

- [`server`](./server/): backend

    setup:
    1. install Node.js
    2. install yarn
    3. install Postgres (Even though our actual Postgres instance runs in a Docker container, we need to install Postgres to install the official pg Node package.)
    4. install docker (we run Postgres in docker container)

    to run the system: (in terminal)
    1. `yarn install`
    2. `cp .env.example .env` (you might need to add more info on env(such as S3_REGION) enable to run the system)
    3. `docker-compose up -d`
    4. `yarn run db:migrate`  
    5. `yarn dev`  

    (If PostgreSQL is running both locally and in Docker, the backend may connect to the local database by mistake, causing errors like `database "acmucsd_dev" does not exist.` To fix this, stop the local PostgreSQL service and restart the backend. )

    often used command:
    open PostgreSQL:
    docker exec -it rds.hackathon.acmucsd.local psql -U acmucsd_dev -d hackathon_portal

- [`client`](./client/): frontend
    setup:
    1. install Node.js
    2. install yarn

    to run the system:
    1. `yarn install`
    2. `yarn dev`

