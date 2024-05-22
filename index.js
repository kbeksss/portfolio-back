require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRouter = require("./app/auth");
const projectsRouter = require("./app/projects");
const upload = require("./middlewares/upload");
const connectToDatabase = require("./db");
const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

const run = async () => {
  await connectToDatabase();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  app.use("/api/auth", authRouter);
  app.use("/api/projects", upload.single("thumbImg"), projectsRouter);

  app.listen(port, () => {
    console.log("HTTP Server running on port: " + port);
  });
};

run().catch((e) => console.error(e));
