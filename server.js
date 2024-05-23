// Підключаємо express
import express from "express";
//імпорт бази даних з файлу дб.джс
import db from "./db.js";
import Product from "./models/Product.js";

import bodyParser from "body-parser";

// Створюємо екземпляр нашого сервера
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000; // Визначаємо порт, на якому буде працювати сервер

// // Роут для головної сторінки
// app.get("/", (req, res) => {
//   res.send("Привіт, світ!");
// });

// Роут для продуктів
app.post("/products", (req, res) => {
  const product = new Product({
    id: req.body.id,
    title: req.body.title,
    price: req.body.price,
    description: req.body.description, // Додаємо опис
    image: req.body.image, // Додаємо зображення
  });

  product.save().then((data) => {
    res.send("Saved to DB");
  });
});

// Роут для отримання продуктів
app.get("/products", (req, res) => {
  // Отримати дані продуктів з бази даних або іншого джерела
  Product.find({})
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      res.status(500).send("Помилка отримання даних про продукти");
    });
});

// Роут для видалення продукта
app.delete("/products/:id", async (req, res) => {
  const productId = req.params.id; // Отримати ідентифікатор продукта з URL

  // Здійснити видалення продукта за його ідентифікатором
  try {
    await Product.findByIdAndDelete(productId);
    res.send("Product deleted successfully");
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send("Error deleting product500");
  }
});

// PUT /products/:id - Обновление продукта, rout
app.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const updatedProduct = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
  };

  try {
    await Product.findByIdAndUpdate(productId, updatedProduct);
    res.send("Product updated successfully");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Error updating product");
  }
});

// // Роут для сторінки "Контакти"
// app.get("/contact", (req, res) => {
//   res.send("Спілкуйтеся з нами там");
// });

// Слухаємо сервер на визначеному порті
app.listen(port, () => {
  console.log(`Сервер запущено на порті ${port}`);
});
