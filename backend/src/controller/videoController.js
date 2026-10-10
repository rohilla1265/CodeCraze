import { v2 as cloudinary } from 'cloudinary';
import Problem from "../models/problem.js";
import User from '../models/user.js';
import solutionVideo from "../models/solutionVideo.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const generateUploadSignature = async (req, res) => {
  try {
    const { problemid } = req.params;
    const userid = req.result._id;
    
    const problem_find = await Problem.findById(problemid);
    if (!problem_find) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicid = `sankalcode_solutions/${problemid}/${userid}_${timestamp}`;
    
    const uploadparameters = {
      timestamp: timestamp,
      public_id: publicid,
    };

    const signature = cloudinary.utils.api_sign_request(
      uploadparameters,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      public_id: publicid,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
    });

  } catch (error) {
    console.error('Error generating upload signature:', error);
    res.status(500).json({ error: 'Failed to generate upload credentials' });
  }
};

const saveVideoMetadata = async (req, res) => {
  try {
    const {
      problemid,
      cloudinaryid,
      secureurl,
      duration,
    } = req.body;

    const userid = req.result._id;

    const cloudinaryresources = await cloudinary.api.resource(
      cloudinaryid,
      { resource_type: 'video' }
    );

    if (!cloudinaryresources) {
      return res.status(400).json({ error: 'Video not found on Cloudinary' });
    }

    const existingvideo = await solutionVideo.findOne({
      problemid,
      userid,
      cloudinaryid
    });

    if (existingvideo) {
      return res.status(409).json({ error: 'Video already exists' });
    }

    const thumbnailurl = cloudinary.url(cloudinaryresources.public_id, {
      resource_type: "image",
      format: "jpg",
      transformation: [
        { width: 400, height: 225, crop: 'fill' },
        { quality: 'auto' },
        { start_offset: 'auto' } 
      ],
    });

    const videosolution = await solutionVideo.create({
      problemid,
      userid,
      cloudinaryid,
      secureurl,
      duration: cloudinaryresources.duration || duration,
      thumbnail: thumbnailurl
    });

    res.status(201).json({
      message: 'Video solution saved successfully',
      videoSolution: {
        id: videosolution._id,
        thumbnail: videosolution.thumbnail,
        duration: videosolution.duration,
        uploadedAt: videosolution.createdAt
      }
    });

  } catch (error) {
    console.error('Error saving video metadata:', error);
    res.status(500).json({ error: 'Failed to save video metadata' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { problemid } = req.params;
    const userid = req.result._id;

    const video = await solutionVideo.findOneAndDelete({ problemid, userid });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await cloudinary.uploader.destroy(video.cloudinaryid, { resource_type: 'video', invalidate: true });

    res.json({ message: 'Video deleted successfully' });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

export { generateUploadSignature, saveVideoMetadata, deleteVideo };