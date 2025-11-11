// Corrected code for src/routes/auth.js
import express from "express";
import admin from "../config/firebase-admin.js";

const authRoutes = express.Router();

// 👇 Use authRoutes here, not router
authRoutes.post("/verify-token", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.status(200).json({ user: decodedToken });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default authRoutes;
