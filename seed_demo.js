import dotenv from "dotenv";
import admin from "firebase-admin";
import { createRequire } from "module";
import { MongoClient } from "mongodb";

// Configure dotenv
dotenv.config();

const require = createRequire(import.meta.url);
const serviceAccount = require("./finease-48cd9-firebase-adminsdk.json");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const DEMO_USER = {
  email: "demo@finease.com",
  password: "Demo@123",
  displayName: "iear idang",
};

// Helper: Get random number between min and max
const getRandomAmount = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Helper: Get random date between start and end
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Helper: Generate 50+ transactions
const generateTransactions = () => {
  const transactions = [];
  const categories = [
    { name: "Salary", type: "Income", range: [3000, 5000] },
    { name: "Freelance", type: "Income", range: [200, 1500] },
    { name: "Investment", type: "Income", range: [50, 500] },
    { name: "Groceries", type: "Expense", range: [50, 300] },
    { name: "Rent", type: "Expense", range: [1000, 1500] },
    { name: "Utilities", type: "Expense", range: [50, 200] },
    { name: "Transport", type: "Expense", range: [20, 100] },
    { name: "Entertainment", type: "Expense", range: [30, 150] },
    { name: "Health", type: "Expense", range: [50, 300] },
    { name: "Shopping", type: "Expense", range: [50, 500] },
    { name: "Dining Out", type: "Expense", range: [20, 100] },
  ];

  const startDate = new Date("2025-10-01");
  const endDate = new Date(); // Today

  // Ensure at least 55 transactions
  for (let i = 0; i < 60; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = getRandomDate(startDate, endDate);

    transactions.push({
      type: category.type,
      amount: getRandomAmount(category.range[0], category.range[1]),
      category: category.name,
      date: date.toISOString(), // Store as ISO string initially
      description: `${category.name} expense/income`,
      userEmail: DEMO_USER.email,
      userName: DEMO_USER.displayName,
    });
  }

  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log("Starting Seeding Process...");

    // 1. Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db();
    console.log("✅ Connected to MongoDB");

    // 2. Create/Update Firebase User
    let uid;
    try {
      console.log(`Checking for user: ${DEMO_USER.email}...`);
      const userRecord = await admin.auth().getUserByEmail(DEMO_USER.email);
      console.log("User exists. Updating credentials...");
      uid = userRecord.uid;
      await admin.auth().updateUser(uid, {
        displayName: DEMO_USER.displayName,
        password: DEMO_USER.password,
        emailVerified: true,
      });
      console.log("✅ User updated.");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.log("User not found. Creating new user...");
        const userRecord = await admin.auth().createUser({
          email: DEMO_USER.email,
          password: DEMO_USER.password,
          displayName: DEMO_USER.displayName,
          emailVerified: true,
        });
        uid = userRecord.uid;
        console.log("✅ User created.");
      } else {
        throw error;
      }
    }

    // 3. Add Transactions
    console.log("Generating 50+ transactions from Oct 2025 to Today...");
    const sampleTransactions = generateTransactions();

    console.log("Managing transactions...");
    const collection = db.collection("transactions");

    // Clear existing
    await collection.deleteMany({ userEmail: DEMO_USER.email });
    console.log("Cleared existing transactions for demo user.");

    // Prepare data with correct Date objects for MongoDB
    const transactionsWithDates = sampleTransactions.map((t) => ({
      ...t,
      date: new Date(t.date),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert new ones
    if (transactionsWithDates.length > 0) {
      await collection.insertMany(transactionsWithDates);
      console.log(
        `✅ Successfully added ${transactionsWithDates.length} transactions.`
      );
    }

    console.log("\n==================================");
    console.log("SEEDING COMPLETE SUCCESS");
    console.log("==================================");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    try {
      await client.close();
    } catch (e) {
      console.error("Error closing DB connection:", e);
    }
  }
}

seed();
