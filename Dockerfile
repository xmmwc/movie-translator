FROM node:8.9.4

RUN apt-get update; \
  apt-get install -y vim;

ENV REDIS_URL='localhost'
ENV REDIS_PORT='6379'
ENV SERVER_PORT='19564'

WORKDIR /app

COPY package*.json /app
COPY .bablerc /app
COPY src /app/src/

RUN npm install --unsafe-perm; \
  npm run build;

EXPOSE 19564 19564

CMD [ "node" ,"dist/server.js"]