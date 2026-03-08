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
  getFamilyTree,
  addFamilyMember,
  getPatientDoctors,
  sendRequestToDoctor,
  deletePatientDoctor,
  updateLocation,
  getLocation,
  deleteFamilyMember,
} from "../controllers/patientController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const patientRoutes = Router();

// ─── Auth ────────────────────────────────────────────────────────────────────── DONE
patientRoutes.post("/api/patient/register", registerPatient);
patientRoutes.post("/api/patient/login", patientLogin);

// ─── Patient CRUD ────────────────────────────────────────────────────────────── DONE
patientRoutes.get("/api/patient", getPatients);
patientRoutes.get("/api/patient/id", verifyToken, getPatientById);
patientRoutes.put("/api/patient", verifyToken, updatePatient);
patientRoutes.delete("/api/patient", verifyToken, deletePatient);

// ─── Medicines ───────────────────────────────────────────────────────────────── DONE
patientRoutes.get("/api/patient/medicines", verifyToken, getMedicines);
patientRoutes.post("/api/patient/medicines", verifyToken, addMedicine);
patientRoutes.delete("/api/patient/medicines/:medicineId", verifyToken, deleteMedicine);

// ─── Family Tree ───────────────────────────────────────────────────────────────── DONE
patientRoutes.get("/api/patient/familyTree", verifyToken, getFamilyTree);
patientRoutes.post("/api/patient/familyTree", verifyToken, addFamilyMember);
patientRoutes.delete("/api/patient/familyTree/:memberId", verifyToken, deleteFamilyMember);

// ─── Doctors ───────────────────────────────────────────────────────────────── DONE
patientRoutes.get("/api/patient/doctors", verifyToken, getPatientDoctors);
patientRoutes.post("/api/patient/doctors/:doctorId", verifyToken, sendRequestToDoctor);
patientRoutes.delete("/api/patient/doctors/:doctorId", verifyToken, deletePatientDoctor);

// ─── Location ──────────────────────────────────────────────────────────────── DONE (not tested)
patientRoutes.put("/api/patient/location", verifyToken, updateLocation);
patientRoutes.get("/api/patient/location", verifyToken, getLocation);

export default patientRoutes;
