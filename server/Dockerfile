FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
WORKDIR ./dist/
EXPOSE 8080
CMD ["node","server.js"]