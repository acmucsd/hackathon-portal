FROM node:22.23.1 AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:22.23.1-alpine3.24
WORKDIR /app
COPY --from=build /app /app
EXPOSE 4000
CMD ["yarn", "release"]
