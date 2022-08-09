### MySQL Rest with Docker

In this one we are going to learn how to create a REST api with `docker`,`nodejs`, `express` and `mysql`.

### Getting started

This project was initialized by running the following command:

```shell
initialiseur init
```

We are going to the install the `env-types` so that our environmental variables will be having typescript types as follows:

```shell
yarn add -D node-env-types
```

After doing that we are going to open the `tsconfig.json` and modify the `include` property to:

```json
{
  "include": ["./**/*.tsx", "./**/*.ts", "src/configs/test.ts"]
}
```

We are then going to add the environmental variables in the `.env` file as follows:

```shell
# environment variables here

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=password
DB_NAME=todos
DB_CONNECTION_LIMIT=20

# Server
PORT=3000
```

### Installing other packages.

Now we are going to install other packages that we are going to use in this project such as:

1. [ip](https://www.npmjs.com/package/ip) - used to get our own ip address
2. [pino](https://www.npmjs.com/package/pino) - used to display logs nicely.
3. [pino-pretty](https://www.npmjs.com/package/pino-pretty) - used to format pino logs
4. [mysql2](https://www.npmjs.com/package/mysql2) - interacting with our database.

```shell
yarn add pino ip pino-pretty mysql2
# typescript types
yarn add -D @types/ip
```

### Our database table.

We are going to create a folder called `db` in the root of our project and create a `init.sql` file and add the following code to it:

```sql
CREATE DATABASE IF NOT EXISTS todos;

USE todos;

CREATE TABLE IF NOT EXISTS todos(
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title      VARCHAR(255) NOT NULL,
  completed  BIT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

### Our logs

Instead of using `console.log` we are going to use `pino`. So we are going to create a new file called `/utils/index.ts` and create a `logger` and export it as follows:

```ts
import pino from "pino";
export const logger = pino({
  base: { pid: false },
  transport: {
    target: "pino-pretty",
    options: {
      colorized: true,
    },
  },
  timestamp: () => `,"time": "${new Date().toLocaleString()}"`,
});
```

### Response

Our http response will be customized to return the following:

1. status code
2. message
3. data
4. http status
5. timestamp

So we are going to create a file called `/domain/index.ts` and add the following code to it:

```ts
export class Response {
  protected timeStamp: string;
  protected statusCode: number;
  protected data: any;
  protected message: string;
  protected status: string;
  constructor(statusCode: number, status: string, message: string, data: any) {
    this.timeStamp = new Date().toLocaleString();
    this.statusCode = statusCode;
    this.status = httpStatus;
    this.message = message;
    this.data = data;
  }
}
```

### Status codes.

Our status codes will be an object. So we are going to put this object under `constants` folder in the `index.ts` file as follows:

```ts
// status codes
export const STATUS_CODES = {
  OK: { code: 200, status: "OK" },
  CREATED: { code: 201, status: "CREATED" },
  NO_CONTENT: { code: 204, status: "NO CONTENT" },
  BAD_REQUEST: { code: 400, status: "BAD REQUEST" },
  NOT_FOUND: { code: 404, status: "NOT FOUND" },
  INTERNAL_SERVER_ERROR: { code: 500, status: "INTERNAL SERVER ERROR" },
};
```

### Queries

Our Queries will be strings and they will be located in the `constants` folder in the `index.ts` file as follows:

```ts
// queries

export const QUERY = {
  SELECT_TODOS: "SELECT * FROM todos ORDER BY created_at DESC LIMIT 100",
  SELECT_TODO: "SELECT * FROM todos WHERE id = ?",
  CREATE_TODO: "INSERT INTO todos (title) VALUES (?)",
  UPDATE_TODO: "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
  DELETE_TODO: "DELETE FROM todos WHERE id = ?",
};
```

### Testing Our Server

Now in the `src/server.ts` we are going to add the following code in it:

```ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";
import _ from "node-env-types";
import { address } from "ip";
import { logger } from "./utils";
_();

// ----
const app: express.Application = express();
const PORT: any = 3001 || process.env.PORT;

//
app.use(cors());
app.use(express.json());
app.use(router);
app.listen(PORT, () => {
  console.log();
  logger.info(`The server is running on port: ${PORT}`);
  logger.info(`Local: http://127.0.0.1:${PORT}`);
  logger.info(`Network: http://${address()}:${PORT}`);
  console.log();
});
```

Then in our `src/routes/index.ts` we are going to have the following code in it:

```ts
import { Request, Response, Router } from "express";
import { STATUS_CODES } from "../constants";
import { Response as Res } from "../domain";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  return res.status(STATUS_CODES.OK.code).json(
    new Res(
      STATUS_CODES.OK.code,
      STATUS_CODES.OK.status,
      "This is the backend server for MYSQL database server.",
      {
        name: "backend",
        language: "typescript",
        message: "hello world!",
        programmer: "@programer",
        moto: "i'm a programer i have no life!",
        framework: "express.js",
      }
    )
  );
});

router.all("*", (req: Request, res: Response) =>
  res
    .status(STATUS_CODES.NOT_FOUND.code)
    .json(
      new Res(
        STATUS_CODES.NOT_FOUND.code,
        STATUS_CODES.NOT_FOUND.status,
        `Route '${req.originalUrl}' does not exists on the server.`,
        null
      )
    )
);
export default router;
```

Now if we start the server we are going to see the following logs on the screen. To start the server we are going to run two parallel command which are `watch` and `dev`:

```shell
*** created env-types at C:\Users\crisp\OneDrive\Documents\DevOps\days-of-devops\00_docker\04_DOCKER_MYSQL_REST\env.d.ts.



[2022/08/02, 09:31:58] INFO: The server is running on port: 3001
[2022/08/02, 09:31:58] INFO: Local: http://127.0.0.1:3001
[2022/08/02, 09:31:58] INFO: Network: http://192.*.*.*:3001
```

Now if we visit `http://127.0.0.1:3001` we will get the following response from the browser:

```json
{
  "timeStamp": "2022/08/02, 09:37:16",
  "statusCode": 200,
  "status": "OK",
  "message": "This is the backend server for MYSQL database server.",
  "data": {
    "name": "backend",
    "language": "typescript",
    "message": "hello world!",
    "programmer": "@programer",
    "moto": "i'm a programer i have no life!",
    "framework": "express.js"
  }
}
```

Now if we visit the `wild-route` for example `http://127.0.0.1:3001/abc` we will get the following res:

```json
{
  "timeStamp": "2022/08/02, 09:38:23",
  "statusCode": 404,
  "status": "NOT FOUND",
  "message": "Route '/abc' does not exists on the server.",
  "data": null
}
```

Now that our server is up and running we can now connect to the database.

### MySQL Pool

We are going to create a folder called `pool` and create a new mysql pool.

```ts
import { createPool } from "mysql2";
import { PoolOptions } from "mysql2/typings/mysql";

const options = {
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT as any),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: Number.parseInt(process.env.DB_CONNECTION_LIMIT as any),
} as PoolOptions;

export const pool = createPool(options);
```

Now with this `pool` we will be able to commit and query the data from the database.

### typescript types

We are going to create a folder called `types` inside that folder we are going to create a declarative file called `express-types.d.ts` which export a new `Request` class with a property `id` of type number as follows

```ts
declare namespace Express {
  export interface Request {
    id: number;
  }
}
```

### Controller

We are going to create a new folder called `controller` in that folder we are going to have a file called `index.ts` and we will add all the logic for querying our todos data.

```ts
import { Request, Response } from "express";
import { QUERY, STATUS_CODES } from "../constants";
import { Response as Res } from "../domain";
import { pool } from "../pool";
import { logger } from "../utils";

export const getTodos = async (req: Request, res: Response) => {
  logger.info(`method: ${req.method} route: ${req.originalUrl}`);
  const todos = await pool.query(QUERY.SELECT_TODOS);
  if (todos) {
    return res.status(STATUS_CODES.OK.code).json(
      new Res(
        STATUS_CODES.OK.code,
        STATUS_CODES.OK.status,
        "All the todos that are in the database",
        {
          todos,
        }
      )
    );
  } else {
    return res
      .status(STATUS_CODES.OK.code)
      .json(
        new Res(
          STATUS_CODES.OK.code,
          STATUS_CODES.OK.status,
          "No todos in the database.",
          null
        )
      );
  }
};
export const getTodo = async (req: Request, res: Response) => {
  logger.info(`method: ${req.method} route: ${req.originalUrl}`);
  await pool.query(
    QUERY.SELECT_TODO,
    [req.params.id],
    (err: any, result: any) => {
      if (err) {
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
          .json(
            new Res(
              STATUS_CODES.INTERNAL_SERVER_ERROR.code,
              STATUS_CODES.INTERNAL_SERVER_ERROR.status,
              "There was an error processing your request: " + err.message,
              undefined
            )
          );
      }
      if (result[0]) {
        return res
          .status(STATUS_CODES.OK.code)
          .json(
            new Res(
              STATUS_CODES.OK.code,
              STATUS_CODES.OK.status,
              `Todo retrieved.`,
              result[0]
            )
          );
      } else {
        return res
          .status(STATUS_CODES.NOT_FOUND.code)
          .json(
            new Res(
              STATUS_CODES.NOT_FOUND.code,
              STATUS_CODES.NOT_FOUND.status,
              `Todo with id ${req.params.id} was not found.`,
              undefined
            )
          );
      }
    }
  );
};

export const addTodo = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating todo`);
  await pool.query(
    QUERY.CREATE_TODO,
    Object.values(req.body),
    (error: any, results: any) => {
      if (!results) {
        logger.error(error.message);
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
          .send(
            new Res(
              STATUS_CODES.INTERNAL_SERVER_ERROR.code,
              STATUS_CODES.INTERNAL_SERVER_ERROR.status,
              `Error occurred`,
              null
            )
          );
      } else {
        //const patient = { id: results.insertedId, ...req.body, created_at: new Date() };
        const todo = results[0][0];
        return res
          .status(STATUS_CODES.CREATED.code)
          .send(
            new Res(
              STATUS_CODES.CREATED.code,
              STATUS_CODES.CREATED.status,
              `Todo created`,
              { todo }
            )
          );
      }
    }
  );
};
export const updateTodo = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, updating todo`);
  await pool.query(
    QUERY.UPDATE_TODO,
    [...Object.values(req.body), req.params.id],
    (error, _results: any) => {
      if (!error) {
        return res
          .status(STATUS_CODES.OK.code)
          .send(
            new Res(
              STATUS_CODES.OK.code,
              STATUS_CODES.OK.status,
              `todo updated`,
              { id: req.params.id, ...req.body }
            )
          );
      } else {
        logger.error(error.message);
        return res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
          .send(
            new Res(
              STATUS_CODES.INTERNAL_SERVER_ERROR.code,
              STATUS_CODES.INTERNAL_SERVER_ERROR.status,
              `Error occurred`,
              null
            )
          );
      }
    }
  );
};

export const deleteTodo = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting todo`);
  pool.query(QUERY.DELETE_TODO, [req.params.id], (err: any, results: any) => {
    if (err) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
        .json(
          new Res(
            STATUS_CODES.INTERNAL_SERVER_ERROR.code,
            STATUS_CODES.INTERNAL_SERVER_ERROR.status,
            "There was an error processing your request: " + err.message,
            undefined
          )
        );
    }
    if (results.affectedRows > 0) {
      return res
        .status(STATUS_CODES.OK.code)
        .json(
          new Res(
            STATUS_CODES.OK.code,
            STATUS_CODES.OK.status,
            `Todo deleted`,
            results[0]
          )
        );
    } else {
      return res
        .status(STATUS_CODES.NOT_FOUND.code)
        .json(
          new Res(
            STATUS_CODES.NOT_FOUND.code,
            STATUS_CODES.NOT_FOUND.status,
            `Todo by id ${req.params.id} was not found`,
            null
          )
        );
    }
  });
};
```

### Routes

Now in our `routes/index.ts` we are going to update it t look as follows:

```ts
import { Request, Response, Router } from "express";
import { STATUS_CODES } from "../constants";
import { Response as Res } from "../domain";
import {
  addTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../controller";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  return res.status(STATUS_CODES.OK.code).json(
    new Res(
      STATUS_CODES.OK.code,
      STATUS_CODES.OK.status,
      "This is the backend server for MYSQL database server.",
      {
        name: "backend",
        language: "typescript",
        message: "hello world!",
        programmer: "@programer",
        moto: "i'm a programer i have no life!",
        framework: "express.js",
      }
    )
  );
});

