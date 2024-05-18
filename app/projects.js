const express = require("express");

const Project = require("../models/project.model");
const router = express.Router();

router.get("/", async (req, res) => {
  const projects = await Project.find();
  res.send(projects);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  res.send(req.body );
});

module.exports = router;
