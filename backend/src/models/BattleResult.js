import mongoose from "mongoose";
const { Schema } = mongoose;

const battleResultSchema = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  winnerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  metrics: {
    runtime: { type: Number, default: 0 },
    memory: { type: Number, default: 0 },
    speed: { type: Number, default: 0 }, // time taken to submit
    codeLength: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const BattleResult = mongoose.model("BattleResult", battleResultSchema);
export default BattleResult;
