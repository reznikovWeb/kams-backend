import express, { Request, Response } from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

let products = [
  { id: 1, title: "tomato" },
  { id: 2, title: "orange" },
];
const addresses = [
  { id: 1, value: "address 1" },
  { id: 2, value: "address 2" },
];
// Middleware
// Добавили для того, чтобы body конвертировался из байтов в JSON
// deprecated
const parserMiddleware = bodyParser({});
app.use(parserMiddleware);

// GET запросы -----------------------------------------------------
// Здесь добавили query параметры
app.get("/products", (req: Request, res: Response) => {
  if (req.query.title) {
    const searchString = req.query.title.toString();
    res.send(products.filter((p) => p.title.indexOf(searchString) > -1));
  } else {
    res.send(products);
  }
});
// Вот так в express  создается динамический роут с URI параметром
app.get("/products/:id", (req: Request, res: Response) => {
  // Параметры из URI всегда имеют тип string
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

// DELETE запросы -----------------------------------------------------
app.delete("/products/:id", (req: Request, res: Response) => {
  let status = 404;
  products = products.filter((p) => {
    if (p.id !== +req.params.id) {
      status = 204;
      return true;
    }
  });
  res.send(status);
});

// POST запросы -----------------------------------------------------
app.post("/products", (req: Request, res: Response) => {
  const newProduct = { id: +new Date(), title: req.body.title };
  products.push(newProduct);
  // Добавляем статус + возращаем созданную сущность
  res.status(201).send(newProduct);
});

// PUT запросы -----------------------------------------------------
app.put("/products/:id", (req: Request, res: Response) => {
  // Параметры из URI всегда имеют тип string
  const product = products.find((p) => +req.params.id === p.id);
  if (product) {
    product.title = req.body.title;
    res.send(product);
  } else {
    // Фишка express - если кинуть сюда код ошибки, то он будет возвращать
    // на клиент такой статус код (deprecated)
    res.send(404);
  }
});
// Выполняется при запуске приложения
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
