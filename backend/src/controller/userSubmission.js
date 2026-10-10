// import Problem from "../models/problem.js";
// import Submission from "../models/submission.js";
// import User from "../models/user.js";
// import {
//   getlanguageById,
//   submitToken,
//   submitBatch,
// } from "../utils/problemUtility.js";
// export const submitCode = async (req, res) => {
//   try {
//     const userId = req.result._id;
//     const problemId = req.params.id;
//     const { code, language } = req.body;

//     if (!userId || !code || !problemId || !language)
//       return res.status(400).send("Some field missing");

//     const problem = await Problem.findById(problemId);
//     if (!problem) return res.status(404).send("Problem not found");

//     const submissionResult = await Submission.create({
//       userId,
//       problemId,
//       code,
//       language,
//       status: "pending",
//       testCasesTotal: problem.hiddenTestcases.length,
//     });

//     const languageId = getlanguageById(language);

//     const submissions = problem.hiddenTestcases.map((testcases) => ({
//       // Sirf ye 3 lines change karni hain Base64 encoding ke liye
//       source_code: Buffer.from(code).toString("base64"),
//       stdin: Buffer.from(testcases.input || "").toString("base64"),
//       expected_output: Buffer.from(testcases.output || "").toString("base64"),
//       language_id: languageId,
//     }));
//     const submitResult = await submitBatch(submissions);
//     const resultToken = submitResult.map((value) => value.token);
//     const testResult = await submitToken(resultToken);

//     let testCasesPassed = 0;
//     let runtime = 0;
//     let memory = 0;
//     let status = "accepted";
//     let errorMessage = null;

//     for (const test of testResult) {
//       if (test.status_id == 3) {
//         testCasesPassed++;
//         runtime += parseFloat(test.time || 0);
//         memory = Math.max(memory, test.memory || 0);
//       } else {
//         status = test.status_id == 4 ? "error" : "wrong";
//         errorMessage = test.stderr || test.compile_output;
//         break; // Error milte hi break kar sakte hain optimization ke liye
//       }
//     }

//     submissionResult.status = status;
//     submissionResult.testCasesPassed = testCasesPassed;
//     submissionResult.errorMessage = errorMessage;
//     submissionResult.runtime = runtime;
//     submissionResult.memory = memory;
//     await submissionResult.save();

//     // Fix: Ensure problemsolved exists before calling .includes()
//     const user = req.result;
//     if (
//       status === "accepted" &&
//       user.problemsolved &&
//       !user.problemsolved.includes(problemId)
//     ) {
//       user.problemsolved.push(problemId);
//       user.points+=problem.points;
//       await user.save();
//     }

//     res.status(201).send(submissionResult);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error " + err.message);
//   }
// };

// export const runcode = async (req, res) => {
//   try {
//     const userid = req.result?._id;
//     const problemid = req.params.id;
//     const { code, language } = req.body;

//     console.log("--- New Run Request ---");
//     console.log(`User: ${userid}, Problem: ${problemid}, Lang: ${language}`);

//     if (!userid || !problemid || !code || !language) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     // FIX 1: Correct model name used
//     const foundProblem = await Problem.findById(problemid);
//     if (!foundProblem) {
//       return res.status(404).json({ success: false, message: "Problem not found" });
//     }

//     // FIX 2: Function name corrected
//     const languageid = getlanguageById(language);
//     if (!languageid) {
//       return res.status(400).json({ success: false, message: "Invalid Language ID" });
//     }

//     if (!foundProblem.visibleTestcases || foundProblem.visibleTestcases.length === 0) {
//       return res.status(400).json({ success: false, message: "No test cases found" });
//     }

//     const submissions = foundProblem.visibleTestcases.map((testcase) => ({
//       source_code: Buffer.from(code).toString("base64"),
//       language_id: languageid,
//       stdin: Buffer.from(testcase.input || "").toString("base64"),
//       expected_output: Buffer.from(testcase.output || "").toString("base64"),
//     }));

//     // FIX 3: Function name corrected
//     const submitresult = await submitBatch(submissions, { base64: true });

//     if (!submitresult || !Array.isArray(submitresult)) {
//       console.error("Judge0 Submission Error:", submitresult);
//       return res.status(500).json({ success: false, error: "Judge0 submission failed" });
//     }

//     const resulttokens = submitresult.map((item) => item.token).join(",");
//     console.log("Tokens received:", resulttokens);

//     let testresult;
//     let attempts = 0;
//     const maxAttempts = 10;

//     while (attempts < maxAttempts) {
//       // FIX 4: Function name corrected
//       testresult = await submitToken(resulttokens, { base64: true });

//       const submissionsList = testresult?.submissions || (Array.isArray(testresult) ? testresult : null);

//       if (submissionsList) {
//         const isProcessing = submissionsList.some((s) => s.status && s.status.id <= 2);
//         if (!isProcessing) {
//           testresult = submissionsList;
//           break;
//         }
//       }

