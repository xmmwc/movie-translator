FROM node:12.16.1

ENV REDIS_URL='localhost'
ENV REDIS_PORT='6379'
ENV SERVER_PORT='19564'
ENV REDIS_EX_TIME='43200'
ENV SOURCE_EX_TIME = '7200'
ENV POSTER_SIZE_INDEX='4'

WORKDIR /app

ADD package.json yarn.lock ./

RUN yarn

ADD .babelrc .
ADD src ./src/

RUN yarn build;

EXPOSE 19564 19564

CMD [ "node" ,"dist/server.js"]