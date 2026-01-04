// Load environment variables
import "dotenv/config";

import cors from "cors";
import express from "express";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import blogRoutes from "./src/routes/blogs.js";
import reportRoutes from "./src/routes/reports.js";
import transactionRoutes from "./src/routes/transactions.js";

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Ensure DB is connected (Critical for Vercel/Serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

const PORT = process.env.PORT || 5000;

// Define routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Finease API" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/blogs", blogRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
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

if (process.env.VERCEL !== "1") {
  startServer();
}

export default app;

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
