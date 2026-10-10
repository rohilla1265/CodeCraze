import { getStepByStepHint } from "../controller/gemini";
import express from 'express';
import userMiddleware from "../middlewere/userMiddlewere";
const aiRoutes = express.Router();
aiRoutes.post('/chat',userMiddleware,getStepByStepHint);
export default aiRoutes;