const mongoose = require("mongoose");

async function connectDB() {
  try {
    // Validate that the connection string exists
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set.");
    }
    // Connect to Azure Cosmos DB
    await mongoose.connect(process.env.MONGO_URI, {
      retryWrites: false, // Required for Cosmos DB
      tls: true, // Ensure secure connection
      tlsAllowInvalidCertificates: true, 
    });

    // Set up connection event listeners
    const db = mongoose.connection;
    db.on("error", (error) => {
      console.error("Database connection error:", error);
    });

    await db.once("open", () => {
      console.log("Connected to Azure Cosmos DB");
    });

    console.log("Connected to Azure Cosmos")
  } catch (error) {
    console.error("Error connecting to Azure Cosmos DB:", error.message);
  }
}

module.exports = connectDB;
