# xeno-crm

# Xeno CRM - Backend (Node.js + Express)

## 📦 Overview

This is the backend portion of the Xeno CRM project. It exposes REST APIs for customer segmentation, campaign creation, AI rule generation, and communication logging. It uses MongoDB (via Mongoose), Express.js, and integrates OpenAI for natural language rule processing.

---

## 📁 Directory Structure

```
backend/
├── models/                # Mongoose models (Customer, Campaign, CommunicationLog)
├── routes/                # API routes (campaignRoutes, segmentRoutes, aiRoutes)
├── controllers/           # Optional controller logic (if separated)
├── server.js              # Entry point to start Express server
└── .env                   # Environment config (not pushed to GitHub)
```

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB (via MongoDB Atlas)
* Mongoose
* OpenAI API (GPT-3.5)
* CORS, dotenv, nodemon

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/xeno-crm
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=5000
```

> ⚠️ Never commit your `.env` file. Use `.gitignore` to exclude it.

---

## 🚀 How to Run

```bash
cd backend
npm install
npm run dev
```

The backend will run on:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### 🔷 Customer Segment Preview

```
POST /api/segments/preview
```

```json
{
  "rules": [
    { "field": "totalSpend", "operator": ">", "value": 5000 },
    { "field": "visits", "operator": "<", "value": 3 }
  ]
}
```

### 🔷 Create & Deliver Campaign

```
POST /api/campaigns
POST /api/campaigns/deliver/:campaignId
```

### 🔷 AI Rule Builder

```
POST /api/ai/rules
```

```json
{
  "prompt": "users who spent more than 5000 and visited less than 3"
}
```

### 🔷 View Communication Logs

```
GET /api/campaigns/logs
```

---

## ☁️ Deployment (Render)

1. Push backend folder to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Set environment variables:

   * `MONGO_URI`
   * `OPENAI_API_KEY`
   * `PORT` = 5000
4. Start command:

```bash
node server.js
```

---

## 🧠 AI Integration

This backend uses OpenAI's GPT-3.5 model to convert plain English prompts into structured JSON rules for segmentation.

---

## 🔒 Security Notes

* Secrets like OpenAI keys and DB URIs must be in `.env`
* Do not push `.env` to GitHub
* GitHub secret scanning will block exposed API keys

---


## 📜 License

This backend is intended for educational and demonstration purposes only.
