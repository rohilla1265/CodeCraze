import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import User from "../models/user.js";
export default async function userMiddleware(req,res,next) {
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not found");
        }
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        const {_id} = payload;
        if(!_id){
            throw new Error("Invalid Tokens");
        }
        const result = await User.findById(_id);
        if(!result){
            throw new Error("User Doesn't Exist");
        }
        const IsBlocked = await redisClient.exists(`token:${token}`);
        if(IsBlocked){
            throw new Error("Invalid Token");
        }
        req.result = result;
        next();

    }
    catch(err){
        res.status(401).send("Error: "+err.message);
    }
}