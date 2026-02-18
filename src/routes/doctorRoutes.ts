import { Router } from "express";
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  doctorLogin,
} from "../controllers/doctorController.js";

const doctorRoutes = Router();

doctorRoutes.get("/api/doctor", getDoctors);         /////////////// doctors
doctorRoutes.get("/api/doctor/:id", getDoctorById);
doctorRoutes.post("/api/doctor", createDoctor);
doctorRoutes.post("/api/doctor/login", doctorLogin);
doctorRoutes.put("/api/doctor/:id", updateDoctor);
doctorRoutes.delete("/api/doctor/:id", deleteDoctor);

export default doctorRoutes;
