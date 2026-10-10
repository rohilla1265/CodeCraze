import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const { Schema } = mongoose;

const roomSchema = new Schema({
  roomId: {
    type: String,
    unique: true,
    default: () => uuidv4(), // auto-generate unique roomId
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  joinee: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  otp: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["waiting", "active", "finished"],
    default: "waiting",
  },
  bidAmount: {
    type: Number,
    default: 0,
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  durationMinutes: {   // 👈 user sets this manually
    type: Number,
    default: 30,       // default 30 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// TTL index for auto cleanup
roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Room = mongoose.model("Room", roomSchema);
export default Room;