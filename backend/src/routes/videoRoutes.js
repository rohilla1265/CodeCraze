import express from 'express'
import {adminMiddleware} from '../middlewere/adminMiddleware.js';
const videoRouter = express.Router();
import {generateUploadSignature, saveVideoMetadata, deleteVideo} from '../controller/videoController.js'
videoRouter.get("/create/:problemid",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemid",adminMiddleware,deleteVideo);
export default videoRouter;