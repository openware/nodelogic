FROM node:11.14.0-stretch

COPY . /home/app

WORKDIR /home/app

RUN npm i

CMD ["npm","run","start"]
