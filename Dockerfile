FROM node:alpine

WORKDIR /deliverymuch/api

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]