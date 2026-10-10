import express from 'express';
import { getStepByStepHint } from '../controller/gemini.js';
import userMiddleware from '../middlewere/userMiddlewere.js'; // Aapka auth middleware

const airouter = express.Router();

// POST /api/ai/hint
airouter.post('/hint', userMiddleware, getStepByStepHint);

export default airouter;