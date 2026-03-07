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
  updateLocation,
  getLocation,
} from "../controllers/patientController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { deleteDoctor } from "../controllers/doctorController.js";

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

// ─── Family Tree ─────────────────────────────────────────────────────────────────
patientRoutes.get("/api/patient/familyTree", verifyToken, getFamilyTree);
patientRoutes.post("/api/patient/familyTree", verifyToken, addFamilyMember);
//patientRoutes.delete("/api/patient/familyTree", verifyToken, deleteFamilyMember);

// ─── Doctors ─────────────────────────────────────────────────────────────────
patientRoutes.get("/api/patient/doctors", verifyToken, getPatientDoctors);
patientRoutes.post("/api/patient/doctors/:doctorId", verifyToken, sendRequestToDoctor);
//patientRoutes.delete("/api/patient/doctors", verifyToken, deletePatientDoctor);

// ─── Location ────────────────────────────────────────────────────────────────
patientRoutes.get("/api/patient/location", verifyToken, getLocation);        // get last location
patientRoutes.put("/api/patient/location", verifyToken, updateLocation);     // update location

export default patientRoutes;
