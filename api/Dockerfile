# Builder Image
# =============
# Download tools, install and compile dependencies.
FROM node:16.2.0-alpine as builder

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Create dedicated user.
RUN addgroup -S hello && \
    adduser -D -G hello -S hello && \
    chown hello:hello /usr/src/app

USER hello:hello

# Install dependencies.
COPY --chown=hello:hello package.json package-lock.json /usr/src/app/
RUN npm ci && \
    npm prune --production && \
    npm cache clean --force

# Production Image
# ================
FROM node:16.2.0-alpine

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /usr/src/app

# Create dedicated user.
RUN addgroup -S hello && \
    adduser -D -G hello -S hello && \
    chown hello:hello /usr/src/app

USER hello:hello

COPY --chown=hello:hello --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=hello:hello ./ /usr/src/app

EXPOSE 3000

CMD [ "node", "./bin/www" ]
