// import { getlanguageById, submitBatch, submitToken } from "../utils/problemUtility.js";
// import Problem from "../models/problem.js";
// import User from "../models/user.js";
// import solutionVideo from "../models/solutionVideo.js";
// export const createproblem = async (req, res) => {
//     // 1. Destructuring exactly matching your Mongoose Schema keys
//     const { 
//         title, description, difficulty, tags,
//         visibleTestcases, // Schema name
//         hiddenTestcases,  // Schema name
//         startCode,        // Schema name
//         referenceSolution, // Schema name
//         problemCreator,
//         points     // Schema name
//     } = req.body;

//     try {
//         // 2. Strict Validation Checks
//         if (!referenceSolution || !Array.isArray(referenceSolution) || referenceSolution.length === 0) {
//             return res.status(400).send("referenceSolution array is required!");
//         }

//         if (!visibleTestcases || !Array.isArray(visibleTestcases)) {
//             return res.status(400).send("visibleTestcases is missing or not an array!");
//         }

//         // 3. Validation Loop using Judge0
//         for (const { language, completeCode } of referenceSolution) {
            
//             const languageId = getlanguageById(language);

//             const submissions = visibleTestcases.map((testcase) => ({
//                 source_code: Buffer.from(completeCode).toString('base64'),
//                 language_id: languageId,
//                 stdin: Buffer.from(testcase.input).toString('base64'),
//                 expected_output: Buffer.from(testcase.output).toString('base64')
//             }));

//             const submitResult = await submitBatch(submissions, { base64: true });
//             const resultToken = submitResult.map((value) => value.token);

//             // Wait for Judge0 results (Polling)
//             const testResult = await submitToken(resultToken);

//             for (const test of testResult) {
//                 // Status 3 = Accepted
//                 if (test.status_id !== 3) {
//                     console.log("❌ Code Validation Failed:", test.status.description);
                    
//                     return res.status(400).json({
//                         error: "Reference code is invalid!",
//                         reason: test.status.description,
//                         compile_output: test.compile_output ? Buffer.from(test.compile_output, 'base64').toString() : "Logic Error"
//                     });
//                 }
//             }
//         }

//         // 4. DATABASE SAVE
//         // Yahan hum structured object bhej rahe hain taaki keys match karein
//         const userProblem = await Problem.create({
//             title,
//             description,
//             difficulty,
//             tags,
//             visibleTestcases,
//             hiddenTestcases,
//             startCode,
//             referenceSolution,
//             problemCreator: req.result?._id || problemCreator,
//             points
//         });

//         return res.status(201).send("Problem Saved Successfully");

//     } catch (err) {
//         console.log("❌ Submit Error:", err.message);
//         return res.status(500).send(err.message);
//     }
// };
// export const updateProblem = async (req, res) => {
//     const { id } = req.params;
    
//     // 1. Destructure exactly matching the schema to avoid undefined errors
//     const { 
//         title, 
//         description, 
//         difficulty, 
//         tags, 
//         visibleTestcases, 
//         hiddenTestcases, 
//         startCode, 
//         referenceSolution, // Keep it consistent with schema
//         problemCreator,
//         points
//     } = req.body;

//     try {
//         if (!id) {
//             return res.status(404).send("Problem ID is missing");
//         }

//         // 2. Strict Check: Agar referenceSolution array nahi hai to yahi stop kar do
//         if (!referenceSolution || !Array.isArray(referenceSolution) || referenceSolution.length === 0) {
//             return res.status(400).send("referenceSolution array is required for validation");
//         }

//         // 3. Validation Loop
//         for (const { language, completeCode } of referenceSolution) {
//             const languageId = getlanguageById(language);
            
//             // Validation requires visible testcases
//             if (!visibleTestcases || visibleTestcases.length === 0) {
//                 return res.status(400).send("Visible testcases are required to validate the code");
//             }

//             const submission = visibleTestcases.map((testcase) => ({
//                 // Use Buffer for Node.js environments (Safe for UTF-8)
//                 source_code: Buffer.from(completeCode).toString('base64'),
//                 language_id: languageId,
//                 stdin: Buffer.from(testcase.input).toString('base64'),
//                 expected_output: Buffer.from(testcase.output).toString('base64')
//             }));

//             const submitResult = await submitBatch(submission);
//             const resultToken = submitResult.map((value) => value.token);
            
//             // Yahan await lagana zaroori hai
//             const testResult = await submitToken(resultToken);

//             for (const test of testResult) {
//                 // Status 3 = Accepted. Garbage code status 6 ya 4 dega.
//                 if (test.status_id !== 3) {
//                     console.log("❌ Update Validation Failed:", test.status.description);
//                     return res.status(400).json({
//                         error: "Update failed: Reference solution is incorrect",
//                         reason: test.status.description,
//                         detail: test.compile_output ? Buffer.from(test.compile_output, 'base64').toString() : "Logic mismatch"
//                     });
//                 }
//             }
//         }

