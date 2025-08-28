FROM node:20-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production \
PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]