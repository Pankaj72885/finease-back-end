# 🖥️ FinEase Backend API (Express + MongoDB)

This is the **backend server** for the FinEase personal finance app.  
It provides RESTful APIs for authentication, transaction management, and financial reporting.

---

## ⚙️ Features

- 🔐 **Firebase Authentication (Admin SDK)**

  - Email/password & Google login verification
  - Token-based protected routes

- 💾 **MongoDB Integration**

  - Native MongoDB driver (no Mongoose)
  - Secure and efficient CRUD operations

- 📊 **Financial Reports**

  - Category-wise analysis
  - Monthly summaries
  - Balance and net income reports

- 🧰 **Clean Express Architecture**
  - Modular routes, middleware, and config
  - Environment-based configuration

---

## 🏗️ Tech Stack

| Layer      | Technology         |
| ---------- | ------------------ |
| Runtime    | Node.js            |
| Framework  | Express.js         |
| Database   | MongoDB (Atlas)    |
| Auth       | Firebase Admin SDK |
| Middleware | CORS, dotenv       |
| Deployment | Vercel   |

---

## 🔌 API Base URL

```
https://finease-back-end.onrender.com/api
```

---

## 📦 Endpoints Overview

### 🔑 Authentication

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/auth/verify-token` | Verify Firebase ID token |

### 💸 Transactions

| Method | Endpoint                          | Description            |
| ------ | --------------------------------- | ---------------------- |
| GET    | `/transactions?userEmail={email}` | Get all transactions   |
| GET    | `/transactions/:id`               | Get single transaction |
| POST   | `/transactions`                   | Create new transaction |
| PUT    | `/transactions/:id`               | Update transaction     |
| DELETE | `/transactions/:id`               | Delete transaction     |

### 📊 Reports

| Method | Endpoint                                         | Description             |
| ------ | ------------------------------------------------ | ----------------------- |
| GET    | `/reports/summary?userEmail={email}`             | Financial summary       |
| GET    | `/reports/by-category?userEmail={email}`         | Category-wise breakdown |
| GET    | `/reports/monthly?userEmail={email}&year={year}` | Monthly data for charts |

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FIREBASE_SERVICE_ACCOUNT=./config/serviceAccountKey.json
NODE_ENV=development
```

---

## 🧪 Run Locally

```bash
# 1️⃣ Clone repo
git clone https://github.com/Pankaj72885/finease-back-end.git

# 2️⃣ Install dependencies
npm install

# 3️⃣ Run development server
npm run dev
```

Server runs at:  
👉 `http://localhost:5000/api`

---

## 🔒 Security

- Token-based auth verification (Firebase Admin SDK)
- Ownership validation for transaction operations
- CORS properly configured
- Input validation and error handling

---

## 📁 Folder Structure

```
backend/
 ┣ config/
 ┃ ┗ firebase-admin.js
 ┃ ┗ db.js
 ┣ middleware/
 ┃ ┗ auth.js
 ┣ models/
 ┃ ┗ Transaction.js
 ┣ routes/
 ┃ ┣ auth.js
 ┃ ┣ transactions.js
 ┃ ┗ reports.js
 ┣ server.js
 ┗ .env
```

---

## 🔗 Related

Frontend Repository → [FinEase Frontend](https://github.com/Pankaj72885/finease-font-end)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

### 🧠 Author
**Pankaj Bepari**

- **GitHub:** [@Pankaj72885](https://github.com/Pankaj72885)
- **LinkedIn:** [Pankaj Bepari](bd.linkedin.com/in/pankaj-bepari-8aa69013a)

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
