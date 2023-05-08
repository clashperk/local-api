FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=deps /app/dist ./dist

CMD ["node", "--trace-warnings", "--enable-source-maps", "dist/index.js"]
