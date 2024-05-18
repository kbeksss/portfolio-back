const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const config = require("./config");
const projectsRouter = require("./app/projects");

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

const run = async () => {
  try {
    await mongoose.connect(config.database);
    console.log("DB is connected successfully");
  } catch (e) {
    console.error("not connected to DB", e);
  }
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/projects", projectsRouter);

  app.listen(port, () => {
    console.log("HTTP Server running on port: " + port);
  });
};

run().catch((e) => console.error(e));
