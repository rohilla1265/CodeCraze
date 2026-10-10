// import mongoose from "mongoose";
// const {Schema} = mongoose;
// const videoSchema = new Schema({
//     problemId:{
//         type:Schema.Types.ObjectId,
//         ref:'problem',
//         required: true
//     },
//     userId:{
//         type:Schema.Types.ObjectId,
//         ref:'user',
//         required:true
//     },
//     cloudinaryPublicId:{
//         type: String,
//         required:true,
//         unique:true
//     },
//     secureUrl: {
//         type:String,
//         required:true
//     },
//     thumbnailURL:{
//         type:String
//     },
//     duration:{
//         type:Number,
//         required:true
//     }
// },{
//     timestamps:true
// });
// const solutionVideo = mongoose.model('video',videoSchema);
// export default solutionVideo;
import mongoose from "mongoose";
const { Schema } = mongoose;

const videoSchema = new Schema({
    problemid: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    cloudinaryid: {
        type: String,
        required: true,
        unique: true
    },
    secureurl: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    duration: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const solutionVideo = mongoose.model('video', videoSchema);
export default solutionVideo;