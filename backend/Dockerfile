FROM node:14

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

ADD . /usr/src/app

RUN npm run build

ENV NODE_ENV=production

CMD ["npm", "start"]

EXPOSE 5050
