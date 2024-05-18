const { Schema, mongoose } = require("mongoose");

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  start: Date,
  end: Date,
  bgColor: String,
  textColor: String,
  img: String
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
