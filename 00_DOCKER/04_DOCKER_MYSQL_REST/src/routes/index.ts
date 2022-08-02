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

router.route("/api/v1/").get(getTodos).post(addTodo);
router.route("/api/v1/:id").get(getTodo).put(updateTodo).delete(deleteTodo);

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
