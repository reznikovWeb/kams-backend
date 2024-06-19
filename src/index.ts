import express, { Request, Response } from "express";
import bodyParser from "body-parser";

export const app = express();
const port = process.env.PORT || 3000;

export const HTTP_STATUSES = {
  OK: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

// Middleware
// Добавили для того, чтобы body конвертировался из байтов в JSON
const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const db = {
  courses: [
    { id: 1, title: "front-end" },
    { id: 2, title: "back-end" },
    { id: 3, title: "qa" },
    { id: 4, title: "devops" },
  ],
};

// GET запросы -----------------------------------------------------
// Здесь добавили query параметры
app.get("/courses", (req: Request, res: Response) => {
  let foundedCourses = db.courses;

  if (req.query.title) {
    const searchString = req.query.title.toString();
    foundedCourses = foundedCourses.filter(
      (c) => c.title.indexOf(searchString) > -1,
    );
  }

  res.json(foundedCourses);
});

// Вот так в express  создается динамический роут с URI параметром
app.get("/courses/:id", (req: Request, res: Response) => {
  // Параметры из URI всегда имеют тип string
  const foundCourse = db.courses.find((c) => +req.params.id === c.id);

  if (!foundCourse) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  res.json(foundCourse);
});

// DELETE запросы -----------------------------------------------------
app.delete("/courses/:id", (req: Request, res: Response) => {
  db.courses = db.courses.filter((c) => +req.params.id !== c.id);

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

// POST запросы -----------------------------------------------------
app.post("/courses", (req: Request, res: Response) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const createdCourse = {
    id: +new Date(),
    title: req.body.title,
  };
  db.courses.push(createdCourse);

  // Добавляем статус + возращаем созданную сущность
  res.status(201).json(createdCourse);
});
//

// PUT запросы -----------------------------------------------------
app.put("/courses/:id", (req: Request, res: Response) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  // Параметры из URI всегда имеют тип string
  const foundCourse = db.courses.find((c) => +req.params.id === c.id);

  if (!foundCourse) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  foundCourse.title = req.body.title;

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

// Временная заглушка для тестов
app.delete("/__test__/data", (req, res) => {
  db.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

// Выполняется при запуске приложения
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
