import jwt from "jsonwebtoken";
import User from "../models/user.js";
import redisClient from "../config/redis.js";
// export  async function adminMiddleware(req,res,next) {
//     try{
//         const {token} = req.cookies;
//         if(!token){
//             throw new Error("Token is not found");
//         }
//         const IsBlocked = await redisClient.exists(`token:${token}`);
// if(IsBlocked){
//     throw new Error("Invalid Token"); // Or "jwt expired" depending on catch block
// }
//         const payload = jwt.verify(token,process.env.JWT_SECRET);
//         const {_id} = payload;
//         if(!_id){
//             throw new Error("Invalid Tokens");
//         }
//         const result = await User.findById(_id);
//         if(!result){
//             throw new Error("User Doesn't Exist");
//         }
//         if(payload.role!='admin'){
//             throw new Error("Not an admin");
//         }
//         const IsBlocked = await redisClient.exists(`token:${token}`);
//         if(IsBlocked){
//             throw new Error("Invalid Token");
//         }
//         req.result = result;
//         next();

//     }
//     catch(err){
//         res.status(401).send("Error: "+err.message);
//     }
// }
export async function adminMiddleware(req, res, next) {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            throw new Error("Token is not found");
        }

        // 1. Pehle Verify karein (ye check karega ki token valid hai ya expired)
        // Ensure process.env.JWT_SECRET is loaded correctly
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Phir Redis check karein (Check if it was logged out/blacklisted)
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error("Token is blacklisted (Logged out)");
        }

        // 3. Role check
        if (payload.role !== 'admin') {
            throw new Error("Not an admin");
        }

        // 4. Database check
        const result = await User.findById(payload._id);
        if (!result) {
            throw new Error("User Doesn't Exist");
        }

        req.result = result;
        next();

    } catch (err) {
        // Agar jwt.verify fail hota hai (expired/invalid), to wo yahan aayega
        // res.status(401).send("Error: " + err.message);
        // catch(err) {
    if (err.name === 'TokenExpiredError') {
        console.log("Expired at:", err.expiredAt);
    }
    res.status(401).send("Error: " + err.message);
}
}