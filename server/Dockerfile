FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
WORKDIR ./dist/
COPY docker.env .env
EXPOSE 8000
CMD ["node","server.js"]

