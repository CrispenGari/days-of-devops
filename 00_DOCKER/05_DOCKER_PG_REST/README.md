### Postgres Rest with Docker

In this one we are going to learn how to create a REST api with `docker`,`nodejs`, `express` and `postgres`.

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
DB_HOST=127.0.0.1
DB_PORT=8081
DB_USER=admin
DB_PASSWORD=password
DB_NAME=todos
DB_CONNECTION_LIMIT=20

# Server
PORT=3002
```

### Installing other packages.

Now we are going to install other packages that we are going to use in this project such as:

1. [ip](https://www.npmjs.com/package/ip) - used to get our own ip address
2. [pino](https://www.npmjs.com/package/pino) - used to display logs nicely.
3. [pino-pretty](https://www.npmjs.com/package/pino-pretty) - used to format pino logs
4. [pg](https://www.npmjs.com/package/pg) - interacting with our database.

```shell
yarn add pino ip pino-pretty pg
# typescript types
yarn add -D @types/ip @types/pg
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
  SELECT_TODOS: "SELECT * FROM todos ORDER BY created_at DESC LIMIT 100;",
  SELECT_TODO: "SELECT * FROM todos WHERE id = $1;",
  CREATE_TODO: "INSERT INTO todos (title) VALUES ($1) RETURNING *;",
  UPDATE_TODO: "UPDATE todos SET title = $1, completed = $2 WHERE id = $3;",
  DELETE_TODO: "DELETE FROM todos WHERE id = $1;",
  SHOW_TABLES: "SELECT * FROM pg_catalog.pg_tables;",
  CREATE_TABLE: `CREATE TABLE todos(id BIGSERIAL NOT NULL,title VARCHAR(225) NOT NULL, completed BOOLEAN NOT NULL DEFAULT FALSE,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id));`,
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
const PORT: any = 3002 || process.env.PORT;

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
      "This is the backend server for PG database server.",
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
*** created env-types at C:\Users\crisp\OneDrive\Documents\DevOps\days-of-devops\00_docker\05_DOCKER_PG_REST\env.d.ts.



[2022/08/02, 09:31:58] INFO: The server is running on port: 3002
[2022/08/02, 09:31:58] INFO: Local: http://127.0.0.1:3002
[2022/08/02, 09:31:58] INFO: Network: http://192.*.*.*:3002
```

Now if we visit `http://127.0.0.1:3002` we will get the following response from the browser:

```json
{
  "timeStamp": "2022/08/02, 09:37:16",
  "statusCode": 200,
  "status": "OK",
  "message": "This is the backend server for PG database server.",
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

Now if we visit the `wild-route` for example `http://127.0.0.1:3002/abc` we will get the following res:

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

### Postgres Pool

We are going to create a folder called `pool` and create a new postgress pool.

