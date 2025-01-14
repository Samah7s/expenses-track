import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(process.env.PORT || 3000, () => {
  console.log(`server running at port: ${process.env.PORT}`);
});
