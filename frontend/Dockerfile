FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY shared/package.json shared/package.json

RUN npm ci

COPY shared ./shared
COPY frontend ./frontend

RUN npm run --workspace shared run build
RUN npm run --workspace frontend run build

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY shared/package.json shared/package.json

RUN npm ci --omit=dev

COPY --from=builder /app/shared/dist /app/shared/dist
COPY --from=builder /app/frontend/.next /app/frontend/.next
COPY --from=builder /app/frontend/public /app/frontend/public
COPY --from=builder /app/frontend/next.config.mjs /app/frontend/next.config.mjs

CMD ["npm", "--workspace", "frontend", "run", "start", "--", "-p", "3000"]
