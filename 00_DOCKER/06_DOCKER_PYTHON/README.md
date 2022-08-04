### Docker and Python

In this `README` we are going to learn how to containerize our python scripts and flask servers using docker. So this repository contains two sub-repositories the.

1. 01_PYTHON_SCRIPTS
2. 02_FLASK_APP

### Docker with python scripts

We are going to create a new file in the `01_PYTHON_SCRIPTS` called `main.py` and a virtual environment called `venv`. In this file we are going to create a simple program that randomize numbers and check against the user input if they guess the correct number or not:

The program looks as follows:

```py
import random
from prettytable import PrettyTable


while True:
    number = int(input("Guess a number between 1 and 5: "))
    table = PrettyTable()
    table.field_names = ["Guessed", "Correct", "Win", "Difference"]
    correct = random.randint(1, 5)
    table.add_rows([[number, correct, correct==number, correct-number]])
    print(table)

    yesOrNo = input("Do you want to keep on playing (y/N): ").strip().lower()

    if yesOrNo[0] == 'n':
        break
    else:
        continue
```

> So if you run the code, we should get output that looks as follows:

```shell
Guess a number between 1 and 5: 3
+---------+---------+------+------------+
| Guessed | Correct | Win  | Difference |
+---------+---------+------+------------+
|    3    |    3    | True |     0      |
+---------+---------+------+------------+
Do you want to keep on playing (y/N): 3
Guess a number between 1 and 5: 4
+---------+---------+-------+------------+
| Guessed | Correct |  Win  | Difference |
+---------+---------+-------+------------+
|    4    |    5    | False |     1      |
+---------+---------+-------+------------+
```

Next we will need to create a `virtual environment` called `venv` and activate it using the following command:

```shell
virtualenv venv
# activate
.\venv\Scripts\activate
```

Then we need to install `prettytable` as follows:

```shell
pip install prettytable
```

### Creating a `requirements.txt` file.

To create a `requirements.txt` file we run then following command:

```shell
pip freeze > requirements.txt
```

### Docker

Now it's time for us to create a Docker image based on our application. We are going to create a new `Dockerfile` in the root of our project. First we are going to create a `.dockerignore` file also in the root folder of our project so that we ignore the `venv` folder which will look as follows:

```shell
venv
```

Dockerfile:

```Dockerfile

FROM python:3.9.13-alpine3.16

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```

Now we can build our image based on this docker file by running the following command:

```shell
docker build --tag game:1.0 .
```

After it's done we can be able to run a container using our image using the following command.

```shell
docker run -it game:1.0
# or

docker run -i -t game:1.0
```

> Note that we are using `-it` flag because we want to interact with our game by passing user input from the console.

Possible Output:

```shell
Guess a number between 1 and 5: 4
+---------+---------+-------+------------+
| Guessed | Correct |  Win  | Difference |
+---------+---------+-------+------------+
|    4    |    2    | False |     -2     |
+---------+---------+-------+------------+
Do you want to keep on playing (y/N): y
Guess a number between 1 and 5: 5
+---------+---------+-------+------------+
| Guessed | Correct |  Win  | Difference |
+---------+---------+-------+------------+
|    5    |    4    | False |     -1     |
+---------+---------+-------+------------+
Do you want to keep on playing (y/N): n
```

### Docker on Flask application

In this section we are going to have a look on how we can dockerize our flask application. We are going to connect our python flask app with a `redis` server. After we have activated our virtual environment we are going to install our packages as follows:

```shell
pip install redis flask flask-cors
```

Next we are going to create our `app` package and add the following code to it:

```py
# just creating a simple flask app
from flask import Flask
from flask_cors import CORS
from blueprints import blueprint

app = Flask(__name__)
app.register_blueprint(blueprint, url_prefix="/api/v1")
CORS(app)

```

In our `app.py` we are going to have the following code in it:

