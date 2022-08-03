FROM node:alpine3.11
WORKDIR /app
COPY package*.json .
RUN yarn
COPY . .
RUN yarn build
EXPOSE 3001
CMD ["yarn", "dev"]