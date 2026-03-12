import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import messageModel from "../models/messageModel.js";

export const initSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register user socket to their own user ID
    socket.on("register", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Handle sending text messages directly between doctor and patient
    socket.on("send_message", async (data: { doctorId: string; patientId: string; sender: "doctor" | "patient"; text: string }) => {
      console.log("Message received:", data);
      
      try {
        // 1. Save message to database
        const newMessage = new messageModel({
          doctorId: data.doctorId,
          patientId: data.patientId,
          sender: data.sender, // Who sent it: 'doctor' or 'patient'
          text: data.text,
        });
        const savedMessage = await newMessage.save();

        // 2. Determine who the receiver is
        const receiverId = data.sender === "doctor" ? data.patientId : data.doctorId;

        // 3. Send to the receiver's personal user room
        socket.to(receiverId).emit("receive_message", savedMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};


