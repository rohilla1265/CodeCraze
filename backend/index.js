import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import cors from 'cors';

import authRouter from "./src/routes/authroutes.js";
import redisClient from "./src/config/redis.js";
import problemRouter from "./src/routes/ProblemCreator.js";
import submitRouter from "./src/routes/submit.js";
import airouter from "./src/routes/geminiroute.js";
import videoRouter from "./src/routes/videoRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", airouter);
app.use("/video",videoRouter);


async function initializeApp() {
    try {
        await Promise.all([
            mongoose.connect(process.env.DB_STRING),
            redisClient.connect()
        ]);
        
        console.log("✅ MongoDB and Redis Connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server listening at port: ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Connection Error: ", err);
        process.exit(1);
    }
}

initializeApp();