//       console.log(`Attempt ${attempts + 1}: Code still processing...`);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       attempts++;
//     }

//     if (attempts === maxAttempts) {
//       return res.status(408).json({
//         success: false,
//         message: "Execution Timed Out on Judge0",
//       });
//     }

//     const decodedResults = testresult.map(item => ({
//     ...item,
//     stdout: item.stdout ? Buffer.from(item.stdout, 'base64').toString('utf-8') : null,
//     stderr: item.stderr ? Buffer.from(item.stderr, 'base64').toString('utf-8') : null,
//     compile_output: item.compile_output ? Buffer.from(item.compile_output, 'base64').toString('utf-8') : null,
// }));

// return res.status(200).json({
//     success: true,
//     results: decodedResults
// });
//   } catch (err) {
//     console.error("CRITICAL ERROR IN RUNCODE:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: err.message,
//     });
//   }
// };
import Problem from "../models/problem.js";
import Submission from "../models/submission.js";
import User from "../models/user.js";
import {
  getlanguageById,
  submitToken,
  submitBatch,
} from "../utils/problemUtility.js";

export const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !code || !problemId || !language)
      return res.status(400).send("Some field missing");

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).send("Problem not found");

    const submissionResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestcases.length,
    });

    const languageId = getlanguageById(language);

    const submissions = problem.hiddenTestcases.map((testcases) => ({
      source_code: Buffer.from(code).toString("base64"),
      stdin: Buffer.from((testcases.input || "").trim()).toString("base64"),
      expected_output: Buffer.from((testcases.output || "").trim()).toString("base64"),
      language_id: languageId,
    }));
    
    // FIX: Added base64 option here
    const submitResult = await submitBatch(submissions, { base64: true });
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

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
        errorMessage = test.stderr || test.compile_output;
        break; 
      }
    }

    submissionResult.status = status;
    submissionResult.testCasesPassed = testCasesPassed;
    submissionResult.errorMessage = errorMessage;
    submissionResult.runtime = runtime;
    submissionResult.memory = memory;
    await submissionResult.save();

    const user = req.result;
    if (
      status === "accepted" &&
      user.problemsolved &&
      !user.problemsolved.includes(problemId)
    ) {
      user.problemsolved.push(problemId);
      user.points += problem.points;
      await user.save();
    }

    res.status(201).send(submissionResult);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error " + err.message);
  }
};

export const runcode = async (req, res) => {
  try {
    const userid = req.result?._id;
    const problemid = req.params.id;
    const { code, language } = req.body;

    console.log("--- New Run Request ---");
    console.log(`User: ${userid}, Problem: ${problemid}, Lang: ${language}`);

    if (!userid || !problemid || !code || !language) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const foundProblem = await Problem.findById(problemid);
    if (!foundProblem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const languageid = getlanguageById(language);
    if (!languageid) {
      return res.status(400).json({ success: false, message: "Invalid Language ID" });
    }

    if (!foundProblem.visibleTestcases || foundProblem.visibleTestcases.length === 0) {
      return res.status(400).json({ success: false, message: "No test cases found" });
    }

    const submissions = foundProblem.visibleTestcases.map((testcase) => ({
      source_code: Buffer.from(code).toString("base64"),
      language_id: languageid,
      stdin: Buffer.from((testcase.input || "").trim()).toString("base64"),
      expected_output: Buffer.from((testcase.output || "").trim()).toString("base64"),
    }));

    const submitresult = await submitBatch(submissions, { base64: true });

    if (!submitresult || !Array.isArray(submitresult)) {
      console.error("Judge0 Submission Error:", submitresult);
      return res.status(500).json({ success: false, error: "Judge0 submission failed" });
    }

    const resulttokens = submitresult.map((item) => item.token).join(",");
    console.log("Tokens received:", resulttokens);

    let testresult;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      testresult = await submitToken(resulttokens, { base64: true });

      const submissionsList = testresult?.submissions || (Array.isArray(testresult) ? testresult : null);

      if (submissionsList) {
        const isProcessing = submissionsList.some((s) => s.status && s.status.id <= 2);
        if (!isProcessing) {
          testresult = submissionsList;
          break;
        }
      }

      console.log(`Attempt ${attempts + 1}: Code still processing...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    if (attempts === maxAttempts) {
      return res.status(408).json({
        success: false,
        message: "Execution Timed Out on Judge0",
      });
    }

    const decodedResults = testresult.map(item => ({
      ...item,
      stdout: item.stdout ? Buffer.from(item.stdout, 'base64').toString('utf-8') : null,
      stderr: item.stderr ? Buffer.from(item.stderr, 'base64').toString('utf-8') : null,
      compile_output: item.compile_output ? Buffer.from(item.compile_output, 'base64').toString('utf-8') : null,
    }));

    return res.status(200).json({
      success: true,
      results: decodedResults
    });
  } catch (err) {
    console.error("CRITICAL ERROR IN RUNCODE:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
