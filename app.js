const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user.router");
const itemsRouter = require("./routes/item.router");

const app = express();

// can be extracted to some db conn factory to loosely couple used databases
const { MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } = process.env;
const MONGO_DB_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;

mongoose.connect(
  MONGO_DB_URL,
  { useNewUrlParser: true }
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/items", itemsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development"
    ? err
    : {};

  // render the error page
  res.status(err.status || 500).send(err.body);
});

module.exports = app;
