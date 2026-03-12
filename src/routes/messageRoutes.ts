import { Router } from "express";
import { getMessages } from "../controllers/messageController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const messageRoutes = Router();

// Route to fetch chatting history
messageRoutes.get("/api/messages/:recieverId", verifyToken, getMessages);

export default messageRoutes;