```py
from app import app
from flask import make_response, jsonify

class AppConfig:
    PORT = 3001
    DEBUG = True

@app.route('/', methods=["GET"])
def meta():
    meta ={
        "programmer": "@crispengari",
        "main": "Flask, Docker and Redis",
        "description": "A simple flask application with Docker.",
        "language": "python",
        "libraries": ["redis"],
    }
    return make_response(jsonify(meta)), 200

if __name__ == "__main__":
    app.run(debug=AppConfig().DEBUG, port=AppConfig().PORT, )
```

### Starting a redis container

To start a redis container we are going to create a `docker-compose.yml` file in the root project of our folder and add the following code to it:

```yml
version: "3.6"
services:
  redisdb:
    container_name: redis_container
    image: redis:5.0.14-alpine
    restart: always
    ports:
      - 6379:6379
    volumes:
      - cache:/data
volumes:
  cache:
    driver: local
```

Now we can run the `compose up -d` command as follows:

```shell
docker compose up -d
```

If we check the containers that are running using the `ps` command we can see the following as output:

```shell
CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS         PORTS                    NAMES
79819c45352c   redis:5.0.14-alpine   "docker-entrypoint.s…"   11 seconds ago   Up 7 seconds   0.0.0.0:6379->6379/tcp   redis_container
```

Now we can interact with the `redis` cli by running the following command:

```shell
docker exec -it redis_container redis-cli
```

We will get the following output:

```shell
127.0.0.1:6379> get keys
(nil)
127.0.0.1:6379>
```

This show us that our `redis` container is running and ready to accept data. Remember we are exposing the port to the host, this means that we can connect to redis from our flask application by creating a `client`. We are going to create a package called `client` . Our Redis client will be in the `client` package and it looks as follows:

```py
import redis
client = redis.Redis(
    host="127.0.0.1",
    port= 6379,
    password=""
)
```

All the code for interacting with our api will be in the `blueprint` sub package which looks as follows:

```py
from flask import Blueprint, make_response, jsonify, request
from client import client

blueprint = Blueprint("blueprint", __name__)

@blueprint.route("/<string:key>", methods=["GET"])
def get_value(key):
    if request.method == "GET":
        value = client.get(key)
        if value is not None:
            return make_response(jsonify({
                "value": value.decode("utf-8")
                }), 200)
        else:
            return make_response(jsonify({
                "code": 404,
                "message": f"The key {key} was not found maybe it has expired."
            }), 404)
    else:
        return make_response(jsonify({
            "code": 400,
            "message": "Only Get Methods"
        }))

@blueprint.route('/update', methods=["PUT", "PATCH"])
def update_key():
    if request.method == "PUT" or request.method == "PATCH":
        if request.is_json:
            res = request.get_json()
            key = res.get("key")
            value = client.get(key)
            if value is None:
                return make_response(jsonify({
                    "code": 404,
                    "message": f"The key {key} was not found maybe it has expired."
                }), 404)

            if res.get("expiresIn"):
                client.setex(key,res.get("expiresIn"), res.get("value"))
                return make_response(jsonify({
                    "code": 200,
                    "data": res
                }))
            else:
                client.set(key, res.get("value") )
                return make_response(jsonify({
                    "code": 200,
                    "data": res
                }))
        else:
            return  make_response(jsonify({
                "code": 500,
                "message": "Only json data is required."
            }), 500)
    else:
        return make_response(jsonify({
            "code": 400,
            "message": "Only Get Methods"
        }))

@blueprint.route('/delete', methods=["DELETE"])
def delete_key():
    if request.method == "DELETE":
        if request.is_json:
            res = request.get_json()
            key = res.get("key")
            value = client.get(key)
            if value is not None:
                client.delete(key)
                return make_response(jsonify({
                    key: "deleted"
                    }), 200)
            else:
                return make_response(jsonify({
                    "code": 404,
                    "message": f"The key {key} was not found maybe it has expired."
                }), 404)
        else:
            return  make_response(jsonify({
                "code": 500,
                "message": "Only json data is required."
            }), 500)
    else:
        return make_response(jsonify({
            "code": 400,
            "message": "Only Get Methods"
        }))


@blueprint.route('/add-key', methods=["POST"])
def add_key():
    if request.method == "POST":
        if request.is_json:
            res = request.get_json()
            if res.get("expiresIn"):
                client.setex(res.get('key'),res.get("expiresIn"), res.get("value"))
                return make_response(jsonify({
                    "code": 200,
                    "data": res
                }))
            else:
                client.set(res.get('key'), res.get("value") )
                return make_response(jsonify({
                    "code": 200,
                    "data": res
                }))
        else:
            return  make_response(jsonify({
                "code": 500,
                "message": "Only json data is required."
            }), 500)
    else:
        return make_response(jsonify({
            "code": 400,
            "message": "Only Get Methods"
        }))
```

