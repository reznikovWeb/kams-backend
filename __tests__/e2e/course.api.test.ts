import request from "supertest";
import type { CreateCourseDto } from "../../src/dto/CreateCourseDto";
import { UpdateCourseDto } from "../../src/dto/UpdateCourseDto";
import { app } from "../../src/app";
import { HTTP_STATUSES } from "../../src/utils";

// Supertest сам поднимает приложение за нас
// Здесь имитируется работа постмана - сначала чистятся данные, потом создаются, потом обновляются
// Поэтому эти тесты нужно запускать пачкой, друг за другом, а не по отдельности
describe("/course", () => {
  beforeAll(async () => {
    await request(app).delete("/__test__/data");
  });

  it("should return 200 and empty array", async () => {
    await request(app).get("/courses").expect(HTTP_STATUSES.OK, []);
  });

  it("should return 404 for non existing course", async () => {
    await request(app).get("/courses/1").expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should not create course with incorrect data", async () => {
    await request(app)
      .post("/courses")
      .send({ title: "" })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app).get("/courses").expect(HTTP_STATUSES.OK, []);
  });

  let createdCourse: any;
  it("should create course with correct data", async () => {
    const data: CreateCourseDto = { title: "test course" };
    const response = await request(app)
      .post("/courses")
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);

    createdCourse = response.body;

    expect(createdCourse).toEqual({
      title: "test course",
      id: expect.any(Number),
    });

    await request(app)
      .get("/courses")
      .expect(HTTP_STATUSES.OK, [createdCourse]);
  });

  it("should not update course with incorrect data", async () => {
    await request(app)
      .put(`/courses/${createdCourse.id}`)
      .send({ title: "" })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(`/courses/${createdCourse.id}`)
      .expect(HTTP_STATUSES.OK, createdCourse);
  });

  it("should not update course that not exist", async () => {
    const data: UpdateCourseDto = { title: "good title" };
    await request(app)
      .put(`/courses/-100`)
      .send(data)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should update course with correct input data", async () => {
    const data: UpdateCourseDto = { title: "good new title" };
    await request(app)
      .put(`/courses/${createdCourse.id}`)
      .send(data)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`/courses/${createdCourse.id}`)
      .expect(HTTP_STATUSES.OK, { ...createdCourse, ...data });
  });

  it("should delete course", async () => {
    await request(app)
      .delete(`/courses/${createdCourse.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app).get(`/courses`).expect(HTTP_STATUSES.OK, []);
  });
});
