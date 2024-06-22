import { Router } from "express";
import { HTTP_STATUSES } from "../utils";
import { db } from "../repositories/courses-repository";

export const testRouter = Router({});

// Временная заглушка для тестов
testRouter.delete("/data", (req, res) => {
  db.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
