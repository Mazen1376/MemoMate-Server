import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  doctorLogin,
  getDoctorRequests,
  getDoctorPatients,
  addRequest,
  updateRequestStatus,
} from "../controllers/doctorController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const doctorRoutes = Router();

// DOCTOR AUTH
doctorRoutes.post("/api/doctor", createDoctor);
doctorRoutes.post("/api/doctor/login", doctorLogin); 

// DOCTOR CRUD
doctorRoutes.get("/api/doctor", getDoctors);
doctorRoutes.get("/api/doctor/id", verifyToken, getDoctorById);
doctorRoutes.put("/api/doctor", verifyToken, updateDoctor);
doctorRoutes.delete("/api/doctor", verifyToken, deleteDoctor);

// PATIENTS
doctorRoutes.get("/api/doctor/patients", verifyToken, getDoctorPatients);

// REQUESTS
doctorRoutes.get("/api/doctor/requests", verifyToken, getDoctorRequests);
doctorRoutes.post("/api/doctor/requests", verifyToken, addRequest);
doctorRoutes.put("/api/doctor/requests", verifyToken, updateRequestStatus);

//

export default doctorRoutes;
