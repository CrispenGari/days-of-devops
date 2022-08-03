### Using Docker

In this example we are going to learn practically how we can use docker to develop a simple rest api. In this example we are to create an express application and use it to store data in a `mongodb` database.

### Express application

We are going to create a simple rest application that will store todos in a mongodb database. So to initialize our node backend application we will use the [initialiseur](https://github.com/CrispenGari/initialiseur) `init` command as follows.

```shell
initialiseur init
```

Next we will need to install the `mongoose` by which is a mongodb driver that will allows us to work with mongodb and nodejs as follows:

```shell
yarn add mongoose
```

Next we will create a `models` folder and inside that we will create an `index.ts` file and populate it with the following code,

```ts
import { model, Schema } from "mongoose";

const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
});
export default model("todos", TodoSchema);
```

> So we are basically creating a `todos` model on the todo's schema.

We will then go in our `routes/index.ts` file and add the following code:

```ts
import { Request, Response, Router } from "express";
import mongoose from "mongoose";
const router: Router = Router();
import Todos from "../model";

const url: string = `mongodb://admin:password@localhost:27017`;
mongoose.connect(url, {}, (err) => {
  if (err) {
    throw err;
  }
  console.log("connected to mongodb");
});
mongoose.connection.once("open", (err) => {
  if (err) {
    throw err;
  }
  console.log("Ready to accept connections");
});

router.get("/todos", (_req: Request, res: Response) => {
  Todos.find({}, (error: any, doc: any) => {
    if (error) {
      throw error;
    }
    if (!doc) {
      return res.status(404).send("No todos found.");
    }
    return res.status(200).send(doc);
  });
});

router.get("/todo/:id", (req, res) => {
  const { id } = req.params;
  Todos.findById(id, (error: any, doc: any) => {
    if (error) {
      throw error;
    }
    if (!doc) {
      return res.status(404).send("Todo not found.");
    }
    return res.status(200).send(doc);
  });
});

router.post("/todo/create", (req: Request, res: Response) => {
  const data = req.body;
  const todo = new Todos(data);
  todo.save();
  res.status(201).send(todo);
});

export default router;
```

### Creating a Docker network

Docker networking is primarily used to establish communication between Docker containers and the outside world via the host machine where the Docker daemon is running. To list all the docker networks that we have we run the following command:

```shell
docker network ls
```

The above command will lists all the networks that we have in docker and the output will be of the simillar nature:

```shell
NETWORK ID     NAME      DRIVER    SCOPE
0963e906cd66   bridge    bridge    local
6b772f802f06   host      host      local
80aa5e46f328   none      null      local
```

We need to create a new network called `mongo-network` that will allow us to estabilish connection between the `mongo` and `mongo-express` by running the following command.

```shell
docker network create mongo-network
```

Now if we list all the networks by running the following command:

```shell
docker network ls
```

We will get the following output

```shell
NETWORK ID     NAME            DRIVER    SCOPE
0963e906cd66   bridge          bridge    local
6b772f802f06   host            host      local
b603ec659b46   mongo-network   bridge    local
80aa5e46f328   none            null      local
```

After creating our network we need to pull two docker images from docker hub which are:

1. mongo
2. mongo-express

We will run the following command to pull these two docker images

```shell
docker pull mongo
# Then
docker pull mongo-express
```

The next thing that we will do is to start our docker images in the same network, which is the network that we have created `mongo-network`.

1. starting the mongo

```shell
docker run -d \
 -p 27017:27017 \
 -e MONGO_INITDB_ROOT_USERNAME=admin \
 -e MONGO_INITDB_ROOT_PASSWORD=password \
 --name mongodb \
 --net mongo-network \
 mongo

# or
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password --name mongodb --net mongo-network mongo
```

2. starting the mongo-express

```shell
docker run -d \
 -p 8081:8081 \
 -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \
 -e ME_CONFIG_MONGODB_ADMINPASSWORD=password \
 --name mongo-express \
 --net mongo-network \
 -e ME_CONFIG_MONGODB_SERVER=mongodb \
 mongo-express

#  or
docker run -d -p 8081:8081 -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin -e ME_CONFIG_MONGODB_ADMINPASSWORD=password --name mongo-express --net mongo-network -e ME_CONFIG_MONGODB_SERVER=mongodb mongo-express
```

We are passing a lot of options in the docker `run` command which are:

1. `-d` - running a container in detach mode
2. `-p` - for port binding
3. `-e` - environmental variables, and these environmental variables are required, you can find and read about them in the official image documentation.
4. `--name` - custom name of the container
5. `--net` - for specifying the network in which the container will be running.

> Note that creating a docker network is optional we can start both containers in a default network, in that case you just have to emit the `--net` flag or option

If we run the `ps` command we will see the following output:

```shell
CONTAINER ID   IMAGE           COMMAND                  CREATED              STATUS          PORTS                      NAMES
2390c8483842   mongo-express   "tini -- /docker-ent…"   8 seconds ago        Up 5 seconds    0.0.0.0:8081->8081/tcp     mongo-express
88392516ef5f   mongo           "docker-entrypoint.s…"   About a minute ago   Up 56 seconds   0.0.0.0:27017->27017/tcp   mongodb
```

After that we can go ahead and open the browser at:

```shell
http://localhost:8080
# or
http://127.0.0.1:8080
```

And we will be able to see the interface where we can create our database `todo`. After creating the database we will be able to make `CRUD` operations inside with mongodb.

### Getting all Todos

If we send the following request to our server we will be able to get all the todos that are coming from `mongodb` database.

```shell
GET http://localhost:3003/todos
```

The route for doing that looks as follows:

```ts
router.get("/todos", (_req: Request, res: Response) => {
  Todos.find({}, (error: any, doc: any) => {
    if (error) {
      throw error;
    }
    if (!doc) {
      return res.status(404).send("No todos found.");
    }
    return res.status(200).send(doc);
  });
});
```

### Creating a todo

To create a new todo we sent the following request to the server:

```shell
POST http://localhost:3003/todo/create
Content-Type: application/json

{
    "title":"cleaning",
    "completed": false
}
```

The route for creating a todo looks as follows:

```ts
router.post("/todo/create", (req: Request, res: Response) => {
  const data = req.body;
  const todo = new Todos(data);
  todo.save();
  res.status(201).send(todo);
});
```

### Getting as single todo.

To get a single todo we send the following request to the server:

```shell
GET http://localhost:3003/todo/62a2fbe73460ce2ca64319d4

```

The route for doing that looks as follows:

```ts
router.get("/todo/:id", (req, res) => {
  const { id } = req.params;
  Todos.findById(id, (error: any, doc: any) => {
    if (error) {
      throw error;
    }
    if (!doc) {
      return res.status(404).send("Todo not found.");
    }
    return res.status(200).send(doc);
  });
});
```

### Checking the logs

You can check the logs for a container by running the `logs` command as follows:

```shell
docker logs mongodb
# or

docker logs mongo-express
```

### Docker compose.

Docker compose is a tool for running multi-container docker applications. By installing docker it comes with docker-compose so you can check the version of docker-compose by running the following command, just to make sure that docker-compose is available in your computer.

```shell
docker-compose -v
```

With docker compose we define our services in the `yml` file. Let's have a look at how we can run our containers using docker-compose. From our previous example we run two containers the `mongodb` and `mongo-express` using the command line. Now we want to put these commands in a `.yml` file and use docker compose to run these containers at once. First let's create a file called `docker-compose.yml` in the root folder of our project.

```shell
docker run -d \
 -p 27017:27017 \
 -e MONGO_INITDB_ROOT_USERNAME=admin \
 -e MONGO_INITDB_ROOT_PASSWORD=password \
 --name mongodb \
 --net mongo-network \
 mongo
```

The above command in the `docker-compose.yml` file will look as follows

```yml
version: "3.9" # latest version of docker compose (optional)
services: # defines the services that you want to run
  mongodb: # the container name
    image: mongo # the image name
    ports: # port binding
      - 27017:27017
    environment: # environmental variables
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
```

Next we will transform the following command in our `.yml`

```shell
docker run -d \
 -p 8081:8081 \
 -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \
 -e ME_CONFIG_MONGODB_ADMINPASSWORD=password \
 --name mongo-express \
 --net mongo-network \
 -e ME_CONFIG_MONGODB_SERVER=mongodb \
 mongo-express
```

So the whole `docker-compose.yml` file will look as follows:

```yml
version: "3.9" # latest version of docker compose (optional)
services: # defines the services that you want to run
  mongodb: # the container name
    image: mongo # the image name
    ports: # port binding
      - "27017:27017"
    environment: # environmental variables
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - "8081:8081"
    depends_on:
      - mongodb

    environment:
      - ME_CONFIG_MONGODB_ADMINUSERNAME=admin
      - ME_CONFIG_MONGODB_ADMINPASSWORD=password
      - ME_CONFIG_MONGODB_SERVER=mongodb
      - ME_CONFIG_MONGODB_ENABLE_ADMIN=true
```

> Note that we don't need to specify the network as it will be created for us with `docker-compose`.

Now that we have our docker compose file we can run the containers with the following command

```shell
docker-compose -f docker-compose.yml up
# or
docker compose up
```

If everything is wired you should see the output on your screen which is similar to this:

```shell
Creating network "app_default" with the default driver
Creating app_mongo-express_1 ... done
Creating app_mongodb_1       ... done
Attaching to app_mongo-express_1, app_mongodb_1
```

> Make sure that you are in the directory where your `docker-compose.yml` file is located.

To stop the containers we run the following command:

```shell
docker-compose -f docker-compose.yml down

# or
docker compose down
```

We should see the following as output:

```shell
Removing app_mongodb_1       ... done
Removing app_mongo-express_1 ... done
Removing network app_default
```

### Why docker compose?

- It allows us to run multi docker-container applications at once.
- You don't need to worry about creating the docker network because it will be created for you.
- Easy to configure and modify since it is a file you can edit it and make some changes.

### Docker file.

Now that we have developed our application. We want to create a docker image for our application. A docker file essentially it is a blueprint for creating docker images. Let's have a look at how we can create an image based on our application. So let's create a docker file to create an image for our application.

> Note that the docker file must have the name `Dockerfile`. After that we are going to add the following code in that docker file.

```shell
# from the base image(you can specify the version of the image)
FROM node # e.g FROM node:18-aphine
# setting enviromental variables (optional since we have already set them.)
ENV MONGO_DB_USERNAME=admin
ENV MONGO_DB_PWD=password
# creating a folder app (this folder will be created inside a container)
RUN mkdir -p /home/app

# copying files and folders of our app in the (app) directory
COPY . /home/app

# the entry point command (the reason we did not use the RUN command is that we can have multiple run with only one CMD [entry point command])
CMD [ "node", "/home/app/dist/server.js" ]
```

> Note that in the `CMD` command we are going to run the compiled version of our app.

Now that we have our docker file, let's build an image based on our docker file. In order to do that we are going to run the following command:

```shell
docker build -t myapp:1.0 .
```

> Note that `1.0` here is the version of our image. And the last parameter which is `.` specifies the location of our docker file.

After it has finished running, we can be able to check the images that we have on our computer by running the images docker command as follows:

```shell
docker images
```

Output in my case:

```shell
REPOSITORY      TAG       IMAGE ID       CREATED         SIZE
myapp           1.0       9a3fc1e5b339   2 minutes ago   1.09GB
redis           latest    dd8125f93b94   7 weeks ago     117MB
mongo           latest    1d3f6d5230f6   7 weeks ago     696MB
redis           6.2       c0988daf01f5   2 months ago    113MB
mongo-express   latest    2d2fb2cabc8f   9 months ago    136MB
```

Now we can be able to run the image by running the `run` docker command

```shell
docker run myapp:1.0
```

We will be able to see the following logs in the console:

```shell
The server is running on port: 3003
```

We can also be able to check all the images that are running using the `ps` command as follows:

```shell
docker ps
```

Output:

```shell
CONTAINER ID   IMAGE           COMMAND                  CREATED          STATUS          PORTS
   NAMES
8e38a6e2570e   myapp:1.0       "docker-entrypoint.s…"   12 seconds ago   Up 9 seconds
   stupefied_bohr
2196e961a20f   mongo-express   "tini -- /docker-ent…"   39 minutes ago   Up 38 minutes   0.0.0.0:8081->8081/tcp
   app-mongo-express-1
901ea18d6f4b   mongo           "docker-entrypoint.s…"   39 minutes ago   Up 38 minutes   0.0.0.0:27017->27017/tcp   app-mongodb-1
```

### Node API to Docker

Now we can create a `Dockerfile` that will allow our nodejs api server to run in the same with `mongodb`. Our docker file for building this nodejs api as an image is as follows:

```Dockerfile
FROM node:alpine3.11
WORKDIR /app
COPY package*.json .
RUN yarn
COPY . .
RUN yarn build
EXPOSE 3003
CMD ["yarn", "dev"]
```

Then we will need to modify our `docker-compose.yml` file to look as follows:

```yml
version: "3.9" # latest version of docker compose (optional)
services:
  expressapi:
    build:
      context: ./
      dockerfile: Dockerfile
    ports:
      - "3003:3003"
    container_name: expressapi
    links:
      - mongodb
    depends_on:
      - mongodb
    environment:
      - MONGO_CONNECTION_STRING=mongodb://mongodb:27017
  mongodb:
    image: mongo
    ports:
      - "27017:27017"
    container_name: mongodb
    volumes:
      - ./db/:/data/db
```

Now we can start the containers in the same network by running the `docker compose up` as follows:

```shell
docker compose up -d
```

If everything works we should be able to make api requests to our sever.

### Refs

1. [Docker Compose](https://docs.docker.com/compose/)
