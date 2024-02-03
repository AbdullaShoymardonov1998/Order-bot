require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { logger } = require("./config/logger");
const { config } = require("./config/index");
const { router } = require("./router");
const { STATUS_FAILED } = require("./states");
const app = express();

// set timezone
process.env.TZ = "Asia/Tashkent";

const mongoDBUrl =
  "mongodb://" +
  config.mongoUser +
  ":" +
  config.mongoPassword +
  "@" +
  config.mongoHost +
  ":" +
  config.mongoPort +
  "/" +
  config.mongoDatabase;

logger.info("Connecting to db " + mongoDBUrl);

mongoose.connect(
  mongoDBUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      logger.error(
        "There is an error in connecting db (" +
          mongoDBUrl +
          "): " +
          err.message
      );
      process.exit(1);
    }
  }
);

mongoose.connection.once("open", () => {
  logger.info("Connected to the database");
});

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  logger.info(`Request: [${req.method}]${req.originalUrl}`, {
    params: req.query,
    body: req.body,
  });
  next();
});

app.use("/", router);

app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    logger.error(`[Joi] Error occured: ${err.error}`, err.error);
    return res.status(400).json({
      status: STATUS_FAILED,
      type: err.type,
      message: err.error.toString(),
    });
  }

  logger.error(`Error occured: ${err.message}, ${err.stack}`, err);

  res.status(err.statusCode ? err.statusCode : 500).json({
    status: STATUS_FAILED,
    message: err.message,
    data: err.body ? err.body : [],
  });
});

const port = config.HTTPPORT;
app.listen(port, (err) => {
  if (err) {
    logger.error("Error on starting server:" + err.message);
    process.exit(1);
  }
  logger.info("Server started on localhost:" + port);
});

process.on("uncaughtException", (error) => {
  logger.error("Server crashed: ", error);
  process.exit(1);
});
