// Apni main file me socket.io import karein aur controller se function import karein
import { Server } from "socket.io";
import { handleSocketJoin } from "./path-to-your-file.js"; // Apni controller file ka path likhein

// Jahan aapka httpServer create hota hai wahan socket initialize karein
const io = new Server(httpServer, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Jab frontend se code daal kar enter karenge
    socket.on("join_room", (data) => {
        // Humne controller ka function yahan bind kar diya
        handleSocketJoin(io, socket, data);
    });

    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});