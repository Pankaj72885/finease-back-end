import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export const createTransaction = async (transactionData) => {
  const db = getDB();
  const result = await db.collection("transactions").insertOne({
    ...transactionData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
};

export const getTransactionsByUser = async (userEmail, sortOptions = {}) => {
  const db = getDB();
  const defaultSort = { createdAt: -1 };
  const sort = { ...defaultSort, ...sortOptions };

  const transactions = await db
    .collection("transactions")
    .find({ userEmail })
    .sort(sort)
    .toArray();

  return transactions;
};

export const getTransactionById = async (id) => {
  const db = getDB();
  const transaction = await db
    .collection("transactions")
    .findOne({ _id: new ObjectId(id) });

  return transaction;
};

export const updateTransaction = async (id, userId, updateData) => {
  const db = getDB();
  const result = await db
    .collection("transactions")
    .updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

  return result;
};

export const deleteTransaction = async (id, userId) => {
  const db = getDB();
  const result = await db
    .collection("transactions")
    .deleteOne({ _id: new ObjectId(id), userId });

  return result;
};

export const getTransactionsByCategory = async (userEmail) => {
  const db = getDB();
  const transactions = await db
    .collection("transactions")
    .find({ userEmail })
    .toArray();

  const categoryTotals = {};

  transactions.forEach((transaction) => {
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = {
        income: 0,
        expense: 0,
      };
    }

    if (transaction.type === "Income") {
      categoryTotals[transaction.category].income += transaction.amount;
    } else {
      categoryTotals[transaction.category].expense += transaction.amount;
    }
  });

  return categoryTotals;
};

export const getMonthlyTransactions = async (userEmail, year) => {
  const db = getDB();
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);

  const transactions = await db
    .collection("transactions")
    .find({
      userEmail,
      date: { $gte: startDate, $lt: endDate },
    })
    .toArray();

  const monthlyData = Array(12)
    .fill(0)
    .map(() => ({ income: 0, expense: 0 }));

  transactions.forEach((transaction) => {
    const month = transaction.date.getMonth();
    if (transaction.type === "Income") {
      monthlyData[month].income += transaction.amount;
    } else {
      monthlyData[month].expense += transaction.amount;
    }
  });

  return monthlyData;
};