//         // 4. DATABASE UPDATE
//         // Sirf tabhi hoga jab upar ka validation pass hoga
//         const updatedProblem = await Problem.findByIdAndUpdate(
//             id,
//             { 
//                 title, 
//                 description, 
//                 difficulty, 
//                 tags, 
//                 visibleTestcases, 
//                 hiddenTestcases, 
//                 startCode, 
//                 referenceSolution, 
//                 problemCreator,
//                 points
//             },
//             { runValidators: true, new: true }
//         );

//         if (!updatedProblem) {
//             return res.status(404).send("Problem not found in Database");
//         }

//         res.status(200).json({ message: "Problem Updated Successfully", data: updatedProblem });

//     } catch (err) {
//         console.error("Update Error:", err.message);
//         res.status(500).send("Internal Server Error: " + err.message);
//     }
// };
// export const deleteProblem = async(req,res)=>{

//   const {id} = req.params;
//   try{
     
//     if(!id)
//       return res.status(400).send("ID is Missing");

//    const deletedProblem = await Problem.findByIdAndDelete(id);

//    if(!deletedProblem)
//     return res.status(404).send("Problem is Missing");


//    res.status(200).send("Successfully Deleted");
//   }
//   catch(err){
     
//     res.status(500).send("Error: "+err);
//   }
// }


// // export const getProblemById = async(req,res)=>{

// //   const {id} = req.params;
// //   try{
     
// //     if(!id)
// //       return res.status(400).send("ID is Missing");

// //     const getProblem = await Problem.findById(id);

// //    if(!getProblem)
// //     return res.status(404).send("Problem is Missing");


// //    res.status(200).send(getProblem);
// //   }
// //   catch(err){
// //     res.status(500).send("Error: "+err);
// //   }
// // }
// export const getProblemById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     if (!id) return res.status(400).send("ID is Missing");

//     const getProblem = await Problem.findById(id);

//     if (!getProblem) return res.status(404).send("Problem is Missing");

//     // Fetch video associated with this problem
//     const video = await solutionVideo.findOne({ problemid: id });

//     // Merge problem details with video metadata
//     const responseData = {
//       ...getProblem.toObject(),
//       secureurl: video ? video.secureurl : null,
//       thumbnail: video ? video.thumbnail : null,
//       duration: video ? video.duration : null,
//     };

//     return res.status(200).json(responseData);
//   } catch (err) {
//     res.status(500).send("Error: " + err.message);
//   }
// };

// export const getAllProblem = async(req,res)=>{

//   try{
     
//     const getProblem = await Problem.find({});

//    if(getProblem.length==0)
//     return res.status(404).send("Problem is Missing");


//    res.status(200).send(getProblem);
//   }
//   catch(err){
//     res.status(500).send("Error: "+err);
//   }
// }
// export const solvedAllProblembyUser = async (req, res) => {
//     try {
//         const userId = req.result._id;

//         // Fresh data fetch karein populate ke saath
//         const user = await User.findById(userId).populate({
//             path: "problemsolved", 
//             select: "_id title difficulty tags"
//         });

//         if (!user) return res.status(404).send("User not found");
//         // Yahan user.save() ki zaroorat nahi hai, sirf send karein
//         res.status(200).send(user.problemsolved || []);

//     } catch (err) {
//         console.error("Fetch Error:", err.message);
//         res.status(500).send("Server Error: " + err.message);
//     }
// };
import { getlanguageById, submitBatch, submitToken } from "../utils/problemUtility.js";
import Problem from "../models/problem.js";
import User from "../models/user.js";
import solutionVideo from "../models/solutionVideo.js";

