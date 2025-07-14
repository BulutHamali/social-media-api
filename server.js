import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri);

// Global variable to track DB connection status
let dbConnected = false;

// Attempt to connect to the database before starting the server
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to the database.");
    dbConnected = true;

    // Start the server only if DB connection succeeds
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
  }
}

app.get("/", (req, res) => {
  if (!dbConnected) {
    return res.status(500).json({ message: "Failed to connect to the database." });
  }
  res.send("Hello, from API!");
});

run().catch((err) => {
  console.error("Unexpected error during run:", err.message);
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));