Now we can be able to make send request locally, next we are going to build an image for our flask app. For that we are going to open the `Dockerfile` that is in our root folder and add the following code to it:

```Dockerfile
FROM python:3.9.13-alpine3.16

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "app.py"]
```

We need to freeze the packages by running the following command:

```shell
pip freeze > requirements.txt
```

Now to build the image we can run the following command:

```shell
docker build -t flaskapp:1.0 .
```

The docker image will be created, alternatively we can build our `flaskapp` inside the `docker-compose` so that it will be in the same network as our `redis` server. So our `docker-compose.yml` file will be modified to look as follows:

```yml
version: "3.6"
services:
  redisdb:
    container_name: redis_container
    image: redis:5.0.14-alpine
    restart: always
    ports:
      - 6379:6379
    volumes:
      - cache:/data
    networks:
      - internalnet

  flaskapp:
    container_name: flaskserver
    build: .
    image: flaskapp:1.0
    ports:
      - "3001:3001"
    expose:
      - "3001"
    depends_on:
      - redisdb
    networks:
      - internalnet
volumes:
  cache:
    driver: local

networks:
  internalnet:
    driver: bridge
```

Now which means we need to modify our redis `client` to look as follows:

```py
import redis
client = redis.Redis(
    host="redisdb",
    port= 6379,
    password=""
)
```

We also need to modify the `app.run` function in the `app.py` to look as follows:

```py
from app import app
from flask import make_response, jsonify

class AppConfig:
    PORT = 3001
    DEBUG = False
    HOST = '0.0.0.0'

@app.route('/', methods=["GET"])
def meta():
    meta ={
        "programmer": "@crispengari",
        "main": "Flask, Docker and Redis",
        "description": "A simple flask application with Docker.",
        "language": "python",
        "libraries": ["redis"],
    }
    return make_response(jsonify(meta)), 200

if __name__ == "__main__":
    app.run(debug=AppConfig().DEBUG, port=AppConfig().PORT, host=AppConfig().HOST)
```

> We are just setting the host to `0.0.0.0`, allowing access from anywhere

Now we can run the following command to start our containers:

```shell
docker compose up -d
```

If we check the running containers we will see the following as output:

```shell
CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS          PORTS                    NAMES
36aa3b17ef0f   flaskapp:1.0          "python app.py"          27 seconds ago   Up 19 seconds   0.0.0.0:3001->3001/tcp   flaskserver
1b650240568b   redis:5.0.14-alpine   "docker-entrypoint.s…"   28 seconds ago   Up 23 seconds   0.0.0.0:6379->6379/tcp   redis_container
```

> Now you can be able to test the application.

### Other docker files for python apps

1. from alpine base image

```Dockerfile
from alpine:latest

RUN apk add --no-cache python3-dev \
    && pip3 install --upgrade pip

WORKDIR /app

COPY . /app

RUN pip3 --no-cache-dir install -r requirements.txt

EXPOSE 5000

ENTRYPOINT ["python3"]
CMD ["app.py"]

```

2. From ubuntu base image

```Dockerfile
from ubuntu:18.04
RUN apt-get update -y && apt-get install -y python-pip python-dev
WORKDIR /app
COPY requirements.txt .
RUN pip install requirements.txt
COPY . .
CMD ["python", "app.py"]
```
