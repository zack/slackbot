# Build Stage 1
FROM node:18.14-alpine3.17 AS base

WORKDIR /usr/src/app

COPY package.json .

COPY package-lock.json .

RUN npm install

# Build Stage 2 builder
FROM base AS builder

COPY . .

RUN npm run build

# Build Stage 3 prod
FROM node:18.14-alpine3.17 AS prod-stage

WORKDIR /usr/src/app

RUN apk upgrade --no-cache --update && \
    apk add --no-cache ca-certificates && \
    update-ca-certificates && \
    rm -rf /var/cache/apk/*


COPY package.json .

COPY package-lock.json .

COPY db ./db

RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3050

CMD [ "node" , "built/app.js"]