```ts
import { Pool, PoolConfig } from "pg";

const options = {
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT as any),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: Number.parseInt(process.env.DB_CONNECTION_LIMIT as any),
} as PoolConfig;

export const pool = new Pool(options);
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

export const createTable = async (req: Request, res: Response) => {
  logger.info(`method: ${req.method} route: ${req.originalUrl}`);
  try {
    const results = await pool.query(QUERY.CREATE_TABLE);
    return res.status(STATUS_CODES.CREATED.code).json(
      new Res(
        STATUS_CODES.CREATED.code,
        STATUS_CODES.CREATED.status,
        "Table created successfully.",
        {
          table: results,
        }
      )
    );
  } catch (err) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
      .json(
        new Res(
          STATUS_CODES.INTERNAL_SERVER_ERROR.code,
          STATUS_CODES.INTERNAL_SERVER_ERROR.status,
          err.message,
          undefined
        )
      );
  }
};

export const getTables = async (req: Request, res: Response) => {
  logger.info(`method: ${req.method} route: ${req.originalUrl}`);

  try {
    const results = await pool.query(QUERY.SHOW_TABLES);
    if (results.rows) {
      return res.status(STATUS_CODES.OK.code).json(
        new Res(
          STATUS_CODES.OK.code,
          STATUS_CODES.OK.status,
          "All the tables in the database.",
          {
            count: results.rowCount,
            tables: results.rows,
          }
        )
      );
    } else {
      return res
        .status(STATUS_CODES.NOT_FOUND.code)
        .json(
          new Res(
            STATUS_CODES.NOT_FOUND.code,
            STATUS_CODES.NOT_FOUND.status,
            "No tables found in the database.",
            undefined
          )
        );
    }
  } catch (err) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
      .json(
        new Res(
          STATUS_CODES.INTERNAL_SERVER_ERROR.code,
          STATUS_CODES.INTERNAL_SERVER_ERROR.status,
          err.message,
          undefined
        )
      );
  }
};

export const getTodos = async (req: Request, res: Response) => {
  logger.info(`method: ${req.method} route: ${req.originalUrl}`);
  try {
    const todos = await pool.query(QUERY.SELECT_TODOS);
    if (todos) {
      return res.status(STATUS_CODES.OK.code).json(
        new Res(
          STATUS_CODES.OK.code,
          STATUS_CODES.OK.status,
          "All the todos that are in the database",
          {
            todos: todos.rows,
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
  } catch (err) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
      .json(
        new Res(
          STATUS_CODES.INTERNAL_SERVER_ERROR.code,
          STATUS_CODES.INTERNAL_SERVER_ERROR.status,
          err.message,
          undefined
        )
      );
  }
};

export const getTodo = async (req: Request, res: Response) => {
  logger.info(`method: ${req.method} route: ${req.originalUrl}`);

  try {
    const { rows } = await pool.query(QUERY.SELECT_TODO, [req.params.id]);
    if (rows[0]) {
      return res
        .status(STATUS_CODES.OK.code)
        .json(
          new Res(
            STATUS_CODES.OK.code,
            STATUS_CODES.OK.status,
            `Todo retrieved.`,
            { todo: rows[0] }
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
  } catch (err) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
      .json(
        new Res(
          STATUS_CODES.INTERNAL_SERVER_ERROR.code,
          STATUS_CODES.INTERNAL_SERVER_ERROR.status,
          err.message,
          undefined
        )
      );
  }
};

export const addTodo = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating todo`);
  try {
    const { rows } = await pool.query(
      QUERY.CREATE_TODO,
      Object.values(req.body)
    );
    return res
      .status(STATUS_CODES.CREATED.code)
      .send(
        new Res(
          STATUS_CODES.CREATED.code,
          STATUS_CODES.CREATED.status,
          `Todo created`,
          { todo: rows[0] }
        )
      );
  } catch (err) {
    console.log(err);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
      .json(
        new Res(
          STATUS_CODES.INTERNAL_SERVER_ERROR.code,
          STATUS_CODES.INTERNAL_SERVER_ERROR.status,
          err.message,
          undefined
        )
      );
  }
};
export const updateTodo = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, updating todo`);

  try {
    const { rows } = await pool.query(QUERY.UPDATE_TODO, [
      ...Object.values(req.body),
      req.params.id,
    ]);
    return res.status(STATUS_CODES.OK.code).send(
      new Res(STATUS_CODES.OK.code, STATUS_CODES.OK.status, `todo updated`, {
        id: req.params.id,
        ...rows[0],
      })
    );
  } catch (err) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
      .json(
        new Res(
          STATUS_CODES.INTERNAL_SERVER_ERROR.code,
          STATUS_CODES.INTERNAL_SERVER_ERROR.status,
          err.message,
          undefined
        )
      );
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting todo`);

  try {
    const { rowCount } = await pool.query(QUERY.SELECT_TODO, [req.params.id]);
    if (rowCount === 0) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
        .json(
          new Res(
            STATUS_CODES.INTERNAL_SERVER_ERROR.code,
            STATUS_CODES.INTERNAL_SERVER_ERROR.status,
            `There's no such todo of id ${req.params.id}`,
            undefined
          )
        );
    }
    const { rows } = await pool.query(QUERY.DELETE_TODO, [req.params.id]);

    return res.status(STATUS_CODES.OK.code).json(
      new Res(STATUS_CODES.OK.code, STATUS_CODES.OK.status, `Todo deleted`, {
        todo: rows[0],
      })
    );
  } catch (err) {
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR.code)
      .json(
        new Res(
          STATUS_CODES.INTERNAL_SERVER_ERROR.code,
          STATUS_CODES.INTERNAL_SERVER_ERROR.status,
          err.message,
          undefined
        )
      );
  }
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
  createTable,
  deleteTodo,
  getTables,
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
      "This is the backend server for PG database server.",
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

router.route("/api/v1/").get(getTodos).post(addTodo);
router.route("/api/v1/:id").get(getTodo).put(updateTodo).delete(deleteTodo);
router.route("/admin/tables").get(getTables);
router.route("/admin/create-table").get(createTable);

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

