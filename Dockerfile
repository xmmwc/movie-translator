FROM node:12.16.1

ENV REDIS_URL='localhost'
ENV REDIS_PORT='6379'
ENV SERVER_PORT='19564'

WORKDIR /app

COPY package*.json .

RUN npm install

COPY .babelrc .
COPY src ./src/

RUN yarn build;

EXPOSE 19564 19564

CMD [ "node" ,"dist/server.js"]