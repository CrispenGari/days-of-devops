import express from "express";
import cors from "cors";
import router from "./routes";
import _ from "node-env-types";
_();

// ----
const app: express.Application = express();
const PORT: any = 3003 || process.env.PORT;

//
app.use(cors());

app.use(express.json());
app.use(router);
app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
