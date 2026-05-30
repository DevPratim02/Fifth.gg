const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { httpLogger } = require("./config/logger");
const routes = require("./routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(httpLogger);

app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;
