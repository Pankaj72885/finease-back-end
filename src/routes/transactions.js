import express from "express";
import verifyToken from "../middleware/auth.js";
import {
  createTransaction,
  getTransactionsByUser,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../models/Transaction.js";

const transactionRoutes = express.Router();

// Get all transactions for a user
transactionRoutes.get("/", verifyToken, async (req, res) => {
  try {
    const { userEmail, sortBy, sortOrder } = req.query;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const transactions = await getTransactionsByUser(userEmail, sortOptions);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single transaction
// transactionRoutes.get("/:id", verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const transaction = await getTransactionById(id);

//     if (!transaction) {
//       return res.status(404).json({ message: "Transaction not found" });
//     }

//     // Verify user owns the transaction
//     if (transaction.userId !== req.user.uid) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     res.status(200).json(transaction);
//   } catch (error) {
//     console.error("Error fetching transaction:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// Get a single transaction
transactionRoutes.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid; // <-- 1. Get the userId from the token

    // 2. Pass BOTH arguments to the model function
    const transaction = await getTransactionById(id, userId); 

    if (!transaction) {
      // This now handles "Not Found" AND "Unauthorized" at the same time
      return res.status(404).json({ message: "Transaction not found" });
    }

    // 3. This check is no longer needed, the database already did it!
    // if (transaction.userId !== req.user.uid) { ... }

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Create a new transaction
transactionRoutes.post("/", verifyToken, async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      userId: req.user.uid,
    };

    const result = await createTransaction(transactionData);
    res.status(201).json({
      message: "Transaction created successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a transaction
transactionRoutes.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const result = await updateTransaction(id, userId, req.body);

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or unauthorized" });
    }

    res.status(200).json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a transaction
transactionRoutes.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const result = await deleteTransaction(id, userId);

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or unauthorized" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default transactionRoutes;
