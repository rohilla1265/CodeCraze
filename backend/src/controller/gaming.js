// import Room from "../models/room.js";
// // controllers/roomController.js
// import { v4 as uuidv4 } from "uuid";

// function generateOtp(length = 8) {
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
//   let otp = "";
//   for (let i = 0; i < length; i++) {
//     otp += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return otp;
// }

// export const createRoom = async (req, res) => {
//   try {
//     if (!req.result?._id) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized access" });
//     }
//     const hostId = req.result._id;
//     const { problemId, durationMinutes } = req.body;

//     const validDuration =
//       Number(durationMinutes) > 0 ? Number(durationMinutes) : 60;
//     const expiresAt = new Date(Date.now() + validDuration * 60 * 1000);

//     const roomId = uuidv4();
//     const otp = generateOtp();

//     // createRoom function ke andar:
//     let room = await Room.create({
//       roomId,
//       hostId,
//       creator: hostId,
//       joinee: null,
//       participants: [hostId],
//       otp,
//       problemId: problemId || null,
//       durationMinutes: validDuration,
//       expiresAt,
//     });

//     // Yeh line add/verify karein:
//     room = await Room.findById(room._id).populate(['creator', 'joinee']);

//     const io = req.app.get("io");

//     if (!io) {
//       console.error("❌ Socket.io instance not found on req.app");
//     } else {
//       io.emit("roomCreated", { roomId: room.roomId, hostId: room.hostId });
//     }

//     // Populate user info agar schema me ref hai (optional)
//     await room.populate("creator");

//     return res.status(201).json({
//       success: true,
//       message: "Room created successfully",
//       roomId: room.roomId,
//       problemId: problemId,
//       otp: room.otp,
//       room,
//     });
//   } catch (err) {
//     console.error("Error creating room:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };

// // ✅ Join Room
// export const joinRoom = async (req, res) => {
//   try {
//     if (!req.result?._id) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized access" });
//     }
//     const userId = req.result._id;
//     const { roomId, otp } = req.body;

//     const room = await Room.findOne({ roomId, otp });
//     if (!room) {
//       return res.status(400).json({ error: "Invalid Room ID or Passcode OTP" });
//     }

//     if (room.status === "finished") {
//       return res.status(400).json({ error: "Room session is already closed" });
//     }

//     // Ensure creator is set if missing
//     if (!room.creator && room.hostId) {
//       room.creator = room.hostId;
//     }

//     // Set joinee if current user is not the creator
//     if (room.creator && room.creator.toString() !== userId.toString()) {
//       room.joinee = userId;
//     }

//     // Add participant if not existing
//     if (!room.participants.some((p) => p.toString() === userId.toString())) {
//       room.participants.push(userId);
//     }

//     // Auto update status to active when 2 players exist
//     if (room.participants.length >= 2 && room.status === "waiting") {
//       room.status = "active";
//     }

//     await room.save();
    
//     // Fetch and populate fields for real-time response
//     const updatedRoom = await Room.findById(room._id).populate(['creator', 'joinee']);

//     const io = req.app.get("io");
//     if (!io) {
//       console.error("❌ Socket.io instance not found on req.app");
//     } else {
//       io.to(roomId).emit("userJoined", {
//         userId,
//         participants: updatedRoom.participants,
//         status: updatedRoom.status,
//         room: updatedRoom,
//       });

//       // 2. Trigger Battle Start if status switched to active
//       if (updatedRoom.status === "active") {
//         io.to(roomId).emit("battleStarted", { room: updatedRoom });
//       }
//     }

//     return res.status(200).json({ message: "Joined room successfully", room: updatedRoom });
//   } catch (err) {
//     console.error("Error joining room:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Leave Room
// export const leaveRoom = async (req, res) => {
//   try {
//     const { roomId, userId } = req.body;
//     const io = req.app.get("io");

//     if (!roomId || !userId) {
//       return res.status(400).json({ error: "roomId and userId are required." });
//     }

//     const room = await Room.findOne({ roomId });
//     if (!room) {
//       return res.status(404).json({ error: "Room not found" });
//     }

