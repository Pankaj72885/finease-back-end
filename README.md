# 🖥️ FinEase Backend API

<div align="center">

![FinEase Backend](https://img.shields.io/badge/FinEase_API-Express_+_MongoDB-10b981?style=for-the-badge&logo=express&logoColor=white)

[![API Status](https://img.shields.io/badge/API-Live-06b6d4?style=for-the-badge)](https://finease-back-end.vercel.app/api)
[![Frontend Repo](https://img.shields.io/badge/📱_Frontend-Repository-8b5cf6?style=for-the-badge)](https://github.com/Pankaj72885/finease-font-end)

**RESTful API backend for the FinEase personal finance management platform.**

[API Endpoints](#-api-endpoints) • [Tech Stack](#️-tech-stack) • [Challenges](#-backend-challenges--solutions) • [Setup](#-local-setup)

</div>

---

## 📋 Overview

This is the **backend server** for the FinEase personal finance application. It provides secure RESTful APIs for user authentication verification, transaction management (CRUD), and financial reporting/analytics.

### Key Responsibilities:

- 🔐 Firebase token verification and user authentication
- 💾 MongoDB database operations for transactions
- 📊 Aggregated reports and analytics generation
- 🛡️ Request validation and error handling
- ⚡ Optimized queries for performance

---

## ⚙️ Features

### 🔐 Authentication

- **Firebase Admin SDK** integration for token verification
- **Secure middleware** protecting all transaction routes
- **User ownership validation** for CRUD operations

### 💸 Transaction Management

- **Full CRUD Operations** - Create, Read, Update, Delete
- **Filtering & Sorting** - By date, amount, category
- **Pagination Support** - Efficient data loading
- **User Isolation** - Each user sees only their data

### 📊 Financial Reports

- **Summary Statistics** - Total income, expenses, balance
- **Category Breakdown** - Spending by category with percentages
- **Monthly Trends** - Year-over-year monthly comparisons
- **Aggregation Pipelines** - Efficient MongoDB aggregations

### 🛡️ Security

- **Token-based Authentication** - Firebase JWT verification
- **CORS Configuration** - Whitelisted origins only
- **Input Validation** - Request body validation
- **Error Handling** - Consistent error responses

---

## 🏗️ Tech Stack

| Layer      | Technology         | Version |
| ---------- | ------------------ | ------- |
| Runtime    | Node.js            | 18.x    |
| Framework  | Express.js         | 5.x     |
| Database   | MongoDB Atlas      | 6.x     |
| ODM        | Mongoose           | 8.x     |
| Auth       | Firebase Admin SDK | 12.x    |
| Middleware | cors, dotenv       | Latest  |
| Deployment | Vercel Serverless  | Latest  |

---

## 🔌 API Endpoints

**Base URL:** `https://finease-back-end.vercel.app/api`

### 🔑 Authentication

| Method | Endpoint             | Description              | Auth |
| ------ | -------------------- | ------------------------ | ---- |
| POST   | `/auth/verify-token` | Verify Firebase ID token | ❌   |

### 💸 Transactions

| Method | Endpoint                                                              | Description               | Auth |
| ------ | --------------------------------------------------------------------- | ------------------------- | ---- |
| GET    | `/transactions?userEmail={email}&sortBy={field}&sortOrder={asc/desc}` | Get all user transactions | ✅   |
| GET    | `/transactions/:id`                                                   | Get single transaction    | ✅   |
| POST   | `/transactions`                                                       | Create new transaction    | ✅   |
| PUT    | `/transactions/:id`                                                   | Update transaction        | ✅   |
| DELETE | `/transactions/:id`                                                   | Delete transaction        | ✅   |

#### Transaction Schema

```json
{
  "type": "Income | Expense",
  "category": "Salary | Food & Dining | etc.",
  "amount": 1500.0,
  "description": "Optional note",
  "date": "2024-01-15T00:00:00.000Z",
  "userEmail": "user@example.com",
  "userName": "John Doe"
}
```

### 📊 Reports

| Method | Endpoint                                         | Description                | Auth |
| ------ | ------------------------------------------------ | -------------------------- | ---- |
| GET    | `/reports/summary?userEmail={email}`             | Financial summary (totals) | ✅   |
| GET    | `/reports/by-category?userEmail={email}`         | Category-wise breakdown    | ✅   |
| GET    | `/reports/monthly?userEmail={email}&year={year}` | Monthly income vs expenses | ✅   |

#### Summary Response

```json
{
  "totalIncome": 5000,
  "totalExpense": 3200,
  "balance": 1800
}
```

#### Category Response

```json
{
  "Food & Dining": { "income": 0, "expense": 450 },
  "Salary": { "income": 5000, "expense": 0 },
  ...
}
```

#### Monthly Response

```json
[
  { "month": "Jan", "income": 5000, "expense": 3200 },
  { "month": "Feb", "income": 5000, "expense": 2800 },
  ...
]
```

---

## 🚧 Backend Challenges & Solutions

### 1. **Firebase Admin SDK in Serverless Environment**

**Problem:** `Firebase app named "[DEFAULT]" already exists` error

**Root Cause:** Vercel serverless functions reuse warm instances, causing duplicate initialization

**Solution:**

```javascript
const admin = require("firebase-admin");

// Check if already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Handle newlines in private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

module.exports = admin;
```

---

### 2. **MongoDB Connection Pooling**

**Problem:** `MongoError: connection pool exhausted` after multiple requests

**Root Cause:** Each serverless invocation created a new database connection

**Solution:**

```javascript
const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

---

### 3. **Token Verification Flexibility**

**Problem:** Inconsistent `401 Unauthorized` errors

**Root Cause:** Frontend sometimes sent token with/without "Bearer " prefix

**Solution:**

```javascript
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // Handle both "Bearer token" and raw "token" formats
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
```

---

### 4. **Date Timezone Inconsistencies**

**Problem:** Transaction dates showing incorrectly across timezones

**Root Cause:** Client sent local date, server stored UTC, causing day-shift

**Solution:**

```javascript
// Store with explicit UTC conversion
const createTransaction = async (req, res) => {
  const { date, ...rest } = req.body;

  const transaction = new Transaction({
    ...rest,
    date: new Date(date).toISOString(), // Always store as ISO string
  });

  await transaction.save();
};

// Query with date range (handles timezone)
const getByDateRange = async (startDate, endDate) => {
  return Transaction.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });
};
```

---

### 5. **Aggregation Pipeline Performance**

**Problem:** Category breakdown query taking 3+ seconds

**Root Cause:** Unindexed queries on large collections

**Solution:**

```javascript
// Create indexes
db.transactions.createIndex({ userEmail: 1, date: -1 });
db.transactions.createIndex({ userEmail: 1, type: 1 });

// Optimized aggregation
const getCategoryBreakdown = async (userEmail) => {
  return Transaction.aggregate([
    { $match: { userEmail } }, // Uses index
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: "$_id.category",
        income: {
          $sum: { $cond: [{ $eq: ["$_id.type", "Income"] }, "$total", 0] },
        },
        expense: {
          $sum: { $cond: [{ $eq: ["$_id.type", "Expense"] }, "$total", 0] },
        },
      },
    },
  ]);
};
```

**Result:** Query time reduced from 3s to <200ms

---

### 6. **CORS Configuration for Multiple Origins**

**Problem:** CORS errors when accessing from localhost and production

**Solution:**

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://finease-font-end.vercel.app",
      "https://finease-front-end.vercel.app",
    ];

    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
```

---

### 7. **Error Handling Standardization**

**Problem:** Inconsistent error response formats

**Solution:**

```javascript
// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

app.use(errorHandler);
```

---

## 📁 Project Structure

```
finease-back-end/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── firebase-admin.js  # Firebase Admin setup
│   ├── middleware/
│   │   └── auth.js            # Auth verification
│   ├── models/
│   │   └── Transaction.js     # Mongoose schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── transactions.js    # CRUD routes
│   │   └── reports.js         # Analytics routes
│   └── index.js               # Route aggregation
├── server.js                   # Express app entry
├── vercel.json                 # Deployment config
├── package.json
└── .env
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/finease

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 🧪 Local Setup

```bash
# Clone repository
git clone https://github.com/Pankaj72885/finease-back-end.git
cd finease-back-end

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

Server runs at: `http://localhost:5000/api`

---

## 🚀 Deployment (Vercel)

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Ensure `vercel.json` is configured:

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

---

## 🔒 Security Best Practices

- ✅ Firebase token verification on all protected routes
- ✅ User ownership validation for transactions
- ✅ Environment variables for sensitive data
- ✅ CORS properly configured
- ✅ Input validation with Mongoose schemas
- ✅ Error messages don't leak sensitive info

---

## 📊 Performance Metrics

| Metric                | Value       |
| --------------------- | ----------- |
| Average Response Time | < 200ms     |
| Monthly Aggregation   | < 300ms     |
| Max Connections       | 10 (pooled) |
| Cold Start            | < 2s        |

---

## 🔗 Related

- **Frontend Repository:** [FinEase Frontend](https://github.com/Pankaj72885/finease-font-end)
- **Live Application:** [finease-font-end.vercel.app](https://finease-font-end.vercel.app)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🧠 Author

<div align="center">

**Pankaj Bepari**

[![GitHub](https://img.shields.io/badge/GitHub-Pankaj72885-181717?style=for-the-badge&logo=github)](https://github.com/Pankaj72885)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Pankaj_Bepari-0A66C2?style=for-the-badge&logo=linkedin)](https://bd.linkedin.com/in/pankaj-bepari-8aa69013a)

_Full-Stack Developer | Node.js & Express Expert | MongoDB Specialist_

</div>

---

<div align="center">

⭐ **Star this repo if you found it helpful!** ⭐

</div>
