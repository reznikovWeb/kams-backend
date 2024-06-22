export const db = {
  courses: [
    { id: 1, title: "front-end" },
    { id: 2, title: "back-end" },
    { id: 3, title: "qa" },
    { id: 4, title: "devops" },
  ],
};
export type DbCourseType = {
  id: number;
  title: string;
};

export const coursesRepository = {
  findCourse(title: string) {
    let foundedCourses = db.courses;
    if (title) {
      const searchString = title.toString();
      foundedCourses = foundedCourses.filter(
        (c) => c.title.indexOf(searchString) > -1,
      );
    }
    return foundedCourses;
  },
  findCourseById(id: number) {
    return db.courses.find((c) => id === c.id);
  },
  createCourse(title: string) {
    const createdCourse: DbCourseType = {
      id: +new Date(),
      title,
    };
    db.courses.push(createdCourse);
    return createdCourse;
  },
  updateCourse(id: number, title: string) {
    const foundCourse = db.courses.find((c) => id === c.id);

    if (!foundCourse) {
      return false;
    }

    foundCourse.title = title;

    return true;
  },
  deleteCourse(id: number) {
    db.courses = db.courses.filter((c) => id !== c.id);
  },
};
