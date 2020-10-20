FROM node:12

WORKDIR /usr/src/tarsym

COPY package.json ./

RUN npm i

COPY . .

EXPOSE 2348