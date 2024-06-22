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
