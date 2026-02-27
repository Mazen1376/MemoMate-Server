import { Router } from "express";
import {
  getPatients,
  getPatientById,
  registerPatient,
  patientLogin,
  updatePatient,
  deletePatient,
  getMedicines,
  addMedicine,
  deleteMedicine,
} from "../controllers/patientController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const patientRoutes = Router();

// ─── Auth ────────────────────────────────────────────────────────────────────── Done
patientRoutes.post("/api/patient/register", registerPatient);
patientRoutes.post("/api/patient/login", patientLogin);

// ─── Patient CRUD ──────────────────────────────────────────────────────────────
patientRoutes.get("/api/patient", getPatients);                           // for admin (not implemented)
patientRoutes.get("/api/patient/id", verifyToken, getPatientById);        // protected — own profile
patientRoutes.put("/api/patient", verifyToken, updatePatient);            // protected — update own profile
patientRoutes.delete("/api/patient", verifyToken, deletePatient);         // protected — delete own account

// ─── Medicines ───────────────────────────────────────────────────────────────── Done
patientRoutes.get("/api/patient/medicines", verifyToken, getMedicines);                        // get all medicines
patientRoutes.post("/api/patient/medicines", verifyToken, addMedicine);                        // add a medicine
patientRoutes.delete("/api/patient/medicines/:medicineId", verifyToken, deleteMedicine);       // remove a medicine

export default patientRoutes;
