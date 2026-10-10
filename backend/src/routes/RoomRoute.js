import express from "express";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  startRoom,
  endRoom,
  getRoomById
} from "../controller/gaming.js";
import userMiddleware from "../middlewere/userMiddlewere.js"
const router = express.Router();

// Create a new room
router.post("/create", userMiddleware, createRoom);
router.post("/join", userMiddleware, joinRoom);

// Join a room
// router.post("/join", (req, res) => joinRoom(req, res, req.app.get("io")));

// Start a battle
router.post("/start", (req, res) => startRoom(req, res, req.app.get("io")));

// End a battle
router.post("/end", (req, res) => endRoom(req, res, req.app.get("io")));

// Leave a room
router.post("/leave", (req, res) => leaveRoom(req, res, req.app.get("io")));
router.get("/:roomId", getRoomById);

export default router;
