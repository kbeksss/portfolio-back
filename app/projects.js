const express = require("express");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const Project = require("../models/project.model");
const path = require("path");
const nanoid = require("nanoid");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const router = express.Router();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;

const s3 = new S3Client({ region: bucketRegion });

router.get("/", async (req, res) => {
  const projects = await Project.find();
  for (const project of projects) {
    if (project.thumbImg) {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: project.thumbImg,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      project.thumbImg = url;
    }
  }
  res.status(200).send(projects);
});

router.post("/", async (req, res) => {
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
      const fileName = nanoid() + path.extname(req.file.originalname);
      projectData.thumbImg = fileName;
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });
      await s3.send(command);
    }
    const project = new Project(projectData);
    await project.save();
    return res.status(200).json({ id: project._id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/", async (req, res) => {
  const id = req.params.id;
  try {
    const project = await Project.findById(id);
    if (project) {
      if (project.thumbImg) {
        const command = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: project.thumbImg,
        });
        await s3.send(command);
      }
      await Project.findByIdAndDelete(id);
      return res.status(200).json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
