import dotenv from "dotenv";
import { createRequire } from "module";
import { MongoClient } from "mongodb";

// Configure dotenv
dotenv.config();

const require = createRequire(import.meta.url);

const blogs = [
  {
    title: "Mastering Personal Finance: A Beginner's Guide",
    content: `Managing your personal finances might seem daunting, but it's a crucial skill for achieving financial freedom. In this guide, we'll walk you through the basics of budgeting, saving, and investing.

    ### 1. Create a Budget
    The first step is understanding where your money goes. Use apps like FinEase to track your income and expenses. A simple 50/30/20 rule (50% needs, 30% wants, 20% savings) is a great place to start.

    ### 2. Build an Emergency Fund
    Life is unpredictable. Aim to save 3-6 months' worth of living expenses in a separate account. This safety net will protect you from debt when unexpected expenses arise.

    ### 3. Start Investing Early
    Compound interest is your best friend. Even small amounts invested in low-cost index funds can grow significantly over time. Don't wait for "the right time" to start—time in the market beats timing the market.`,
    excerpt:
      "Learn the fundamentals of budgeting, saving, and investing to take control of your financial future.",
    coverImage:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1000",
    category: "Education",
    tags: ["Finance", "Budgeting", "Investing"],
    author: {
      name: "iear idang",
      email: "demo@finease.com",
      photo: "",
    },
    likes: 12,
    readTime: "3 min read",
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    title: "5 Tips to Save Money on Groceries",
    content:
      "Groceries are a major expense for most households. Here are 5 practical tips to cut your bill without sacrificing nutrition...",
    excerpt:
      "Discover simple strategies to reduce your monthly grocery bill and eat healthy on a budget.",
    coverImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
    category: "Savings",
    tags: ["Groceries", "Frugal Living", "Tips"],
    author: {
      name: "Alice Johnson",
      email: "alice@example.com",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    likes: 45,
    readTime: "2 min read",
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    title: "Understanding Credit Scores",
    content:
      "Your credit score impacts your ability to get loans, rent apartments, and even get jobs. Learn what factors affect it and how to improve it.",
    excerpt:
      "Demystifying credit scores: What they are, why they matter, and how to boost yours.",
    coverImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1000",
    category: "Credit",
    tags: ["Credit Score", "Loans", "Debt"],
    author: {
      name: "iear idang",
      email: "demo@finease.com",
      photo: "",
    },
    likes: 8,
    readTime: "4 min read",
    createdAt: new Date(Date.now() - 86400000 * 10),
    updatedAt: new Date(Date.now() - 86400000 * 10),
  },
];

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db();
    console.log("Connected.");

    console.log("Seeding Blogs...");
    const collection = db.collection("blogs");

    // Clear existing blogs? Or just append?
    // I'll clear for clean state if I run it multiple times.
    await collection.deleteMany({});
    console.log("Cleared existing blogs.");

    const result = await collection.insertMany(blogs);
    console.log(`Inserted ${result.insertedCount} blogs.`);

    console.log("Done.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
