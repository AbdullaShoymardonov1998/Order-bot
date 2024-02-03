FROM node:16.16.0-alpine

RUN mkdir app

WORKDIR app

COPY package*.json ./

RUN npm install

COPY . ./

ENV HOST=0.0.0.0

CMD ["node", "src/index.js"]
