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

const doctorRoutes = Router();

// DOCTOR CRUD
doctorRoutes.get("/api/doctor", getDoctors);
doctorRoutes.get("/api/doctor/:id", getDoctorById);
doctorRoutes.post("/api/doctor", createDoctor);
doctorRoutes.post("/api/doctor/login", doctorLogin);
doctorRoutes.put("/api/doctor/:id", updateDoctor);
doctorRoutes.delete("/api/doctor/:id", deleteDoctor);

// REQUESTS
doctorRoutes.get("/api/doctor/:id/requests", getDoctorRequests);       // get all requests
doctorRoutes.post("/api/doctor/:id/requests", addRequest);             // add a request (push request id)
doctorRoutes.put("/api/doctor/:id/requests", updateRequestStatus);     // accept or decline

export default doctorRoutes;
