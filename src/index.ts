import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/mongoDB.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use(doctorRoutes);
app.use(patientRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running..." });
});

// Error handling middleware
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
