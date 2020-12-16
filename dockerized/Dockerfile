FROM node:12

WORKDIR /usr/src/tarsym

COPY package.json ./

RUN npm install
# add sharp separately
# RUN npm install --arch=x64 --platform=linux sharp


COPY . .

EXPOSE 3000

# CMD ["npm", "run", "serve"]

RUN npm install pm2 -g
CMD ["pm2-runtime", "pm2.yml"]