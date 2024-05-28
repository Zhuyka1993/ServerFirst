//містить код для визначення маршрутів Express, які обробляють запити до MALTеR API

// Підключаємо express
import express from "express";
// Імпорт бази даних з файлу db.js
import db from "./db.js";
import Product from "./models/Product.js";
import multer from "multer";
//--------
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

// Створюємо екземпляр нашого сервера
const app = express();
const port = 3000; // Визначаємо порт, на якому буде працювати сервер

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Налаштування multer для зберігання зображень
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Обслуговування статичних файлів ОБОВ'ЯЗКОВО!!!!!!!!!!!!!!!!!!!!
app.use("/upload", express.static("upload"));

// Роут для створення продуктів без зображення
app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const newProduct = new Product({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      //image: imagePath,
      image: req.file ? req.file.path : "",
      type: req.body.type,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Роут для отримання продуктів
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (err) {
    res.status(500).send("Помилка отримання даних про продукти");
  }
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
    res.status(500).send("Error deleting product");
  }
});

// PUT /products/:id - Обновлення продукту
app.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const updatedProduct = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    type: req.body.type,
  };

  try {
    await Product.findByIdAndUpdate(productId, updatedProduct, {
      runValidators: true,
    });
    res.send("Product updated successfully");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Error updating product");
  }
});

// Слухаємо сервер на визначеному порті
app.listen(port, () => {
  console.log(`Сервер запущено на порті ${port}`);
});
