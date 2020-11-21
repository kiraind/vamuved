FROM node:14.15.1-alpine3.12

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
