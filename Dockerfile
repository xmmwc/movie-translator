FROM node:8.9.4

COPY ./src /usr/local/movie-translator/src/
COPY ./.babelrc /usr/local/movie-translator/
COPY ./package.json /usr/local/movie-translator/

WORKDIR /usr/local/movie-translator/

RUN npm install --unsafe-perm; \
  npm run build;

EXPOSE 19564 19564

CMD [ "npm" ,"start"]