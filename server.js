// Load environment variables
import "dotenv/config";

import cors from "cors";
import express from "express";
import { connectDB } from "./src/config/db.js";

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Define routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Finease API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Function to start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
