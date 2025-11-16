FROM node:20-alpine

WORKDIR /app

COPY package*json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE ${APP_PORT}

CMD ["npm", "run", "preview"]