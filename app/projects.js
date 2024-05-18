const express = require("express");
const multer = require("multer");
const nanoid = require("nanoid");
const Project = require("../models/project.model");
const config = require("../config");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  const projects = await Project.find();
  res.send(projects);
});

router.post("/", upload.single("thumbImg"), async (req, res) => {
  try {
    const data = req.body;
    const projectData = {
      name: data.name,
      type: data.type,
      start: data.start,
      end: data.end,
      bgColor: data.bgColor,
      textColor: data.textColor,
    };
    if (req.file) {
      projectData.thumbImg = req.file.filename;
    }
    const project = new Project(projectData);
    await project.save();
    return res.status(200).json({ id: project._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
