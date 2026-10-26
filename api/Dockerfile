FROM node:22-alpine
USER node
WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/server.js"]
