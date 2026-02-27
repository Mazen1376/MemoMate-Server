import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  doctorLogin,
  getDoctorRequests,
  addRequest,
  updateRequestStatus,
} from "../controllers/doctorController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const doctorRoutes = Router();

// DOCTOR CRUD
doctorRoutes.get("/api/doctor", verifyToken, getDoctors);
doctorRoutes.get("/api/doctor/:id", verifyToken, getDoctorById);
doctorRoutes.post("/api/doctor", createDoctor);
doctorRoutes.post("/api/doctor/login", doctorLogin);
doctorRoutes.put("/api/doctor/:id", verifyToken, updateDoctor);
doctorRoutes.delete("/api/doctor/:id", verifyToken, deleteDoctor);

// REQUESTS
doctorRoutes.get("/api/doctor/:id/requests", verifyToken, getDoctorRequests);       // get all requests
doctorRoutes.post("/api/doctor/:id/requests", verifyToken, addRequest);             // add a request (push request id)
doctorRoutes.put("/api/doctor/:id/requests", verifyToken, updateRequestStatus);     // accept or decline

export default doctorRoutes;
