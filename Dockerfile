FROM node:14.15.0-alpine
MAINTAINER charzhou

EXPOSE 40078/tcp
EXPOSE 40079/tcp

COPY ./ /app
WORKDIR /app

RUN npm install --only=production --registry=http://npm-rep.fjtjg.com:7001/
RUN apk add curl

HEALTHCHECK --interval=5s --timeout=3s --retries=12 CMD curl --silent --fail localhost:40078/test/test || exit 1

CMD ["npm","run","dev"]


