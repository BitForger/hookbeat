FROM node:latest
LABEL authors="admin"
WORKDIR /home/node

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY app.js ./

COPY src ./

RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]