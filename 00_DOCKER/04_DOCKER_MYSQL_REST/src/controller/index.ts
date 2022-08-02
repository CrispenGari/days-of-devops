import { Request, Response } from "express";
import { QUERY, STATUS_CODES } from "../constants";
import { Response as Res } from "../domain";
import { pool } from "../pool";
import { logger } from "../utils";

export const getTodos = (req: Request, res: Response) => {
  logger.info(`method: ${req.method} route: ${req.originalUrl}`);
  pool.query(QUERY.SELECT_TODOS, (err, todos) => {
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
  });
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
