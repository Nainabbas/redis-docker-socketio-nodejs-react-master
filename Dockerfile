FROM node

WORKDIR /

COPY package*.json ./

RUN yarn install

WORKDIR /redis-events

COPY ./redis-events/package*.json ./

RUN yarn install

WORKDIR /

COPY . .

ENV NODE_ENV=production

CMD [ "npm", "start" ]