require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // In Docker environment, "mongo" is the service name
    // In local development, use localhost
    const mongoURI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/UserDb";

    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);

    // Connection with retry logic
    let retries = 5;
    while (retries) {
      try {
        await mongoose.connect(mongoURI);
        console.log("Database Connected Successfully");
        break;
      } catch (err) {
        console.log(`Connection attempt failed, retries left: ${retries}`);
        retries -= 1;
        // Wait for 5 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
