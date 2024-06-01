import express, { Request, Response } from "express";
import e from "express";

const app = express();
const port = process.env.PORT || 3000;

const products = [
  { id: 1, title: "tomato" },
  { id: 2, title: "orange" },
];
const addresses = [{ value: "a" }, { value: "b" }];

// Здесь добавили query параметры
app.get("/products", (req: Request, res: Response) => {
  if (req.query.title) {
    const searchString = req.query.title.toString();
    res.send(products.filter((p) => p.title.indexOf(searchString) > -1));
  } else {
    res.send(products);
  }
});

// Вот в express  создается динамический роут с URI параметром
app.get("/products/:id", (req: Request, res: Response) => {
  const product = products.find((p) => +req.params.id === p.id);
  if (product) {
    res.send(product);
  } else {
    // Фишка express - если кинуть сюда код ошибки, то он будет возвращать
    // на клиент такой статус код (deprecated)
    res.send(404);
  }
});

app.get("/addresses", (req: Request, res: Response) => {
  res.send(addresses);
});

// Выполняется при запуске приложения
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
