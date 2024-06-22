import { Router } from "express";
import { db } from "../db/db";
import { HTTP_STATUSES } from "../utils";

export const testRouter = Router({});

// Временная заглушка для тестов
testRouter.delete("/data", (req, res) => {
  db.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
