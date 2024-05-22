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
  start: String,
  end: String,
  bgColor: String,
  textColor: String,
  thumbImg: String,
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
