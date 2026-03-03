import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createServer } from "http";
import { Server } from "socket.io";

// API Routes
import authRoutes from "./src/routes/authRoutes.ts";
import projectRoutes from "./src/routes/projectRoutes.ts";
import taskRoutes from "./src/routes/taskRoutes.ts";
import notificationRoutes from "./src/routes/notificationRoutes.ts";
import dashboardRoutes from "./src/routes/dashboardRoutes.ts";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const PORT = 3000;

  // Socket.IO Logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-project", (projectId) => {
      socket.join(projectId);
      console.log(`User ${socket.id} joined project ${projectId}`);
    });

    socket.on("task-update", (data) => {
      socket.to(data.projectId).emit("task-updated", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Make io accessible in routes
  app.set("io", io);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  app.use("/uploads", express.static(uploadsDir));

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    mongoose
      .connect(MONGODB_URI)
      .then(() => console.log("Connected to MongoDB Atlas"))
      .catch((err) => console.error("MongoDB connection error:", err));
  } else {
    console.warn("MONGODB_URI not found in environment variables. Backend will fail on database operations.");
  }

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Project Management API is running" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
