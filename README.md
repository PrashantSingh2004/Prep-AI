# PrepAI - MERN Stack Interview Preparation Platform

A comprehensive, AI-powered interview preparation platform built on the MERN stack (MongoDB, Express, React, Node.js). It offers coding challenges, MCQ quizzes, and interactive Anthropic AI mock interviews.

## Features

- **Authentication**: Secure JWT-based registration and login system.
- **Dynamic Dashboard**: Centralized analytics leveraging Recharts and Activity Heatmaps to show user progress globally.
- **Coding Challenges Module**: Integrated with Monaco Editor for syntax highlighting. Includes difficulty tags, examples, constraints, and starter code.
- **MCQ Practice Engine**: Categorized quizzes with immediate performance grading.
- **AI Mock Interviews**: Real-time conversational mock interviews driven by Anthropic Claude LLM.
- **Responsive UI/UX**: Dark Navy & Indigo color theme using Framer Motion page transitions, React Router lazy loading, and mobile-responsive Sidebar/Navbar layouts.

## Tech Stack

### Frontend (Client)
- React (Vite)
- React Router (DOM v6)
- Framer Motion
- Monaco Editor (`@monaco-editor/react`)
- Recharts & React Activity Calendar
- Axios
- Lucide React

### Backend (Server)
- Node.js & Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT) & bcryptjs
- Anthropic SDK
- Security & Optimization: `express-rate-limit`, `helmet`, `xss-clean`, `express-mongo-sanitize`

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas (or local MongoDB instance)
- Anthropic API Key (Claude)

### Environment Variables

You need to create a `.env` file in your `/server` directory:

| Variable | Description | Example |
|---|---|---|
| `PORT` | The port the backend server runs on | `5000` |
| `MONGO_URI` | Your MongoDB connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/` |
| `JWT_SECRET` | Secret key for signing Auth tokens | `supersecretkey123` |
| `ANTHROPIC_API_KEY`| API key for Claude Mock Interviews | `sk-ant-api03...` |

### Installation

1. **Clone the repository** (if you haven't already).
2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```
3. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   ```

### Running the Application

Optionally, you can seed the database with initial programming questions and MCQs using:
```bash
cd server
npm run seed
```

Start the Backend API (runs on `http://localhost:5000` by default):
```bash
cd server
npm run dev
```

Start the Frontend React App (runs on `http://localhost:5173` by default):
```bash
cd client
npm run dev
```

## Deployment Instructions

### Deploying the Backend
This project contains a `Dockerfile` for easy containerized deployments on platforms like **Render**, **Railway**, or **Fly.io**.
1. Push your repository to GitHub.
2. Link your repository to Render/Railway.
3. Configure the environment variables (`MONGO_URI`, `JWT_SECRET`, `ANTHROPIC_API_KEY`) in the platform's deployment dashboard.
4. Set the Start Command (if not using Docker) to `npm start` or let the Dockerfile handle it.

### Deploying the Frontend
The client application includes a `vercel.json` file designed to natively support React Router routing out-of-the-box on Vercel.
1. Sign in to **Vercel** and Import the repository.
2. Set the Root Directory to `client`.
3. Override the "Build Command" if needed, but the default `npm run build` will work.
4. Ensure the output directory is set to `dist`.
5. Deploy!

---

> Designed & Developed by Antigravity (Google Advanced Agentic Coding)
