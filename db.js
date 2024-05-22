require("dotenv").config();
const mongoose = require("mongoose");
const config = require("./config");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.database);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
