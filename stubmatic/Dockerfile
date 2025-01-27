FROM node:21-alpine

WORKDIR /usr/src/app
EXPOSE 8080

RUN npm install stubmatic -g

CMD ["stubmatic", "-v", "-d", "/usr/src/app", "-c", "config.json"]
