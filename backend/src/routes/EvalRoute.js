import express from "express";
import { evaluateBattle } from "../controller/BattleEval.js";

const router = express.Router();

// Evaluate battle results
router.post("/evaluate", evaluateBattle);

export default router;
