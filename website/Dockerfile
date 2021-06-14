# Builder Image
# =============
# Download tools, install and compile dependencies.
FROM node:16.2.0-alpine as builder

WORKDIR /usr/src/app

# Create dedicated user.
RUN addgroup -S hello && \
    adduser -D -G hello -S hello && \
    chown hello:hello /usr/src/app

USER hello:hello

# Install dependencies.
COPY --chown=hello:hello package.json package-lock.json /usr/src/app/
RUN npm ci && \
    npm cache clean --force

# Build the application.
COPY --chown=hello:hello ./ /usr/src/app/
RUN npm run build

# Production Image
# ================
FROM nginx:1.21.0-alpine

COPY --chown=nobody:nobody --from=builder /usr/src/app/dist/website/ /usr/share/nginx/html/
