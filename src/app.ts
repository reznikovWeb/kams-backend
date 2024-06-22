import express from "express";
import { coursesRouter } from "./routes/courses-router";
import { testRouter } from "./routes/test-router";

export const app = express();
// Middleware
// Добавили для того, чтобы body конвертировался из байтов в JSON
export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);
app.use("/courses", coursesRouter);
app.use("/__test__", testRouter);
