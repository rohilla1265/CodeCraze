import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/user.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getStepByStepHint = async (req, res) => {
    try {
        const { problemId, userCode, language, hintCount = 1, message = "", chatHistory = [] } = req.body;
        const userId = req.result._id; 
        const user = await User.findById(userId).populate('problemsolved', 'title tags');
        
        const ProblemModule = await import("../models/problem.js");
        const Problem = ProblemModule.default;
        const problem = await Problem.findById(problemId);

        if (!problem) return res.status(404).json({ error: "Problem not found" });

        const solvedProblemsList = user?.problemsolved && Array.isArray(user.problemsolved)
            ? user.problemsolved.map(p => p.title).join(", ")
            : "None (This is their first problem)";

        const systemInstruction = `
            You are a wise, highly conversational, and interactive DSA Mentor. 
            Your core job is to talk like a helpful peer or friend.

            User Dashboard Context:
            - User solved previously: ${solvedProblemsList}
            - Current Problem: "${problem.title}"
            - Difficulty: ${problem.difficulty}
            - Current Tags: ${problem.tags}
            - Current Code in Editor:
            \`\`\`${language}
            ${userCode}
            \`\`\`

            INTERACTION CRITERIA (CRITICAL):
            1. If user asks general definitions (e.g., "what is palindrome", "what is array"), specific doubts, logic explanation, or syntax bugs, ANSWER THAT DIRECTLY in Hinglish. Do NOT use the formal hints loop for general questions.
            2. If user explicitly asks for a hint (e.g., "give me a hint", "hint please", "stuck"), only then supply Hint #${hintCount} out of 3.
               - Hint 1: Logical direction.
               - Hint 2: Strategy/Algorithm approach.
               - Hint 3: Missing edge cases or critical debugging advice.
            3. If user goes off-topic, bring them back smoothly to "${problem.title}".
            4. STRICT RULE: DO NOT write or provide complete copy-pasteable code blocks/snippets.
            5. ALWAYS reply in natural Hinglish and finish with a short question to keep the chat rolling.
        `;

        // 1. Model Initialization with proper systemInstruction placement
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction
        });

        // 2. Raw layout mapping
        let formattedHistory = chatHistory.map(chat => ({
            role: chat.role === "model" ? "model" : "user",
            parts: [{ text: chat.parts?.[0]?.text || chat.text || "" }]
        }));

        // 3. Strict Alternating Validation Loop
        let cleanHistory = [];
        let expectedRole = "user"; 

        for (let chat of formattedHistory) {
            if (chat.role === expectedRole && chat.parts[0].text.trim() !== "") {
                cleanHistory.push(chat);
                expectedRole = expectedRole === "user" ? "model" : "user"; 
            }
        }

        if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === "user") {
            cleanHistory.pop();
        }

        // 4. Gemini Chat Session Setup without config errors
        const chatSession = model.startChat({
            history: cleanHistory
        });

        const result = await chatSession.sendMessage(message);
        const hintResponse = result.response.text();

        res.status(200).json({
            success: true,
            hint: hintResponse,
            currentLevel: hintCount,
            hasNextHint: hintCount < 3
        });

    } catch (err) {
        console.error("Full AI Error Object:", err);
        res.status(500).json({ error: err.message });
    }
};