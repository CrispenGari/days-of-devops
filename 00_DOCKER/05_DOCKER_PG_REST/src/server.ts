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
