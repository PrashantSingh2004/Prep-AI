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

<img width="1897" height="966" alt="image" src="https://github.com/user-attachments/assets/57b2d14b-5601-4643-96a2-678932f8e068" />
<img width="1898" height="864" alt="image" src="https://github.com/user-attachments/assets/9ffe0c8e-53bd-4814-8d30-73eaab8bf7f8" />
<img width="1900" height="866" alt="image" src="https://github.com/user-attachments/assets/af17e7d0-60f6-4eda-966f-bb51e286860a" />
<img width="1894" height="877" alt="image" src="https://github.com/user-attachments/assets/c39da708-1c1b-4df6-9d8d-118c1a12b977" />
<img width="1892" height="883" alt="image" src="https://github.com/user-attachments/assets/d92cfd70-064f-41d9-9ea8-fa89e38b20db" />
<img width="800" height="364" alt="image" src="https://github.com/user-attachments/assets/1d7b1530-86e3-4786-8418-8a99344b717f" />
<img width="1893" height="884" alt="image" src="https://github.com/user-attachments/assets/2299712e-d6b5-4f9e-b5f2-706ee9ad29d7" />
<img width="1897" height="867" alt="image" src="https://github.com/user-attachments/assets/f6dab6d6-5c96-496c-b8d8-bc7077da4fd2" />
<img width="1905" height="865" alt="image" src="https://github.com/user-attachments/assets/00e5d9a2-66b2-495f-9396-d66ec875e384" />
<img width="1905" height="865" alt="image" src="https://github.com/user-attachments/assets/17fb02ef-e9f2-4fff-b795-3b7c9b88eaa6" />
<img width="1915" height="872" alt="image" src="https://github.com/user-attachments/assets/a76b31f6-91c6-4ef3-992b-da0a47746c07" />











