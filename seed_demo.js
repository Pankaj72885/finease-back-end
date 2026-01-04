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

const SAMPLE_TRANSACTIONS = [
  {
    type: "Income",
    amount: 5000,
    category: "Salary",
    date: new Date().toISOString(),
    description: "Monthly Salary from Tech Corp",
    userEmail: DEMO_USER.email,
    userName: DEMO_USER.displayName,
  },
  {
    type: "Expense",
    amount: 150.5,
    category: "Groceries",
    date: new Date(Date.now() - 86400000 * 1).toISOString(), // Yesterday
    description: "Weekly groceries at Whole Foods",
    userEmail: DEMO_USER.email,
    userName: DEMO_USER.displayName,
  },
  {
    type: "Expense",
    amount: 89.99,
    category: "Utilities",
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    description: "Internet Bill",
    userEmail: DEMO_USER.email,
    userName: DEMO_USER.displayName,
  },
  {
    type: "Income",
    amount: 250,
    category: "Freelance",
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    description: "Logo Design Project",
    userEmail: DEMO_USER.email,
    userName: DEMO_USER.displayName,
  },
  {
    type: "Expense",
    amount: 45,
    category: "Entertainment",
    date: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
    description: "Cinema tickets",
    userEmail: DEMO_USER.email,
    userName: DEMO_USER.displayName,
  },
  {
    type: "Expense",
    amount: 12.5,
    category: "Food",
    date: new Date(Date.now() - 86400000 * 8).toISOString(),
    description: "Coffee and bagel",
    userEmail: DEMO_USER.email,
    userName: DEMO_USER.displayName,
  },
  {
    type: "Income",
    amount: 1000,
    category: "Investment",
    date: new Date(Date.now() - 86400000 * 12).toISOString(),
    description: "Dividend Payout",
    userEmail: DEMO_USER.email,
    userName: DEMO_USER.displayName,
  },
];

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
    console.log("Managing transactions...");
    const collection = db.collection("transactions");

    // Clear existing
    await collection.deleteMany({ userEmail: DEMO_USER.email });
    console.log("Cleared existing transactions for demo user.");

    // Prepare data with correct Date objects
    const transactionsWithDates = SAMPLE_TRANSACTIONS.map((t) => ({
      ...t,
      date: new Date(t.date),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert new ones
    if (transactionsWithDates.length > 0) {
      await collection.insertMany(transactionsWithDates);
      console.log(
        `✅ Successfully added ${transactionsWithDates.length} sample transactions.`
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
