import express from "express";
import userMiddleware from "../middlewere/userMiddlewere.js"
import { submitCode,runcode } from "../controller/userSubmission.js";
const submitRouter = express.Router();
submitRouter.post("/submit/:id",userMiddleware,submitCode);
submitRouter.post("/run/:id",userMiddleware,runcode);
export default submitRouter;