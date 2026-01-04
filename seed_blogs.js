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
    Life is unpredictable. Aim to save 3-6 months' worth of living expenses in a separate account. This safety net will protect you from debt when unexpected expenses arise.`,
    excerpt:
      "Learn the fundamentals of budgeting, saving, and investing to take control of your financial future.",
    coverImage:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1000",
    category: "Budgeting",
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
  {
    title: "Investing 101: Stocks vs Bonds",
    content:
      "Stocks represent ownership in a company, while bonds are loans you give to the government or corporations. Stocks generally offer higher returns but come with higher risk...",
    excerpt:
      "A beginner's comparison of the two most common investment vehicles.",
    coverImage:
      "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=1000",
    category: "Investing",
    tags: ["Stocks", "Bonds", "Beginner"],
    author: {
      name: "Michael Chen",
      email: "michael@example.com",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    likes: 156,
    readTime: "6 min read",
    createdAt: new Date(Date.now() - 86400000 * 1),
    updatedAt: new Date(Date.now() - 86400000 * 1),
  },
  {
    title: "The Rise of Cryptocurrency in 2026",
    content:
      "Cryptocurrency has moved beyond a niche hobby to a global financial phenomenon. Institutional adoption is at an all-time high...",
    excerpt:
      "Exploring the current state of crypto and what the future holds for digital assets.",
    coverImage:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=1000",
    category: "Cryptocurrency",
    tags: ["Crypto", "Bitcoin", "Future"],
    author: {
      name: "Sarah Lee",
      email: "sarah@example.com",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    likes: 210,
    readTime: "8 min read",
    createdAt: new Date(Date.now() - 86400000 * 12),
    updatedAt: new Date(Date.now() - 86400000 * 12),
  },
  {
    title: "How to Retire Early (FIRE Movement)",
    content:
      "Financial Independence, Retire Early (FIRE) is a lifestyle movement with the goal of financial independence and retiring early...",
    excerpt:
      "Strategies for achieving financial independence and retiring decades before the norm.",
    coverImage:
      "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&q=80&w=1000",
    category: "Retirement",
    tags: ["FIRE", "Retirement", "Lifestyle"],
    author: {
      name: "David Smith",
      email: "david@example.com",
      photo: "https://randomuser.me/api/portraits/men/85.jpg",
    },
    likes: 89,
    readTime: "10 min read",
    createdAt: new Date(Date.now() - 86400000 * 20),
    updatedAt: new Date(Date.now() - 86400000 * 20),
  },
  {
    title: "Tech Tools for Better Money Management",
    content:
      "From AI-powered budgeting apps to automated investment platforms, technology is making personal finance easier than ever...",
    excerpt: "Top apps and tools to automate your finances in 2026.",
    coverImage:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
    category: "Technology",
    tags: ["Apps", "Automation", "Fintech"],
    author: {
      name: "iear idang",
      email: "demo@finease.com",
      photo: "",
    },
    likes: 34,
    readTime: "4 min read",
    createdAt: new Date(Date.now() - 86400000 * 15),
    updatedAt: new Date(Date.now() - 86400000 * 15),
  },
  {
    title: "Real Estate vs. Stocks: Where to Invest?",
    content:
      "Both real estate and stocks are proven wealth builders. However, they require different levels of capital, effort, and risk tolerance...",
    excerpt:
      "Comparing two of the most popular asset classes for long-term wealth.",
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000",
    category: "Real Estate",
    tags: ["Real Estate", "Investing", "Comparison"],
    author: {
      name: "Robert Kiyosaki Fan",
      email: "rob@example.com",
      photo: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    likes: 67,
    readTime: "7 min read",
    createdAt: new Date(Date.now() - 86400000 * 25),
    updatedAt: new Date(Date.now() - 86400000 * 25),
  },
  {
    title: "Minimalism and Money",
    content:
      "Minimalism isn't just about owning less stuff; it's about intentional spending. By cutting out the clutter, you can focus your resources on what truly matters...",
    excerpt:
      "How adopting a minimalist lifestyle can supercharge your savings rate.",
    coverImage:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1000",
    category: "Savings",
    tags: ["Minimalism", "Lifestyle", "Savings"],
    author: {
      name: "Sophia Green",
      email: "sophia@example.com",
      photo: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    likes: 92,
    readTime: "5 min read",
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    title: "Understanding Taxes for Freelancers",
    content:
      "Freelancing offers freedom, but it also comes with complex tax responsibilities. Don't let tax season catch you off guard...",
    excerpt: "Essential tax tips for gig workers and freelancers.",
    coverImage:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=1000",
    category: "Taxes",
    tags: ["Freelance", "Taxes", "Business"],
    author: {
      name: "Alex Taxman",
      email: "alex@example.com",
      photo: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    likes: 21,
    readTime: "6 min read",
    createdAt: new Date(Date.now() - 86400000 * 30),
    updatedAt: new Date(Date.now() - 86400000 * 30),
  },
  {
    title: "The Psychology of Spending",
    content:
      "Why do we buy things we don't need? Marketing psychology plays a huge role. Learn to spot the triggers and make conscious choices...",
    excerpt:
      "Uncover the hidden psychological forces that influence your spending habits.",
    coverImage:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1000",
    category: "Budgeting",
    tags: ["Psychology", "Spending", "Behavior"],
    author: {
      name: "Dr. Mindy",
      email: "mindy@example.com",
      photo: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    likes: 115,
    readTime: "8 min read",
    createdAt: new Date(Date.now() - 86400000 * 8),
    updatedAt: new Date(Date.now() - 86400000 * 8),
  },
  {
    title: "Side Hustles to Boost Your Income",
    content:
      "Looking to make extra cash? From dropshipping to consulting, here are 10 legitimate side hustles you can start today...",
    excerpt: "Actionable ideas to generate passive and active income streams.",
    coverImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    category: "Income",
    tags: ["Side Hustle", "Business", "Money"],
    author: {
      name: "Hustle Hard",
      email: "hustle@example.com",
      photo: "https://randomuser.me/api/portraits/men/99.jpg",
    },
    likes: 230,
    readTime: "9 min read",
    createdAt: new Date(Date.now() - 86400000 * 18),
    updatedAt: new Date(Date.now() - 86400000 * 18),
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

    // Clear existing blogs
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
