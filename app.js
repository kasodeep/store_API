// Imports
require("dotenv").config();
require("express-async-errors");

const express = require("express");
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const connectToMongo = require("./db/connect");

const productRouter = require("./routes/products");
const app = express();
const port = process.env.PORT;

// middleware
app.use(express.json());

app.use("/api/v1/products", productRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const start = async () => {
  try {
    await connectToMongo();
    app.listen(port, () => {
      console.log(`Server started on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
