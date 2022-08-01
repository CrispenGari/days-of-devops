### Creating a website with nginx server

In this one we are going to create our own website using the `nginx` docker image. We will create 3 files which are:

```
- index.html
- index.css
- index.js
```

Next we are going to create a `.dockerignore` file so that we don't add the `README` file into the image as follows:

```
README.md
```

And lastly we will create a `Dockerfile` and add the following code into it:

```shell
FROM nginx:1.23.1-alpine

WORKDIR /usr/share/nginx/html

ADD . .
```

> _The difference between `ADD` and `COPY` is that `ADD` is used to add files into the image while `COPY` is used to copy files into the container._

Now we can create our image based on our `Dockerfile` by running the following command:

```shell
docker build -t web:latest .
```

Now to test our container we are going to run the following command:

```shell
docker run --name web_1 -d -p 3000:80 web
```

### Versioning and Tags

Let's say we want to create a new version of our application. What we will need to do this we use the `tag` docker command, as follows:

```shell
docker tag web:latest web:1.0
```

Next time when we create a new version of our `web` we are simply going to run the similar command as follows:

```shell
docker tag web:latest web:2.0
```

Now if we run the `images` docker command we will be able to see the following list of images:

```shell
REPOSITORY                      TAG       IMAGE ID       CREATED          SIZE
web                             2.0       a2e537039aa2   12 seconds ago   23.5MB
web                             latest    a2e537039aa2   12 seconds ago   23.5MB
web                             1.0       f585057b9bc7   11 minutes ago   23.5MB
```

### Starting our tagged versions of `web` image.

Next we are going to start the tagged version of our image based on tags, and check the differences as follows:

```shell
docker run --name web_latest -d -p 3000:80 web:latest
docker run --name web_1 -d -p 3001:80 web:1.0
docker run --name web_2 -d -p 3002:80 web:2.0
```

Now if we run the `ps` command we will be able to see different containers running on different ports and that shows different versions of our app:

```shell
CONTAINER ID   IMAGE        COMMAND                  CREATED              STATUS              PORTS                  NAMES
f98e553bf872   web:2.0      "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:3002->80/tcp   web_2
1cfc0959bbdd   web:1.0      "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:3001->80/tcp   web_1
66b610a56ef0   web:latest   "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:3000->80/tcp   web_latest
```
