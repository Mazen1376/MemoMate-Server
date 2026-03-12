import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/mongoDB.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { initSocket } from "./lib/socket.js";

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);


// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use(doctorRoutes);
app.use(patientRoutes);
app.use(messageRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running..." });
});

// Error handling middleware
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
