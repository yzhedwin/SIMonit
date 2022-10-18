#!/usr/bin/env node
//Rest API
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const indexRouter = require("./routes/index");
const {
  PORT,
  dashURL,
  staticURL,
  dashInfluxToken,
  staticInfluxToken,
} = require("./config/constants");

//Initialize instance with specified url
const dashInfluxProxy = axios.create({
  dashURL,
  headers: {
    Authorization: `Token ${dashInfluxToken}`,
    "Content-Type": "application/json",
  },
});

const staticInfluxProxy = axios.create({
  staticURL,
  headers: {
    Authorization: `Token ${staticInfluxToken}`,
    "Content-Type": "application/json",
  },
});

// Start the server
const app = express();
app.use(cors());
app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`listening on port :${PORT}`);
});