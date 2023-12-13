FROM node:21

RUN mkdir /frontend

WORKDIR /frontend

COPY package.json /frontend

RUN npm install

COPY package-lock.json /frontend

COPY ./public /frontend/public

COPY ./src /frontend/src

EXPOSE 3000

CMD ["npm", "start"]