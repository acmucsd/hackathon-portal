FROM node:20.18.0 AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20.18.0-alpine3.19
WORKDIR /app
COPY --from=build /app /app
EXPOSE 4000
CMD ["yarn", "release"]
