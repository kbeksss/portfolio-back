const path = require("path");

const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, "public", "uploads"),
  database:
    process.env.MONGO_DB_STRING,
};
