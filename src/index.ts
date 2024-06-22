import { app } from "./app";

const port = process.env.PORT || 3000;
// Выполняется при запуске приложения
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
