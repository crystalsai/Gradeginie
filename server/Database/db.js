require("dotenv").config();
const dns = require("dns");
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

let connectionPromise;

const connectToMongo = async () => {
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  try {
    connectionPromise = mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
    });
    await connectionPromise;
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
};

module.exports = connectToMongo;
