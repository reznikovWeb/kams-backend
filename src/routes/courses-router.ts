import { Router, Response } from "express";
import { db, DbCourseType } from "../db/db";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types";
import { GetCourseQueryDto } from "../dto/GetCourseQueryDto";
import { CourseViewDto } from "../dto/CourseViewDto";
import { URIParamsCourseIdDto } from "../dto/URIParamsCourseIdDto";
import { HTTP_STATUSES } from "../utils";
import { CreateCourseDto } from "../dto/CreateCourseDto";
import { UpdateCourseDto } from "../dto/UpdateCourseDto";

export const mapDbCourseToViewDto = (dbCourse: DbCourseType) => {
  return { title: dbCourse.title, id: dbCourse.id };
};

export const coursesRouter = Router({});

// GET запросы -----------------------------------------------------
// Здесь добавили query параметры
coursesRouter.get(
  "/",
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
coursesRouter.get(
  "/:id",
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
coursesRouter.post(
  "/",
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
coursesRouter.delete(
  "/:id",
  (req: RequestWithParams<URIParamsCourseIdDto>, res: Response) => {
    db.courses = db.courses.filter((c) => +req.params.id !== c.id);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  },
);

// PUT запросы -----------------------------------------------------
coursesRouter.put(
  "/:id",
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
