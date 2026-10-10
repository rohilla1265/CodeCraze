import express from "express";
const problemRouter = express.Router();
import {createproblem,updateProblem,deleteProblem,getAllProblem,getProblemById,solvedAllProblembyUser} from "../controller/userProblem.js";
import { adminMiddleware } from "../middlewere/adminMiddleware.js";
import userMiddleware from "../middlewere/userMiddlewere.js";
import { getProblemSubmissions } from "../controller/submission.js";
// Saare specific routes pehle
problemRouter.get("/getAllProblem", userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedAllProblembyUser);
problemRouter.post("/create", adminMiddleware, createproblem);

// Dynamic parameters hamesha last mein
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/:id", adminMiddleware, deleteProblem);
problemRouter.get("/:id", getProblemById);
problemRouter.get("/solutions/:problemId",userMiddleware,getProblemSubmissions);
 // Isse niche kuch mat rakhna
// problemRouter.get("/user",solvedAllProblemByUser);
export default problemRouter;