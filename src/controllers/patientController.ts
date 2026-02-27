import { asyncHandler } from "../utils/asyncHandler.js";
import patientModel from "../models/patientModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../helpers/generateToken.js";
import { sanitizePatient } from "../utils/sanitize.js";




// ─── Auth ──────────────────────────────────────────────────────────────────────

// POST /api/patients/register
export const registerPatient = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const existing = await patientModel.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error("An account already exists with this email");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const patient = await patientModel.create({
    ...req.body,
    email:    email.toLowerCase(),
    password: hashedPassword,
  });

  const token = generateToken(patient._id.toString());

  res.status(201).json({ success: true, token, data: sanitizePatient(patient) });
});

// POST /api/patients/login
export const patientLogin = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const patient = await patientModel.findOne({ email: email.toLowerCase() });
  if (!patient) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, patient.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(patient._id.toString());

  res.status(200).json({ success: true, token, data: sanitizePatient(patient) });
});

// ─── Patient CRUD ──────────────────────────────────────────────────────────────

// GET /api/patients  (public)
export const getPatients = asyncHandler(async (req: any, res: any) => {
  const patients = await patientModel.find().select("-password");
  res.status(200).json({ success: true, count: patients.length, data: patients });
});

// GET /api/patients/me  (protected — own profile from token)
export const getPatientById = asyncHandler(async (req: any, res: any) => {
  const patient = await patientModel
    .findById(req.decodedToken.id)
    .select("-password");

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  res.status(200).json({ success: true, data: patient });
});

// PUT /api/patients  (protected — update own profile)
export const updatePatient = asyncHandler(async (req: any, res: any) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }

  const patient = await patientModel
    .findByIdAndUpdate(req.decodedToken.id, req.body, {
      new: true,
      runValidators: true,
    })
    .select("-password");

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  res.status(200).json({ success: true, data: patient });
});

// DELETE /api/patients  (protected — delete own account)
export const deletePatient = asyncHandler(async (req: any, res: any) => {
  const patient = await patientModel.findByIdAndDelete(req.decodedToken.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }
  res.status(200).json({ success: true, message: "Patient deleted successfully" });
});

// ─── Medicines ─────────────────────────────────────────────────────────────────

// GET /api/patients/medicines  (protected)
export const getMedicines = asyncHandler(async (req: any, res: any) => {
  const patient = await patientModel.findById(req.decodedToken.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }
  res.status(200).json({
    success: true,
    count: patient.medicines.length,
    data:  patient.medicines,
  });
});

// POST /api/patients/medicines  (protected — add a medicine)
export const addMedicine = asyncHandler(async (req: any, res: any) => {
  const { name, dose, date, time, times } = req.body;

  if (!name || !dose || !date || !time || !times) {
    res.status(400);
    throw new Error("name, dose, date, time and times are all required");
  }

  const patient = await patientModel.findById(req.decodedToken.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  patient.medicines.push({ name, dose, date, time, times });
  await patient.save();

  res.status(201).json({
    success: true,
    message: "Medicine added successfully",
    data:    patient.medicines,
  });
});

// DELETE /api/patients/medicines/:medicineId  (protected — remove a medicine)
export const deleteMedicine = asyncHandler(async (req: any, res: any) => {
  const { medicineId } = req.params;

  const patient = await patientModel.findById(req.decodedToken.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  const index = patient.medicines.findIndex(
    (m: any) => m._id.toString() === medicineId
  );

  if (index === -1) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  patient.medicines.splice(index, 1);
  await patient.save();

  res.status(200).json({
    success: true,
    message: "Medicine removed successfully",
    data:    patient.medicines,
  });
});