router.all("*", (req: Request, res: Response) =>
  res
    .status(STATUS_CODES.NOT_FOUND.code)
    .json(
      new Res(
        STATUS_CODES.NOT_FOUND.code,
        STATUS_CODES.NOT_FOUND.status,
        `Route '${req.originalUrl}' does not exists on the server.`,
        null
      )
    )
);

router.route("/api/v1/").get(getTodos).post(addTodo);
router.route("/api/v1/:id").get(getTodo).put(updateTodo).delete(deleteTodo);
export default router;
```

### Docker

Now that we have created our server we need to connect to the database. So we are going to use docker to do this. First we will create a `docker-compose.yml` file in the root folder of our project and add the following configuration to it:

```yml
version: "3.9"
services:
  mysqldb:
    image: mysql:5.7
    container_name: mysqlcontainer
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/0_init.sql
    ports:
      - 3306:3306
    expose:
      - 3306
    environment:
      MYSQL_DATABASE: "todos"
      MYSQL_USER: "admin"
      MYSQL_PASSWORD: "password"
      MYSQL_ROOT_PASSWORD: "password"
      SERVICE_TAGS: dev
      SERVICE_NAME: mysqldb
      MYSQL_HOST: mysqldb
    restart: on-failure
    networks:
      - internalnet
  expressapp:
    container_name: api
    build: .
    image: expressapp:1.0
    ports:
      - "3001:3001"
    expose:
      - "3001"
    environment:
      DB_HOST: mysqldb
      DB_PORT: 3306
      DB_USER: "admin"
      DB_PASSWORD: "password"
      DB_NAME: todos
      DB_CONNECTION_LIMIT: 500
      SERVICE_TAGS: dev
      SERVICE_NAME: expressapp
      PORT: 3001
    depends_on:
      - mysqldb
    networks:
      - internalnet
