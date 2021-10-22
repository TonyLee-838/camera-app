FROM node:14 as base

WORKDIR /app

COPY package*.json ./


# RUN npm cache clean --force
#
RUN npm install

COPY . .

CMD ["npm","start"]

