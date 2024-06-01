import express, { Request, Response } from "express";
const app = express();
const port = 3000;

// Слушаем GET запрос
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!!!!");
  res.send("Hello World!!!!");
});

// Выполняется при запуске приложения
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
