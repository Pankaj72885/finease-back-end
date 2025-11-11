import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export const createTransaction = async (transactionData) => {
  const db = getDB();
  const result = await db.collection("transactions").insertOne({
    ...transactionData,
    date: new Date(transactionData.date),
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

export const getTransactionById = async (id, userId) => {
  const db = getDB();
  const transaction = await db
    .collection("transactions")
    .findOne({ _id: new ObjectId(id), userId: userId });
  return transaction;
};

export const updateTransaction = async (id, userId, updateData) => {
  const db = getDB();

  const { _id, ...dataToUpdate } = updateData;

  if (dataToUpdate.date) {
    dataToUpdate.date = new Date(dataToUpdate.date);
  }

  const result = await db.collection("transactions").updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { ...dataToUpdate, updatedAt: new Date() } } 
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

  const pipeline = [
    { $match: { userEmail: userEmail } },
    {
      $group: {
        _id: {
          category: "$category",
          type: "$type",
        },
        totalAmount: { $sum: "$amount" },
      },
    },
  ];

  const results = await db
    .collection("transactions")
    .aggregate(pipeline)
    .toArray();

  const categoryTotals = {};
  results.forEach((result) => {
    const { category, type } = result._id;
    const amount = result.totalAmount;

    if (!categoryTotals[category]) {
      categoryTotals[category] = { income: 0, expense: 0 };
    }

    if (type === "Income") {
      categoryTotals[category].income += amount;
    } else {
      categoryTotals[category].expense += amount;
    }
  });

  return categoryTotals;
};

export const getMonthlyTransactions = async (userEmail, year) => {
  const db = getDB();
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);

  const pipeline = [
    {
      // 1. Find only the relevant documents
      $match: {
        userEmail: userEmail,
        date: { $gte: startDate, $lt: endDate },
      },
    },
    {
      // 2. Group them by month and type (Income/Expense)
      $group: {
        _id: {
          month: { $month: "$date" },
          type: "$type",
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      // 3. Group by month to pivot Income/Expense
      $group: {
        _id: "$_id.month",
        income: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "Income"] }, "$totalAmount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "Expense"] }, "$totalAmount", 0],
          },
        },
      },
    },
    {
      // 4. Sort by month
      $sort: { _id: 1 },
    },
  ];

  const results = await db
    .collection("transactions")
    .aggregate(pipeline)
    .toArray();

  // The database only returns 12 documents, one for each month
  // We need to fill in any missing months
  const monthlyData = Array(12)
    .fill(0)
    .map(() => ({ income: 0, expense: 0 }));

  results.forEach((result) => {
    // MongoDB months are 1-12, array is 0-11
    const monthIndex = result._id - 1;
    monthlyData[monthIndex] = {
      income: result.income,
      expense: result.expense,
    };
  });

  return monthlyData;
};
