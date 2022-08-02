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
  SELECT_TODOS: "SELECT * FROM todos ORDER BY created_at DESC LIMIT 100",
  SELECT_TODO: "SELECT * FROM todos WHERE id = ?",
  CREATE_TODO: "INSERT INTO todos (title) VALUES (?)",
  UPDATE_TODO: "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
  DELETE_TODO: "DELETE FROM todos WHERE id = ?",
};