> In the router we have added two admin routes, for creating tables and getting all the tables.

### Docker

Now that we have created our server we need to connect to the database. So we are going to use docker to do this. First we will create a `docker-compose.yml` file in the root folder of our project and add the following configuration to it:

```yml
version: "3.9"
services:
  postgresdb:
    image: postgres:14.4-alpine
    container_name: pgsql
    restart: always
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/0_init.sql
      # - $HOME/database:/var/lib/postgresql/data
    ports:
      - "8081:5432"
    expose:
      - "8081"
    environment:
      POSTGRES_DB: todos
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      SERVICE_TAGS: dev
      SERVICE_NAME: postgresdb
    networks:
      - internalnet
networks:
  internalnet:
    driver: bridge
```

Now we can start our container by running the command:

```shell
docker compose up -d
```

And we will get the following as output if we run the `ps` command:

```shell
CONTAINER ID   IMAGE                  COMMAND                  CREATED             STATUS                          PORTS                              NAMES
39cf6b67f8f0   postgres:14.4-alpine   "docker-entrypoint.s…"   55 minutes ago      Up 55 minutes                   8081/tcp, 0.0.0.0:8081->5432/tcp   pgsql
```

If we start our node application we will be able to make `API` request to the server and see the logs in the console which may look as follows:

```shell
[2022/08/03, 11:10:39] INFO: The server is running on port: 3002
[2022/08/03, 11:10:39] INFO: Local: http://127.0.0.1:3002
[2022/08/03, 11:10:39] INFO: Network: http://192.*.*.*:3002
[2022/08/03, 11:10:50] INFO: POST /api/v1, creating todo
[2022/08/03, 11:10:56] INFO: method: GET route: /api/v1
[2022/08/03, 11:11:14] INFO: method: GET route: /api/v1/1
[2022/08/03, 11:11:22] INFO: DELETE /api/v1/3, deleting todo
[2022/08/03, 11:11:31] INFO: method: GET route: /api/v1/3
[2022/08/03, 11:12:02] INFO: PUT /api/v1/3, updating todo
[2022/08/03, 11:12:11] INFO: method: GET route: /api/v1/3
[2022/08/03, 11:12:19] INFO: method: GET route: /api/v1/2
[2022/08/03, 11:12:23] INFO: PUT /api/v1/2, updating todo
[2022/08/03, 11:12:29] INFO: method: GET route: /api/v1/2

```

### Dockerizing the Node App.

Now that we have our server running, it's now time for us to create a `Dockerfile` for building our `node-server` image. In the this file we are going to add the following to it.

```Dockerfile
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
```

> It seems like we don't need to install yarn as it exists in `node` image.

Now that we have our simple Dockerfile we can go ahead and modify our `docker-compose` file to look as follows

```yml
version: "3.9"
services:
  postgresdb:
    image: postgres:14.4-alpine
    container_name: pgsql
    restart: always
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/0_init.sql
      # - $HOME/database:/var/lib/postgresql/data
    ports:
      - "5232:5432"
    expose:
      - "5232"
    environment:
      POSTGRES_DB: todos
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      SERVICE_TAGS: dev
      SERVICE_NAME: postgresdb
    networks:
      - internalnet

  nodeapp:
    container_name: server
    build: .
    image: nodeapp:1.0
    ports:
      - "3002:3002"
    expose:
      - "3002"
    environment:
      DB_HOST: postgresdb
      DB_PORT: 5432
      DB_USER: "admin"
      DB_PASSWORD: "password"
      DB_NAME: todos
      DB_CONNECTION_LIMIT: 20
      SERVICE_TAGS: dev
      SERVICE_NAME: nodeapp
      PORT: 3002
    depends_on:
      - postgresdb
    networks:
      - internalnet

networks:
  internalnet:
    driver: bridge
```

Now if we run the `ps` command we will get the following output:

```shell
CONTAINER ID   IMAGE                  COMMAND                  CREATED          STATUS         PORTS                              NAMES
e1a92b4de324   nodeapp:1.0            "docker-entrypoint.s…"   11 seconds ago   Up 5 seconds   0.0.0.0:3002->3002/tcp             server
495e093488a6   postgres:14.4-alpine   "docker-entrypoint.s…"   13 seconds ago   Up 7 seconds   5232/tcp, 0.0.0.0:5232->5432/tcp   pgsql
```
