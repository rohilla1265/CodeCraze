import express from "express";
import userMiddleware from "../middlewere/userMiddlewere.js"; // Folder spelling checked
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controller/profileController.js";

const router = express.Router();

router.get("/", userMiddleware, getProfile);
router.put("/", userMiddleware, updateProfile);
router.put("/change-password", userMiddleware, changePassword);
router.delete("/", userMiddleware, deleteAccount);

export default router;