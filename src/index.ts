import express from "express";
// Triggering redeploy after cleaning repo
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
import { connectDB } from "./lib/mongoDB.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running..." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