//     // Host leaves while room is waiting → Cancel room
//     if (
//       room.hostId.toString() === userId.toString() &&
//       room.status === "waiting"
//     ) {
//       await Room.deleteOne({ roomId });
//       if (io) io.to(roomId).emit("roomCancelled", { hostId: userId, roomId });
//       return res.status(200).json({ message: "Host left, room cancelled" });
//     }

//     // Agar joinee leave kare toh joinee field null kar dein
//     if (room.joinee && room.joinee.toString() === userId.toString()) {
//       room.joinee = null;
//     }

//     // Remove participant
//     room.participants = room.participants.filter(
//       (p) => p.toString() !== userId.toString()
//     );

//     if (room.participants.length === 0) {
//       room.status = "finished";
//       if (io)
//         io.to(roomId).emit("roomFinished", { reason: "All participants left" });
//     }

//     await room.save();

//     // Real-time broadcast
//     if (io)
//       io.to(roomId).emit("userLeft", {
//         userId,
//         participants: room.participants,
//         room,
//       });

//     return res.status(200).json({ message: "Left room successfully", room });
//   } catch (err) {
//     console.error("Error leaving room:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Start Room
// export const startRoom = async (req, res) => {
//   try {
//     const { roomId, hostId } = req.body;
//     const io = req.app.get("io");

//     const room = await Room.findOne({ roomId });
//     if (!room) return res.status(404).json({ error: "Room not found" });

//     // Only host can start
//     if (room.hostId.toString() !== hostId.toString()) {
//       return res.status(403).json({ error: "Only host can start the match" });
//     }

//     // Status Check
//     if (room.status !== "waiting") {
//       return res
//         .status(400)
//         .json({ error: `Cannot start room with status '${room.status}'` });
//     }

//     room.status = "active";
//     await room.save();

//     if (io) io.to(roomId).emit("battleStarted", { roomId, room });

//     return res
//       .status(200)
//       .json({ message: "Battle started successfully", room });
//   } catch (err) {
//     console.error("Error starting room:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };

// // ✅ End Room
// export const endRoom = async (req, res) => {
//   try {
//     const { roomId } = req.body;
//     const io = req.app.get("io");

//     const room = await Room.findOne({ roomId });
//     if (!room) return res.status(404).json({ error: "Room not found" });

//     if (room.status === "finished") {
//       return res.status(400).json({ error: "Room is already finished" });
//     }

//     room.status = "finished";
//     await room.save();

//     if (io) io.to(roomId).emit("battleFinished", { roomId });

//     return res
//       .status(200)
//       .json({ message: "Battle finished successfully", room });
//   } catch (err) {
//     console.error("Error ending room:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Fetch Single Room Details by Room ID
// export const getRoomById = async (req, res) => {
//   try {
//     const { roomId } = req.params;

//     const room = await Room.findOne({ roomId }).populate(["creator", "joinee","problemId"]);
//     if (!room) {
//       return res.status(404).json({ error: "Room not found" });
//     }

//     return res.status(200).json({ success: true, room });
//   } catch (err) {
//     console.error("Error fetching room details:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };


import Room from "../models/room.js";
import { v4 as uuidv4 } from "uuid";

function generateOtp(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
}

