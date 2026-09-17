import { useParams } from "react-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosClient from "../../utils/axiosClient.js";

function Adminuplaod() {
    const { problemid } = useParams();
    const [uploading, setuploading] = useState(false);
    const [uploadprogress, setuploadprogress] = useState(0);
    const [uploadedvideo, setuploadedvideo] = useState(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setError,
        clearErrors
    } = useForm();

    const selectfile = watch('videoFile')?.[0];

    const onSubmit = async (data) => {
        const file = data.videoFile[0];
        setuploading(true);
        setuploadprogress(0);
        clearErrors();

        try {
            // Step 1: Get signature from backend using correct parameter 'problemid'
            const setsignature = await axiosClient.get(`/video/create/${problemid}`);
            const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = setsignature.data;
            const targetUploadUrl = upload_url || `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`;
            
            // Step 2: Prepare FormData for Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('public_id', public_id);
            formData.append('api_key', api_key);

            // Step 3: Direct upload to Cloudinary
            const uploadResponse = await axios.post(targetUploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setuploadprogress(progress);
                },
            });

            const cloudinaryResult = uploadResponse.data;
            console.log("Cloudinary Upload Success Result:", cloudinaryResult);

            // Step 4: Save metadata to backend using exact expected keys
            const metadataResponse = await axiosClient.post('/video/save', {
                problemid: problemid,
                cloudinaryid: cloudinaryResult.public_id, 
                secureurl: cloudinaryResult.secure_url,    
                duration: cloudinaryResult.duration,
            });

            setuploadedvideo(metadataResponse.data.videoSolution);
            reset();
        }
        catch (err) {
            console.log('Upload error:', err);
            setError('root', {
                type: 'manual',
                message: err.response?.data?.error || err.message || 'Upload failed. Please try again.'
            });
        } finally {
            setuploading(false);
            setuploadprogress(0);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // return (
    //     <div className="max-w-md mx-auto p-6">
    //         <div className="card bg-base-100 shadow-xl">
    //             <div className="card-body">
    //                 <h2 className="card-title">Upload Video</h2>

    //                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    //                     {/* File Input */}
    //                     <div className="form-control w-full">
    //                         <label className="label">
    //                             <span className="label-text">Choose video file</span>
    //                         </label>
    //                         <input
    //                             type="file"
    //                             accept="video/*"
    //                             {...register('videoFile', {
    //                                 required: 'Please select a video file',
    //                                 validate: {
    //                                     isVideo: (files) => {
    //                                         if (!files || !files[0]) return 'Please select a video file';
    //                                         const file = files[0];
    //                                         return file.type.startsWith('video/') || 'Please select a valid video file';
    //                                     },
    //                                     fileSize: (files) => {
    //                                         if (!files || !files[0]) return true;
    //                                         const file = files[0];
    //                                         const maxSize = 100 * 1024 * 1024; // 100MB
    //                                         return file.size <= maxSize || 'File size must be less than 100MB';
    //                                     }
    //                                 }
    //                             })}
    //                             className={`file-input file-input-bordered w-full ${errors.videoFile ? 'file-input-error' : ''}`}
    //                             disabled={uploading}
    //                         />
    //                         {errors.videoFile && (
    //                             <label className="label">
    //                                 <span className="label-text-alt text-error">{errors.videoFile.message}</span>
    //                             </label>
    //                         )}
    //                     </div>

    //                     {/* Selected File Info */}
    //                     {selectfile && (
    //                         <div className="alert alert-info">
    //                             <div>
    //                                 <h3 className="font-bold">Selected File:</h3>
    //                                 <p className="text-sm">{selectfile.name}</p>
    //                                 <p className="text-sm">Size: {formatFileSize(selectfile.size)}</p>
    //                             </div>
    //                         </div>
    //                     )}

    //                     {/* Upload Progress */}
    //                     {uploading && (
    //                         <div className="space-y-2">
    //                             <div className="flex justify-between text-sm">
    //                                 <span>Uploading...</span>
    //                                 <span>{uploadprogress}%</span>
    //                             </div>
    //                             <progress
    //                                 className="progress progress-primary w-full"
    //                                 value={uploadprogress}
    //                                 max="100"
    //                             ></progress>
    //                         </div>
    //                     )}

    //                     {/* Error Message */}
    //                     {errors.root && (
    //                         <div className="alert alert-error">
    //                             <span>{errors.root.message}</span>
    //                         </div>
    //                     )}

    //                     {/* Success Message */}
    //                     {uploadedvideo && (
    //                         <div className="alert alert-success">
    //                             <div>
    //                                 <h3 className="font-bold">Upload Successful!</h3>
    //                                 <p className="text-sm">Duration: {formatDuration(uploadedvideo.duration)}</p>
    //                                 <p className="text-sm">Uploaded: {new Date(uploadedvideo.uploadedAt).toLocaleString()}</p>
    //                             </div>
    //                         </div>
    //                     )}

    //                     {/* Upload Button */}
    //                     <div className="card-actions justify-end">
    //                         <button
    //                             type="submit"
    //                             disabled={uploading}
    //                             className={`btn btn-primary ${uploading ? 'loading' : ''}`}
    //                         >
    //                             {uploading ? 'Uploading...' : 'Upload Video'}
    //                         </button>
    //                     </div>
    //                 </form>

    //             </div>
    //         </div>
    //     </div>
    // );
    return (
    <div className="max-w-xl mx-auto my-10 p-4">
      <div className="card bg-base-100 border border-base-200 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300">
        <div className="card-body p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="card-title text-2xl font-bold justify-center text-base-content tracking-wide">
              Upload Video
            </h2>
            <p className="text-xs text-base-content/60">
              MP4, WebM or MOV up to 100MB
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Custom Drag & Drop File Input */}
            <div className="form-control w-full">
              <label className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-base-300 hover:border-primary/60 rounded-2xl cursor-pointer bg-base-200/40 hover:bg-base-200 transition-all duration-200 group">
                
                <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-2 text-center px-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-content transition-all duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-base-content">
                      <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-base-content/50">Maximum file size: 100MB</p>
                  </div>
                </div>

                <input
                  type="file"
                  accept="video/*"
                  {...register('videoFile', {
                    required: 'Please select a video file',
                    validate: {
                      isVideo: (files) => {
                        if (!files || !files[0]) return 'Please select a video file';
                        const file = files[0];
                        return file.type.startsWith('video/') || 'Please select a valid video file';
                      },
                      fileSize: (files) => {
                        if (!files || !files[0]) return true;
                        const file = files[0];
                        const maxSize = 100 * 1024 * 1024; // 100MB
                        return file.size <= maxSize || 'File size must be less than 100MB';
                      }
                    }
                  })}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {errors.videoFile && (
                <label className="label pb-0">
                  <span className="label-text-alt text-error font-medium flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {errors.videoFile.message}
                  </span>
                </label>
              )}
            </div>

            {/* Selected File Info */}
            {selectfile && (
              <div className="alert bg-base-200 border border-base-300 rounded-xl flex items-center justify-between p-4 shadow-sm">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2 bg-info/10 text-info rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </div>
                  <div className="truncate">
                    <h4 className="font-semibold text-sm truncate">{selectfile.name}</h4>
                    <p className="text-xs text-base-content/60">{formatFileSize(selectfile.size)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2 bg-base-200/50 p-4 rounded-xl border border-base-200">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-base-content/70">Uploading file...</span>
                  <span className="text-primary">{uploadprogress}%</span>
                </div>
                <progress
                  className="progress progress-primary w-full h-2 rounded-full"
                  value={uploadprogress}
                  max="100"
                ></progress>
              </div>
            )}

            {/* Error Message */}
            {errors.root && (
              <div className="alert alert-error rounded-xl shadow-sm text-sm py-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{errors.root.message}</span>
              </div>
            )}

            {/* Success Message */}
            {uploadedvideo && (
              <div className="alert alert-success rounded-xl shadow-sm py-3 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div className="space-y-0.5">
                  <h4 className="font-bold">Upload Successful!</h4>
                  <p className="text-xs opacity-90">Duration: {formatDuration(uploadedvideo.duration)}</p>
                  <p className="text-xs opacity-90">Uploaded: {new Date(uploadedvideo.uploadedAt).toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className={`btn btn-primary w-full rounded-xl text-sm font-semibold shadow-md transition-transform active:scale-[0.98] ${
                uploading ? 'loading' : ''
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}


export default Adminuplaod;