import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Route Imports
import authRouter from "./src/routes/authroutes.js";
import redisClient from "./src/config/redis.js";
import problemRouter from "./src/routes/ProblemCreator.js";
import submitRouter from "./src/routes/submit.js";
import airouter from "./src/routes/geminiroute.js";
import videoRouter from "./src/routes/videoRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import roomRouter from "./src/routes/RoomRoute.js";
import battleRouter from "./src/routes/EvalRoute.js";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
// const CLIENT_URL = "https://syntax-code.onrender.com";

// 1. Unified CORS Configuration (Sync Express & Socket.IO)
const corsOptions = {
  origin: CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

// 2. Socket.IO Setup (Modern v4 syntax with matching CORS)
const io = new Server(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Inject io instance into app context (accessible via req.app.get("io") in controllers)
app.set("io", io);

// 3. Middlewares (MUST be registered before Routes)
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. API Routes
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", airouter);
app.use("/video", videoRouter);
app.use("/api/profile", profileRoutes);
app.use("/room", roomRouter);
app.use("/battle", battleRouter);

// Global Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// 5. Real-Time Socket Events
// 5. Real-Time Socket Events
io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // 🟢 Yeh listener add karein taaki client room join kar sake
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined socket room: ${roomId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`🔌 User disconnected (${socket.id}): ${reason}`);
  });
  // index.js ya socket connection ke andar:
  socket.on("startBattle", ({ roomId }) => {
    console.log("Battle started event received!")
    io.to(roomId).emit("battleStarted", { roomId });
  });
  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left socket room: ${roomId}`);
  });
  
});

// 6. Global Error Handler (Prevents server crashes on unhandled errors)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 7. Server Initialization with Graceful Shutdown
async function initializeApp() {
  try {
    await Promise.all([
      mongoose.connect(process.env.DB_STRING),
      redisClient.connect(),
    ]);

    console.log("✅ MongoDB and Redis Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server listening at port: ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Connection Error during bootstrap: ", err);
    process.exit(1);
  }
}

// Graceful Shutdown Handler
const shutdown = async () => {
  console.log("\nShutting down gracefully...");
  server.close(async () => {
    await mongoose.connection.close();
    await redisClient.quit();
    console.log("🛑 Connections closed. Process terminated.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

initializeApp();
// ho gaya trial??