const { Schema, mongoose } = require("mongoose");

const RoleSchema = new Schema({
  value: {
    type: String,
    unique: true,
    default: "USER",
  },
});

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;