export const createproblem = async (req, res) => {
    const { 
        title, description, difficulty, tags,
        visibleTestcases, 
        hiddenTestcases,  
        startCode,        
        referenceSolution, 
        problemCreator,
        points     
    } = req.body;

    try {
        if (!referenceSolution || !Array.isArray(referenceSolution) || referenceSolution.length === 0) {
            return res.status(400).send("referenceSolution array is required!");
        }

        if (!visibleTestcases || !Array.isArray(visibleTestcases)) {
            return res.status(400).send("visibleTestcases is missing or not an array!");
        }

        for (const { language, completeCode } of referenceSolution) {
            const languageId = getlanguageById(language);

            const submissions = visibleTestcases.map((testcase) => ({
                source_code: Buffer.from(completeCode).toString('base64'),
                language_id: languageId,
                stdin: Buffer.from(testcase.input.trim()).toString('base64'),
                expected_output: Buffer.from(testcase.output.trim()).toString('base64')
            }));

            const submitResult = await submitBatch(submissions, { base64: true });
            const resultToken = submitResult.map((value) => value.token);

            const testResult = await submitToken(resultToken);

            for (const test of testResult) {
                if (test.status_id !== 3) {
                    console.log("❌ Code Validation Failed:", test.status.description);
                    
                    return res.status(400).json({
                        error: "Reference code is invalid!",
                        reason: test.status.description,
                        compile_output: test.compile_output ? Buffer.from(test.compile_output, 'base64').toString() : "Logic Error"
                    });
                }
            }
        }

        const userProblem = await Problem.create({
            title,
            description,
            difficulty,
            tags,
            visibleTestcases,
            hiddenTestcases,
            startCode,
            referenceSolution,
            problemCreator: req.result?._id || problemCreator,
            points
        });

        return res.status(201).send("Problem Saved Successfully");

    } catch (err) {
        console.log("❌ Submit Error:", err.message);
        return res.status(500).send(err.message);
    }
};

export const updateProblem = async (req, res) => {
    const { id } = req.params;
    
    const { 
        title, 
        description, 
        difficulty, 
        tags, 
        visibleTestcases, 
        hiddenTestcases, 
        startCode, 
        referenceSolution, 
        problemCreator,
        points
    } = req.body;

    try {
        if (!id) {
            return res.status(404).send("Problem ID is missing");
        }

        if (!referenceSolution || !Array.isArray(referenceSolution) || referenceSolution.length === 0) {
            return res.status(400).send("referenceSolution array is required for validation");
        }

        for (const { language, completeCode } of referenceSolution) {
            const languageId = getlanguageById(language);
            
            if (!visibleTestcases || visibleTestcases.length === 0) {
                return res.status(400).send("Visible testcases are required to validate the code");
            }

            const submission = visibleTestcases.map((testcase) => ({
                source_code: Buffer.from(completeCode).toString('base64'),
                language_id: languageId,
                stdin: Buffer.from(testcase.input.trim()).toString('base64'),
                expected_output: Buffer.from(testcase.output.trim()).toString('base64')
            }));

            const submitResult = await submitBatch(submission, { base64: true });
            const resultToken = submitResult.map((value) => value.token);
            
            const testResult = await submitToken(resultToken);

            for (const test of testResult) {
                if (test.status_id !== 3) {
                    console.log("❌ Update Validation Failed:", test.status.description);
                    return res.status(400).json({
                        error: "Update failed: Reference solution is incorrect",
                        reason: test.status.description,
                        detail: test.compile_output ? Buffer.from(test.compile_output, 'base64').toString() : "Logic mismatch"
                    });
                }
            }
        }

        const updatedProblem = await Problem.findByIdAndUpdate(
            id,
            { 
                title, 
                description, 
                difficulty, 
                tags, 
                visibleTestcases, 
                hiddenTestcases, 
                startCode, 
                referenceSolution, 
                problemCreator,
                points
            },
            { runValidators: true, new: true }
        );

        if (!updatedProblem) {
            return res.status(404).send("Problem not found in Database");
        }

        res.status(200).json({ message: "Problem Updated Successfully", data: updatedProblem });

    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).send("Internal Server Error: " + err.message);
    }
};

export const deleteProblem = async(req, res) => {
  const { id } = req.params;
  try {
    if (!id)
      return res.status(400).send("ID is Missing");

   const deletedProblem = await Problem.findByIdAndDelete(id);

   if (!deletedProblem)
    return res.status(404).send("Problem is Missing");

   res.status(200).send("Successfully Deleted");
  } catch(err) {
    res.status(500).send("Error: " + err);
  }
}

export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id);

    if (!getProblem) return res.status(404).send("Problem is Missing");

    const video = await solutionVideo.findOne({ problemid: id });

    const responseData = {
      ...getProblem.toObject(),
      secureurl: video ? video.secureurl : null,
      thumbnail: video ? video.thumbnail : null,
      duration: video ? video.duration : null,
    };

    return res.status(200).json(responseData);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

export const getAllProblem = async(req, res) => {
  try {
    const getProblem = await Problem.find({});

   if (getProblem.length == 0)
    return res.status(404).send("Problem is Missing");

   res.status(200).send(getProblem);
  } catch(err) {
    res.status(500).send("Error: " + err);
  }
}

export const solvedAllProblembyUser = async (req, res) => {
    try {
        const userId = req.result._id;

        const user = await User.findById(userId).populate({
            path: "problemsolved", 
            select: "_id title difficulty tags"
        });

        if (!user) return res.status(404).send("User not found");
        res.status(200).send(user.problemsolved || []);

    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).send("Server Error: " + err.message);
    }
};