networks:
  internalnet:
    driver: bridge
volumes:
  database:

```

Next we will then create a docker file in the root folder of our project and it will look as follows:

```Dockerfile
FROM node:alpine3.11
WORKDIR /app
COPY package*.json .
RUN yarn
COPY . .
RUN yarn build
EXPOSE 3001
CMD ["yarn", "dev"]
```

After creating a `Dockerfile` we can run the `compose up -d` command to run our `mysqlcontainer` and `api` container. If you have something that is running on a port `3306` we will need to stop it first. Here are the steps

Open `cmd` as an `Administrator` on windows and types

```shell
netstat -ano | findstr :<PORT>

# example
netstat -ano | findstr :3306
```

You will see the output that looks as follows:

```shell
TCP    0.0.0.0:3306           0.0.0.0:0              LISTENING       4592
TCP    0.0.0.0:33060          0.0.0.0:0              LISTENING       4592
TCP    [::]:3306              [::]:0                 LISTENING       4592
TCP    [::]:33060             [::]:0                 LISTENING       4592
```

Kill all the tasks that are running on this port by using the `PID` as follows

```shell
taskkill /PID <PID> /F
# Example
taskkill /PID 4592 /F
```

When you successfully killed all the processes that are running on this port, you will see the following output:

```shell
SUCCESS: The process with PID 4592 has been terminated.
```

Now we can run the `compose up -d` command as follows

```shell
docker compose up -d
```

Now if you run the `ps` command we will be able to see our containers running:

```shell
docker ps
```

Output

```shell
b1d97a8c3d7f   expressapp:1.0   "docker-entrypoint.s…"   10 seconds ago   Up 3 seconds   0.0.0.0:3001->3001/tcp              api
fa840d4ee933   mysql:5.7        "docker-entrypoint.s…"   11 seconds ago   Up 6 seconds   0.0.0.0:3306->3306/tcp, 33060/tcp   mysqlcontainer
```

Now we can go and make `API` request to the server and everything will just work fine.
