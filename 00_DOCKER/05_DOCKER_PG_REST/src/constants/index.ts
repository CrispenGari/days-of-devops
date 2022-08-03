// status codes
export const STATUS_CODES = {
  OK: { code: 200, status: "OK" },
  CREATED: { code: 201, status: "CREATED" },
  NO_CONTENT: { code: 204, status: "NO CONTENT" },
  BAD_REQUEST: { code: 400, status: "BAD REQUEST" },
  NOT_FOUND: { code: 404, status: "NOT FOUND" },
  INTERNAL_SERVER_ERROR: { code: 500, status: "INTERNAL SERVER ERROR" },
};

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
