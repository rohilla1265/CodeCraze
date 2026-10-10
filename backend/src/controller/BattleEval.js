// import Submission from "../models/submission.js";
// import BattleResult from "../models/BattleResult.js";
// import Room from "../models/room.js";
// import User from "../models/user.js";

// // ✅ Instant First-to-Solve Evaluation (Mini Militia style)
// export const evaluateBattle = async (req, res, io) => {
//   try {
//     const { roomId, problemId, userId, code, language, runtime, memory, testCasesPassed, totalTestCases } = req.body;

//     const room = await Room.findOne({ roomId });
//     if (!room) {
//       return res.status(404).json({ error: "Room not found" });
//     }

//     // Agar battle already khatam ho chuki hai
//     if (room.status === "finished") {
//       return res.status(400).json({ error: "Battle already ended!" });
//     }

//     // Save individual submission
//     const submission = await Submission.create({
//       roomId,
//       problemId,
//       userId,
//       code,
//       language,
//       runtime,
//       memory,
//       testCasesPassed,
//       status: testCasesPassed === totalTestCases ? "Accepted" : "Failed",
//     });

//     // Check if solution is fully correct
//     const isFullyCorrect = testCasesPassed === totalTestCases;

//     if (isFullyCorrect) {
//       // Room status lock karo taaki koi aur pehle win na kar sake
//       room.status = "finished";
//       await room.save();

//       // Find loser (other participant)
//       const loserId = room.participants.find(p => p.toString() !== userId.toString());

//       // Save match result
//       const result = await BattleResult.create({
//         roomId,
//         winnerId: userId,
//         loserId: loserId || userId,
//         problemId,
//         metrics: { runtime, memory, codeLength: code?.length || 0 },
//       });

//       // Update Points (+10 for winner, -5 for loser)
//       await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });
//       if (loserId) {
//         await User.findByIdAndUpdate(loserId, { $inc: { points: -5 } });
//       }

//       // 🔔 Sabhi ko turant broadcast karo ki battle khatam aur kon jeeta!
//       if (io) {
//         io.to(roomId).emit("battleOver", {
//           winnerId: userId,
//           result,
//           message: "A player solved the problem first! Battle Over."
//         });
//       }

//       return res.status(200).json({ success: true, winner: true, message: "You won the battle!" });
//     }

//     return res.status(200).json({ success: true, winner: false, message: "Submitted, but test cases failed." });
//   } catch (err) {
//     console.error("Instant Evaluation Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };
import Submission from "../models/submission.js";
import BattleResult from "../models/BattleResult.js";
import Room from "../models/room.js";
import User from "../models/user.js";
import Problem from "../models/problem.js";
import { getlanguageById, submitToken, submitBatch } from "../utils/problemUtility.js";

export const evaluateBattle = async (req, res) => {
  try {
    const { roomId, problemId, userId, code, language } = req.body;
    const io = req.app.get("io");

    if (!roomId || !problemId || !userId || !code || !language) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.status === "finished") {
      return res.status(400).json({ error: "Battle already ended!" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const languageId = getlanguageById(language);
    if (!languageId) return res.status(400).json({ error: "Invalid Language ID" });

    if (!problem.hiddenTestcases || problem.hiddenTestcases.length === 0) {
      return res.status(400).json({ error: "No test cases found for this problem" });
    }

    // Map testcases just like working userSubmission.js
    const submissions = problem.hiddenTestcases.map((testcase) => ({
      source_code: Buffer.from(code).toString("base64"),
      language_id: languageId,
      stdin: Buffer.from((testcase.input || "").trim()).toString("base64"),
      expected_output: Buffer.from((testcase.output || "").trim()).toString("base64"),
    }));

    const submitResult = await submitBatch(submissions, { base64: true });

    if (!submitResult || !Array.isArray(submitResult)) {
      console.error("Judge0 Submission Error:", submitResult);
      return res.status(500).json({ error: "Judge0 submission failed" });
    }

    const resultTokens = submitResult.map((item) => item.token).join(",");
    console.log("Tokens received:", resultTokens);

    let testResult;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      testResult = await submitToken(resultTokens, { base64: true });
      const submissionsList = testResult?.submissions || (Array.isArray(testResult) ? testResult : null);

      if (submissionsList) {
        const isProcessing = submissionsList.some((s) => s.status && s.status.id <= 2);
        if (!isProcessing) {
          testResult = submissionsList;
          break;
        }
      }

      console.log(`Attempt ${attempts + 1}: Code still processing...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    if (attempts === maxAttempts) {
      return res.status(408).json({ error: "Execution Timed Out on Judge0" });
    }

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        status = test.status_id == 4 ? "error" : "wrong";
        errorMessage = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf-8') : test.compile_output;
        break;
      }
    }

    const totalTestCases = problem.hiddenTestcases.length;
    const isFullyCorrect = (testCasesPassed === totalTestCases && status === "accepted");

    // Save individual submission record
    const submissionResult = await Submission.create({
      roomId,
      problemId,
      userId,
      code,
      language,
      runtime,
      memory,
      testCasesPassed,
      testCasesTotal: totalTestCases,
      status: isFullyCorrect ? "Accepted" : status,
      errorMessage,
    });

    if (isFullyCorrect) {
      room.status = "finished";
      await room.save();

      const loserId = room.participants.find(p => p.toString() !== userId.toString());

      const result = await BattleResult.create({
        roomId,
        winnerId: userId,
        loserId: loserId || userId,
        problemId,
        metrics: { runtime, memory, codeLength: code?.length || 0 },
      });

      await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });
      if (loserId) {
        await User.findByIdAndUpdate(loserId, { $inc: { points: -5 } });
      }

      // 🔔 Yeh socket event room ke sabhi users ko bhejega
      if (io) {
        io.to(roomId).emit("battleOver", {
          winnerId: userId,
          result,
          message: "A player solved the problem first! Winner declared."
        });
      }

      // Room ko delete karne ke liye
      await Room.deleteOne({ roomId });

      return res.status(200).json({ 
        success: true, 
        winner: true, 
        message: "You won the battle! Room has been closed.",
        submission: submissionResult
      });
    }

    return res.status(200).json({ 
      success: true, 
      winner: false, 
      message: "Submitted, but all test cases did not pass.",
      submission: submissionResult
    });
  } catch (err) {
    console.error("Instant Evaluation Error:", err);
    res.status(500).json({ error: err.message });
  }
};