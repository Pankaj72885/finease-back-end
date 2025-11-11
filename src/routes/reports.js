import express from "express";
import verifyToken from "../middleware/auth.js";
import {
  getTransactionsByUser,
  getTransactionsByCategory,
  getMonthlyTransactions,
} from "../models/Transaction.js";

const router = express.Router();

// Get financial summary
router.get("/summary", verifyToken, async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    const transactions = await getTransactionsByUser(userEmail);

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "Income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get category-wise breakdown
router.get("/by-category", verifyToken, async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    const categoryTotals = await getTransactionsByCategory(userEmail);

    res.status(200).json(categoryTotals);
  } catch (error) {
    console.error("Error fetching category breakdown:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get monthly data for charts
router.get("/monthly", verifyToken, async (req, res) => {
  try {
    const { userEmail, year } = req.query;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const monthlyData = await getMonthlyTransactions(userEmail, currentYear);

    // Format data for charts
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedData = monthlyData.map((data, index) => ({
      month: months[index],
      income: data.income,
      expense: data.expense,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
