FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
COPY docker.env ./dist/.env
WORKDIR ./dist/
ENV NODE_ENV
EXPOSE 8080
CMD ["node","server.js"]