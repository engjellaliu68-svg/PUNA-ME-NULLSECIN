FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY shared/package.json shared/package.json

RUN npm ci

COPY shared ./shared
COPY backend ./backend

RUN npm run --workspace shared run build
RUN npm run --workspace backend run build

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY shared/package.json shared/package.json

RUN npm ci --omit=dev

COPY --from=builder /app/shared/dist /app/shared/dist
COPY --from=builder /app/backend/dist /app/backend/dist

CMD ["node", "backend/dist/main.js"]
