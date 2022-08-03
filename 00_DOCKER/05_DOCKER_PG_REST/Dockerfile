FROM node:alpine3.11
WORKDIR /app
COPY package*.json .
# installing yarn
# RUN npm install -g yarn
# installing packages using yarn
RUN yarn

COPY . .
# building js version of our app
RUN yarn build
EXPOSE 3002

CMD ["yarn", "dev"]