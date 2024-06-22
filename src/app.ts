import express, { Response } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "./types";
import { GetCourseQueryDto } from "./dto/GetCourseQueryDto";
import { CourseViewDto } from "./dto/CourseViewDto";
import { URIParamsCourseIdDto } from "./dto/URIParamsCourseIdDto";
import { CreateCourseDto } from "./dto/CreateCourseDto";
import { UpdateCourseDto } from "./dto/UpdateCourseDto";
import { db, DbCourseType } from "./db/db";
import { HTTP_STATUSES } from "./utils";

export const app = express();
// Middleware
// Добавили для того, чтобы body конвертировался из байтов в JSON
export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

const mapDbCourseToViewDto = (dbCourse: DbCourseType) => {
  return { title: dbCourse.title, id: dbCourse.id };
};

// GET запросы -----------------------------------------------------
// Здесь добавили query параметры
app.get(
  "/courses",
  (
    req: RequestWithQuery<GetCourseQueryDto>,
    res: Response<CourseViewDto[]>,
  ) => {
    let foundedCourses = db.courses;

    if (req.query.title) {
      const searchString = req.query.title.toString();
      foundedCourses = foundedCourses.filter(
        (c) => c.title.indexOf(searchString) > -1,
      );
    }

    res.json(foundedCourses.map(mapDbCourseToViewDto));
  },
);

// Вот так в express  создается динамический роут с URI параметром
app.get(
  "/courses/:id",
  (
    req: RequestWithParams<URIParamsCourseIdDto>,
    res: Response<CourseViewDto>,
  ) => {
    // Параметры из URI всегда имеют тип string
    const foundCourse = db.courses.find((c) => +req.params.id === c.id);

    if (!foundCourse) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    res.json(mapDbCourseToViewDto(foundCourse));
  },
);

// POST запросы -----------------------------------------------------
app.post(
  "/courses",
  (req: RequestWithBody<CreateCourseDto>, res: Response<DbCourseType>) => {
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const createdCourse: DbCourseType = {
      id: +new Date(),
      title: req.body.title,
    };
    db.courses.push(createdCourse);

    // Добавляем статус + возращаем созданную сущность
    // Используем mapper => из БД на ФРОНТ
    res.status(201).json(mapDbCourseToViewDto(createdCourse));
  },
);
//

// DELETE запросы -----------------------------------------------------
app.delete(
  "/courses/:id",
  (req: RequestWithParams<URIParamsCourseIdDto>, res: Response) => {
    db.courses = db.courses.filter((c) => +req.params.id !== c.id);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  },
);

// PUT запросы -----------------------------------------------------
app.put(
  "/courses/:id",
  (
    req: RequestWithParamsAndBody<{ id: string }, UpdateCourseDto>,
    res: Response,
  ) => {
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
  },
);

// Временная заглушка для тестов
app.delete("/__test__/data", (req, res) => {
  db.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