export const createRoom = async (req, res) => {
  try {
    if (!req.result?._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const hostId = req.result._id;
    const { problemId, durationMinutes } = req.body;

    const validDuration =
      Number(durationMinutes) > 0 ? Number(durationMinutes) : 60;
    const expiresAt = new Date(Date.now() + validDuration * 60 * 1000);

    const roomId = uuidv4();
    const otp = generateOtp();

    let room = await Room.create({
      roomId,
      hostId,
      creator: hostId,
      joinee: null,
      participants: [hostId],
      otp,
      problemId: problemId || null,
      durationMinutes: validDuration,
      expiresAt,
    });

    // ✅ Added 'problemId' to populate
    room = await Room.findById(room._id).populate(['creator', 'joinee', 'problemId']);

    const io = req.app.get("io");

    if (!io) {
      console.error("❌ Socket.io instance not found on req.app");
    } else {
      io.emit("roomCreated", { roomId: room.roomId, hostId: room.hostId });
    }

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      roomId: room.roomId,
      problemId: problemId,
      otp: room.otp,
      room,
    });
  } catch (err) {
    console.error("Error creating room:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Join Room
export const joinRoom = async (req, res) => {
  try {
    if (!req.result?._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const userId = req.result._id;
    const { roomId, otp } = req.body;

    const room = await Room.findOne({ roomId, otp });
    if (!room) {
      return res.status(400).json({ error: "Invalid Room ID or Passcode OTP" });
    }

    if (room.status === "finished") {
      return res.status(400).json({ error: "Room session is already closed" });
    }

    if (!room.creator && room.hostId) {
      room.creator = room.hostId;
    }

    if (room.creator && room.creator.toString() !== userId.toString()) {
      room.joinee = userId;
    }

    if (!room.participants.some((p) => p.toString() === userId.toString())) {
      room.participants.push(userId);
    }

    // if (room.participants.length >= 2 && room.status === "waiting") {
    //   room.status = "active";
    // }

    await room.save();
    
    // ✅ Added 'problemId' to populate here as well
    const updatedRoom = await Room.findById(room._id).populate(['creator', 'joinee', 'problemId']);

    const io = req.app.get("io");
    if (!io) {
      console.error("❌ Socket.io instance not found on req.app");
    } else {
      io.to(roomId).emit("userJoined", {
        userId,
        participants: updatedRoom.participants,
        status: updatedRoom.status,
        room: updatedRoom,
      });

      // if (updatedRoom.status === "active") {
      //   io.to(roomId).emit("battleStarted", { room: updatedRoom });
      // }
    }

    return res.status(200).json({ message: "Joined room successfully", room: updatedRoom });
  } catch (err) {
    console.error("Error joining room:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ Leave Room
export const leaveRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const io = req.app.get("io");

    if (!roomId || !userId) {
      return res.status(400).json({ error: "roomId and userId are required." });
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (
      room.hostId.toString() === userId.toString() &&
      room.status === "waiting"
    ) {
      await Room.deleteOne({ roomId });
      if (io) io.to(roomId).emit("roomCancelled", { hostId: userId, roomId });
      return res.status(200).json({ message: "Host left, room cancelled" });
    }

    if (room.joinee && room.joinee.toString() === userId.toString()) {
      room.joinee = null;
    }

    room.participants = room.participants.filter(
      (p) => p.toString() !== userId.toString()
    );

    if (room.participants.length === 0) {
      room.status = "finished";
      if (io)
        io.to(roomId).emit("roomFinished", { reason: "All participants left" });
    }

    await room.save();

    if (io)
      io.to(roomId).emit("userLeft", {
        userId,
        participants: room.participants,
        room,
      });

    return res.status(200).json({ message: "Left room successfully", room });
  } catch (err) {
    console.error("Error leaving room:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ Start Room
export const startRoom = async (req, res) => {
  try {
    const { roomId, hostId } = req.body;
    const io = req.app.get("io");

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (room.hostId.toString() !== hostId.toString()) {
      return res.status(403).json({ error: "Only host can start the match" });
    }

    if (room.status !== "waiting") {
      return res
        .status(400)
        .json({ error: `Cannot start room with status '${room.status}'` });
    }

    room.status = "active";
    await room.save();

    if (io) io.to(roomId).emit("battleStarted", { roomId, room });

    return res
      .status(200)
      .json({ message: "Battle started successfully", room });
  } catch (err) {
    console.error("Error starting room:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ End Room
export const endRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const io = req.app.get("io");

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (room.status === "finished") {
      return res.status(400).json({ error: "Room is already finished" });
    }

    room.status = "finished";
    await room.save();

    if (io) io.to(roomId).emit("battleFinished", { roomId });

    return res
      .status(200)
      .json({ message: "Battle finished successfully", room });
  } catch (err) {
    console.error("Error ending room:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ Fetch Single Room Details by Room ID
export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    // ✅ Added 'problemId' to populate here
    const room = await Room.findOne({ roomId }).populate(["creator", "joinee", "problemId"]);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    return res.status(200).json({ success: true, room });
  } catch (err) {
    console.error("Error fetching room details:", err);
    return res.status(500).json({ error: err.message });
  }
};