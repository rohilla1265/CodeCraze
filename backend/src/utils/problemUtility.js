// import axios from "axios";

// // Environment variables use karna best practice hai
// const RAPID_API_KEY = 'dcfa5b0095msh95d5895f5b2f4f4p147d15jsn16864994426b';

// const RAPID_API_HOST = 'judge0-ce.p.rapidapi.com';

// export const getlanguageById = (lang) => {
//     const languageMap = {
//         "c++": 54,
//         "java": 62,
//         "javascript": 63
//     };
//     return languageMap[lang.toLowerCase()] || 63; 
// };

// // Step 1: Code Submit karke tokens lena
// export const submitBatch = async (submissions) => {
//     const options = {
//         method: 'POST',
//         url: `https://${RAPID_API_HOST}/submissions/batch`,
//         params: { base64_encoded: 'true' },
//         headers: {
//             'x-rapidapi-key':  'dcfa5b0095msh95d5895f5b2f4f4p147d15jsn16864994426b',
//             'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//             'Content-Type': 'application/json'
//         },
//         data: { submissions }
//     };

//     try {
//         const response = await axios.request(options);
//         return response.data; // Array of tokens [{token: "..."}, ...]
//     } catch (error) {
//         console.error("Submission Error:", error.response?.data || error.message);
//         throw error;
//     }
// };

// // Step 2: Tokens se results fetch karna (Polling Logic)
// export const submitToken = async (resultTokens) => {
//     // Tokens array ko string mein badlein "token1,token2,..."
//     const tokensString = (typeof resultTokens[0] === 'string') 
//         ? resultTokens.join(",") 
//         : resultTokens.map(t => t.token).join(",");

//     if (!tokensString) {
//         throw new Error("Tokens not found for submission check");
//     };

//     const options = {
//         method: 'GET',
//         url: `https://${RAPID_API_HOST}/submissions/batch`,
//         params: {
//             tokens: tokensString,
//             base64_encoded: 'true',
//             fields: '*'
//         },
//         headers: {
//             'x-rapidapi-key': 'dcfa5b0095msh95d5895f5b2f4f4p147d15jsn16864994426b',
//             'x-rapidapi-host': RAPID_API_HOST
//         }
//     };

//     // Polling Loop
//     while (true) {
//         try {
//             const response = await axios.request(options);
//             const results = response.data.submissions;
//             // Check: Kya sabka status_id > 2 ho gaya? (3=Accepted, 4=Wrong Answer, etc.)
//             const isFinished = results.every((r) => r.status_id > 2);

//             if (isFinished) {
//                 return results;
//             }

//             // 1.5 second wait karein agle check se pehle
//             await new Promise(resolve => setTimeout(resolve, 1500));
//             console.log("Still processing test cases...");

//         } catch (error) {
//             console.error("Fetch Error:", error.response?.data || error.message);
//             throw error;
//         }
//     }
// };

// export default { getlanguageById, submitBatch, submitToken };
import axios from "axios";

const RAPID_API_HOST = process.env.RAPID_API_HOST || "judge0-ce.p.rapidapi.com";
const RAPID_API_KEY = process.env.RAPID_API_KEY || "dcfa5b0095msh95d5895f5b2f4f4p147d15jsn16864994426b";

export const getlanguageById = (lang) => {
    if (!lang) return 63;
    const languageMap = {
        "c++": 54,
        "cpp": 54,
        "java": 62,
        "javascript": 63,
        "js": 63,
        "python": 71
    };
    return languageMap[lang.toLowerCase()] || 63; 
};

// Step 1: Code Submit karke tokens lena
export const submitBatch = async (submissions) => {
    const options = {
        method: 'POST',
        url: `https://${RAPID_API_HOST}/submissions/batch`,
        params: { base64_encoded: 'true' },
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_HOST,
            'Content-Type': 'application/json'
        },
        data: { submissions }
    };

    try {
        const response = await axios.request(options);
        return response.data; // Array of tokens [{token: "..."}, ...]
    } catch (error) {
        console.error("Submission Error:", error.response?.data || error.message);
        throw error;
    }
};

// Step 2: Tokens se results fetch karna (Controlled Polling Logic)
export const submitToken = async (resultTokens) => {
    let tokensString = "";

    // String, Array of Strings, ya Array of Objects handle karne ke liye logic
    if (typeof resultTokens === "string") {
        tokensString = resultTokens;
    } else if (Array.isArray(resultTokens) && resultTokens.length > 0) {
        tokensString = typeof resultTokens[0] === "string" 
            ? resultTokens.join(",") 
            : resultTokens.map(t => t.token || t).join(",");
    }

    if (!tokensString) {
        throw new Error("Tokens not found for submission check");
    }

    const options = {
        method: 'GET',
        url: `https://${RAPID_API_HOST}/submissions/batch`,
        params: {
            tokens: tokensString,
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_HOST
        }
    };

    let attempts = 0;
    const maxAttempts = 10; // Safety Limit: Maximum 15 seconds polling (10 x 1.5s)

    while (attempts < maxAttempts) {
        try {
            const response = await axios.request(options);
            const results = response.data?.submissions || (Array.isArray(response.data) ? response.data : []);

            if (!results || results.length === 0) {
                throw new Error("No submission data returned from Judge0");
            }

            // Check: Kya sabhi test cases execute ho chuke hain? (status.id > 2)
            const isFinished = results.every((r) => {
                const statusId = r.status?.id || r.status_id;
                return statusId > 2; // 1 = In Queue, 2 = Processing
            });

            if (isFinished) {
                return results;
            }

            console.log(`Polling Judge0... Attempt ${attempts + 1}/${maxAttempts}`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            attempts++;

        } catch (error) {
            console.error("Fetch Error:", error.response?.data || error.message);
            throw error;
        }
    }

    throw new Error("Execution Timeout: Code took too long on Judge0");
};

export default { getlanguageById, submitBatch, submitToken };