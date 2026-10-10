import express from "express";
const authRouter = express.Router();
import {register,login,logout,adminregister} from "../controller/userAuth.js";
import {adminMiddleware} from "../middlewere/adminMiddleware.js";
import userMiddleware from "../middlewere/userMiddlewere.js";
// REGISTER USER
authRouter.post("/register",register);
// LOGIN USER 
authRouter.post("/login",login);
// LOGOUT USER
authRouter.post("/logout",logout);
// admin register
authRouter.post("/admin/register",adminMiddleware,adminregister);
// GET PROFILE
// authRouter.post("/getprofile",getprofile);
authRouter.get('/check', userMiddleware,(req,res)=>{
    const reply={
        firstname: req.result.firstname,
        email: req.result.email,
        _id: req.result._id,
        role: req.result.role
    }
     res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})
export default authRouter;