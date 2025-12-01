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

- [`client`](./client/): frontend
    setup:
    1. install Node.js
    2. install yarn

    to run the system:
    1. `yarn install`
    2. `yarn dev`
