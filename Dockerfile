FROM node:8.9.4

ENV REDIS_URL='localhost'
ENV REDIS_PORT='6379'
ENV SERVER_PORT='19564'

WORKDIR /app

COPY package*.json .
COPY yarn.lock .

RUN yarn

COPY .babelrc .
COPY src ./src/

RUN yarn build;

EXPOSE 19564 19564

CMD [ "node" ,"dist/server.js"]