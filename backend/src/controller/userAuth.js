// import User from "../models/user.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import validate from "../utils/validate.js";
// import { configDotenv } from "dotenv";
// import dotenv  from "dotenv";
// import redisClient from "../config/redis.js";
// export const register = async (req, res) => {
//     dotenv.config();
//     try {
//         validate(req.body);
//         const { email, password } = req.body;
        
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await User.create({ ...req.body, password: hashedPassword });
//          const reply ={
//             firstname: newUser.firstname,
//             email:newUser.email,
//             _id:newUser._id,
//             role: newUser.role
//         }
//         const token = jwt.sign({ _id: newUser._id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
//         res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
//         res.status(200).json({
//             user:reply,
//             message:"user registered succesfully"
//         });
//     } catch (e) {
//         res.status(400).send("Error: " + e.message);
//     }
// };

// export const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) throw new Error("Invalid Credentials");

//         const user = await User.findOne({ email });
//         if (!user) throw new Error("Invalid Credentials");

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) throw new Error("Invalid Credentials");

//         // FIX: Yahan user.role add karein
//         const reply ={
//             firstname: user.firstname,
//             email:user.email,
//             _id:user._id,
//             role:user.role
//         }
//         const token = jwt.sign(
//             { _id: user._id, email, role: user.role }, 
//             process.env.JWT_SECRET, 
//             { expiresIn: '7d' }
//         );
        
//         res.cookie('token', token, { httpOnly: true, maxAge: 36000000 });
//         res.status(200).json({
//             user:reply,
//             message:"logged in succesfully"
//         });
        
//     } catch (err) {
//         res.status(401).send("Error: " + err.message);
//     }
// };
// export const logout = async(req,res) => {
//     try{
//         const {token} = req.cookies;
//         const payload = jwt.decode(token);
//         await redisClient.set(`token:${token}`,'Blocked');
//         await redisClient.expireAt(`token:${token}`,payload.exp);
//         res.cookie("token",null,{expires: new Date(Date.now())});
//         res.send("Logged Out Successfully");
//     } 
//     catch(err){
//         console.log("Error: "+ err.message);
//     }
// }
// export const adminregister = async (req, res) => {
//     try {
//         validate(req.body); 
//         const { firstname, emailId, password } = req.body;

//         // 1. Password hash karein
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // 2. Admin User create karein (Yahan 'role' add karna zaroori hai)
//         const user = await User.create({
//             ...req.body,
//             password: hashedPassword,
//             role: 'admin' // <--- Ye line role set karegi
//         });

//         // 3. Token mein bhi role pass karein
//         const token = jwt.sign(
//             { _id: user._id, emailId: emailId, role: user.role }, 
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         res.cookie('token', token, { 
//             httpOnly: true, 
//             maxAge: 3600000,
//             path: '/' 
//         });

//         res.status(201).send("Admin Registered Successfully");
//     }
//     catch (err) {
//         res.status(400).send("Error: " + err.message);
//     }
// };
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validate from "../utils/validate.js";
import redisClient from "../config/redis.js";

export const register = async (req, res) => {
    try {
        validate(req.body);
        const { email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ ...req.body, password: hashedPassword });
        
        const reply = {
            firstname: newUser.firstname,
            email: newUser.email,
            _id: newUser._id,
            role: newUser.role
        };
        
        const token = jwt.sign({ _id: newUser._id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.cookie('token', token, { 
            httpOnly: true, 
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        return res.status(201).json({
            user: reply,
            message: "User registered successfully"
        });
    } catch (e) {
        return res.status(400).json({ message: "Error: " + e.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const reply = {
            firstname: user.firstname,
            email: user.email,
            _id: user._id,
            role: user.role
        };

        const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        
        // 7 days in milliseconds matching JWT expiry
        res.cookie('token', token, { 
            httpOnly: true, 
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({
            user: reply,
            message: "Logged in successfully"
        });
        
    } catch (err) {
        return res.status(500).json({ message: "Error: " + err.message });
    }
};

export const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(400).json({ message: "No token found, already logged out" });
        }

        const payload = jwt.decode(token);
        if (payload && payload.exp) {
            await redisClient.set(`token:${token}`, 'Blocked');
            await redisClient.expireAt(`token:${token}`, payload.exp);
        }

        res.clearCookie("token");
        return res.status(200).json({ message: "Logged Out Successfully" });
    } 
    catch (err) {
        return res.status(500).json({ message: "Error: " + err.message });
    }
};

export const adminregister = async (req, res) => {
    try {
        validate(req.body); 
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Admin already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            ...req.body,
            password: hashedPassword,
            role: 'admin'
        });

        const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { 
            httpOnly: true, 
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(201).json({ message: "Admin Registered Successfully" });
    }
    catch (err) {
        return res.status(400).json({ message: "Error: " + err.message });
    }
};