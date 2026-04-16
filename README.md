# AI-Agent MERN Stack Project

A full-stack project with React, Node.js, Express, and MongoDB.

## Project Structure

- `client/`: React frontend (Vite)
- `server/`: Node.js backend (Express + MongoDB)
- `package.json`: Root package file with scripts to run both client and server.

## Features

- **Frontend**: React with Vite, Axios for API calls.
- **Backend**: Node.js, Express, and Mongoose for MongoDB.
- **Development**: Run both with a single command using `concurrently`.
- **UI**: Modern dark theme with glassmorphism and smooth animations.

## Getting Started

### 1. Prerequisites
- Node.js installed.
- MongoDB running locally or a MongoDB Atlas connection string.

### 2. Configuration
Update the `.env` file in the `server` directory with your MongoDB URI:
```env
MONGO_URI=mongodb://localhost:27017/ai_agent_db
PORT=5000
```

### 3. Run the Project
From the root directory, run:
```bash
npm run dev
```
This will start:
- Backend: [http://localhost:5000](http://localhost:5000)
- Frontend: [http://localhost:5173](http://localhost:5173)

Enjoy building!
