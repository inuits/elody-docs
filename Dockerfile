# Stage 0: Development stage (source volume-mounted, runs dev server)
FROM node:22-bookworm-slim AS development-stage

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*

EXPOSE 5173

CMD ["sh", "-c", "npm install && npm run dev -- --host"]

# Stage 1: Build the VitePress documentation site
FROM node:22-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*

COPY package*.json .npmrc ./
# Mount NPM_CONFIG_REGISTRY, NPM_CONFIG__AUTH_TOKEN as build secrets
RUN --mount=type=secret,id=NPM_CONFIG_REGISTRY,uid=1000 \
    --mount=type=secret,id=NPM_CONFIG__AUTH_TOKEN,uid=1000 \
    export NPM_CONFIG_REGISTRY=$(cat /run/secrets/NPM_CONFIG_REGISTRY) && \
    export NPM_CONFIG__AUTH_TOKEN=$(cat /run/secrets/NPM_CONFIG__AUTH_TOKEN) && \
    npm ci


COPY . .
RUN npm run build

# Stage 2: Serve the static output with nginx
FROM nginx:1.28-bookworm

COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
