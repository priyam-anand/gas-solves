#build
FROM node:16-alpine AS build

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

#prod from build
FROM node:16-alpine

WORKDIR /usr/src/app

COPY --from=build ./usr/src/app/dist ./dist

COPY --from=build ./usr/src/app/package*.json ./

COPY --from=build usr/src/app/env/.env.prod ./env/

RUN npm ci --only=production

RUN rm package-lock.json

EXPOSE 3000

CMD ["npm", "run", "start:prod"]