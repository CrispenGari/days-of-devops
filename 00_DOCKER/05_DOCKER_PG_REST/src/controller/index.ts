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
