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

// Forgot Password - Generate password reset link
authRoutes.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate password reset link using Firebase Admin SDK
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: `http://localhost:5173/reset-password?oobCode=${resetCode}`, // Frontend URL
      handleCodeInApp: false,
    });

    // In production, you would send this via email service
    // For now, we'll return it in response for development
    res.status(200).json({
      message: "Password reset link generated",
      resetLink, // Remove this in production
    });
  } catch (error) {
    console.error("Error generating reset link:", error);
    res.status(500).json({ message: "Error generating reset link" });
  }
});

// Verify Reset Code
authRoutes.post("/verify-reset-code", async (req, res) => {
  try {
    const { oobCode } = req.body;

    if (!oobCode) {
      return res.status(400).json({ message: "Reset code is required" });
    }

    // Verify the reset code
    const email = await admin.auth().verifyPasswordResetCode(oobCode);

    res.status(200).json({
      message: "Reset code verified",
      email,
    });
  } catch (error) {
    console.error("Error verifying reset code:", error);
    res.status(400).json({ message: "Invalid or expired reset code" });
  }
});

// Reset Password
authRoutes.post("/reset-password", async (req, res) => {
  try {
    const { oobCode, newPassword } = req.body;

    if (!oobCode || !newPassword) {
      return res
        .status(400)
        .json({ message: "Reset code and new password are required" });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter",
      });
    }

    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({
        message: "Password must contain at least one lowercase letter",
      });
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return res.status(400).json({
        message: "Password must contain at least one special character",
      });
    }

    // Reset the password
    await admin.auth().confirmPasswordReset(oobCode, newPassword);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(400).json({ message: "Invalid or expired reset code" });
  }
});

export default authRoutes;
