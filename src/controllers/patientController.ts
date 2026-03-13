import { asyncHandler } from "../utils/asyncHandler.js";
import patientModel from "../models/patientModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../helpers/generateToken.js";
import { sanitizePatient } from "../utils/sanitize.js";
import { reverseGeocode } from "../helpers/reverseGeocode.js";
import doctorModel from "../models/doctorModel.js";

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

// GET /api/patients/id  (protected — own profile from token)
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


// ─── Family Tree ─────────────────────────────────────────────────────────────────

// GET /api/patients/familyTree  (protected)
export const getFamilyTree = asyncHandler(async (req: any, res: any) => {
  const patient = await patientModel.findById(req.decodedToken.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }
  res.status(200).json({
    success: true,
    count: patient.familyTree.length,
    data:  patient.familyTree,
  });
});

// POST /api/patients/familyTree  (protected — add a family member)
export const addFamilyMember = asyncHandler(async (req: any, res: any) => {
  const { familyMemberName, relationshipToPatient, familyMemberImage } = req.body;

  if (!familyMemberName || !relationshipToPatient) {
    res.status(400);
    throw new Error("familyMemberName and relationshipToPatient are all required");
  }

  const patient = await patientModel.findById(req.decodedToken.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  patient.familyTree.push({ familyMemberName, relationshipToPatient, familyMemberImage });
  await patient.save();

  res.status(201).json({
    success: true,
    message: "Family member added successfully",
    data:    patient.familyTree,
  });
});

 // DELETE /api/patients/familyTree/:memberId  (protected — remove a family member)
export const deleteFamilyMember = asyncHandler(async (req: any, res: any) => {
  const { memberId } = req.params;

  const patient = await patientModel.findById(req.decodedToken.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  const index = patient.familyTree.findIndex(
    (fm: any) => fm._id.toString() === memberId
  );

  if (index === -1) {
    res.status(404);
    throw new Error("Family member not found");
  }

  patient.familyTree.splice(index, 1);
  await patient.save();

  res.status(200).json({
    success: true,
    message: "Family member removed successfully",
    data:    patient.familyTree,
  });
}
);


// ─── Doctors ─────────────────────────────────────────────────────────────────

// GET /api/patients/doctors  (protected)
export const getPatientDoctors = asyncHandler(async (req: any, res: any) => {
  const patient = await patientModel.findById(req.decodedToken.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }
  res.status(200).json({
    success: true,
    count: patient.doctors.length,
    data:  patient.doctors,
  });
});

// POST /api/patients/doctors  (protected — send a request to a doctor)
export const sendRequestToDoctor = asyncHandler(async (req: any, res: any) => {
  const { doctorId } = req.params;

  if (!doctorId) {
    res.status(400);
    throw new Error("doctorId is required");
  }

  const patient = await patientModel.findById(req.decodedToken.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  const doctor = await doctorModel.findById(doctorId);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  // Check if request already sent or already a patient
  if (doctor.requests.includes(patient._id)) {
      res.status(400);
      throw new Error("Request already sent to this doctor");
  }
  
  if (doctor.patients.includes(patient._id)) {
      res.status(400);
      throw new Error("You are already a patient of this doctor");
  }

  doctor.requests.push(patient._id);
  await doctor.save();

  res.status(201).json({
    success: true,
    message: "Request sent to doctor successfully",
    data:    doctor.requests,
  });
});

// DELETE /api/patient/doctors/:doctorId  (protected — remove a doctor)
export const deletePatientDoctor = asyncHandler(async (req: any, res: any) => {
  const { doctorId } = req.params;

  const patient = await patientModel.findById(req.decodedToken.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  // Remove doctor from patient's doctors array
  const initialDoctorCount = patient.doctors.length;
  patient.doctors = patient.doctors.filter((d: any) => d.toString() !== doctorId);

  if (patient.doctors.length === initialDoctorCount) {
    res.status(404);
    throw new Error("Doctor not found in your list");
  }

  await patient.save();

  // Remove patient from doctor's patients array as well
  const doctor = await doctorModel.findById(doctorId);
  if (doctor) {
    doctor.patients = doctor.patients.filter(
      (p: any) => p.toString() !== patient._id.toString()
    );
    await doctor.save();
  }

  res.status(200).json({
    success: true,
    message: "Doctor removed successfully",
    data:    patient.doctors,
  });
});

// ─── Location ────────────────────────────────────────────────────────────────

// PUT /api/patient/location  (protected — update own location) 
export const updateLocation = asyncHandler(async (req: any, res: any) => {
  const { lat, lng } = req.body;

  if (lat === undefined || lat === null || lng === undefined || lng === null) {
    res.status(400);
    throw new Error("lat and lng are required");
  }

  if (typeof lat !== "number" || typeof lng !== "number") {
    res.status(400);
    throw new Error("lat and lng must be numbers");
  }

  // Reverse-geocode to get city & country (gracefully returns nulls on failure)
  const { city, country } = await reverseGeocode(lat, lng);

  const patient = await patientModel.findByIdAndUpdate(
    req.decodedToken.id,
    {
      lastLocation: {
        lat,
        lng,
        city,
        country,
        updatedAt: new Date(),
      },
    },
    { new: true, runValidators: true }
  ).select("-password");

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  res.status(200).json({
    success: true,
    message: "Location updated successfully",
    data:    patient.lastLocation,
  });
});

// GET /api/patient/location  (protected — get own last location)
export const getLocation = asyncHandler(async (req: any, res: any) => {
  const patient = await patientModel
    .findById(req.decodedToken.id)
    .select("lastLocation");

  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  res.status(200).json({
    success: true,
    data: patient.lastLocation,
  });
});
