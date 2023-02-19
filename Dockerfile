FROM node:14 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:14 as production

LABEL org.opencontainers.image.source https://github.com/zubairss/AzureADB2C-Nest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY public public
COPY --from=development /usr/src/app/dist ./dist

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["node", "dist/main"]