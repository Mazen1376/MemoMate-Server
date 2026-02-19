import { asyncHandler } from "../utils/asyncHandler.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcryptjs";

// Utility to remove sensitive fields
const sanitizeDoctor = (doctor: any) => {
  const doctorObj = doctor.toObject ? doctor.toObject() : { ...doctor };
  delete doctorObj.password;
  return doctorObj;
};

export const getDoctors = asyncHandler(async (req: any, res: any) => {
  const doctors = await doctorModel.find().select("-password");
  res.status(200).json({ success: true, count: doctors.length, data: doctors });
});


export const getDoctorById = asyncHandler(async (req: any, res: any) => {
  const doctor = await doctorModel.findById(req.params.id).select("-password");
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  res.status(200).json({ success: true, data: doctor });
});


export const doctorLogin = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const doctor = await doctorModel.findOne({ email: email.toLowerCase() });
  
  if (!doctor) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, doctor.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.status(200).json({ 
    success: true, 
    data: sanitizeDoctor(doctor) 
  });
});

export const createDoctor = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  const existingDoctor = await doctorModel.findOne({ email: email.toLowerCase() });
  if (existingDoctor) {
    res.status(400);
    throw new Error("Doctor already exists with this email");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const doctor = await doctorModel.create({
    ...req.body,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  res.status(201).json({ success: true, data: sanitizeDoctor(doctor) });
});


export const updateDoctor = asyncHandler(async (req: any, res: any) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }

  const doctor = await doctorModel.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true, runValidators: true }
  ).select("-password");

  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  res.status(200).json({ success: true, data: doctor });
});


export const deleteDoctor = asyncHandler(async (req: any, res: any) => {
  const doctor = await doctorModel.findByIdAndDelete(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  res.status(200).json({ success: true, message: "Doctor deleted successfully" });
});


// ─── REQUESTS ─────────────────────────────────────────────────────────────────

export const getDoctorRequests = asyncHandler(async (req: any, res: any) => {
  const doctor = await doctorModel.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  res.status(200).json({ success: true, count: doctor.requests.length, data: doctor.requests });
});

export const addRequest = asyncHandler(async (req: any, res: any) => {
  const { id } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("Request ID (_id) is required in body");
  }

  const doctor = await doctorModel.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  if (doctor.requests.includes(id)) {
    res.status(400);
    throw new Error("Request already submitted to this doctor");
  }

  doctor.requests.push(id);
  await doctor.save();

  res.status(200).json({ success: true, message: "Request added successfully" });
});


export const updateRequestStatus = asyncHandler(async (req: any, res: any) => {
  const { status, patientId } = req.body;

  if (!status || !patientId) {
    res.status(400);
    throw new Error("Status and patientId are required in body");
  }

  const doctor = await doctorModel.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }


  if (status === "accepted") {
    if (!patientId) {
      res.status(400);
      throw new Error("patientId is required to accept request");
    }
    // Remove from requests, add to patients
    doctor.requests = doctor.requests.filter(id => id.toString() !== patientId.toString());
    if (!doctor.patients.includes(patientId)) {
      doctor.patients.push(patientId);
    }
  } else if (status === "declined") {
    // Just remove from requests
    doctor.requests = doctor.requests.filter(id => id.toString() !== patientId.toString());
  } else {
    res.status(400);
    throw new Error("Invalid status. Must be 'accepted' or 'declined'");
  }

  res.status(200).json({ success: true, message: `Request ${status} successfully` });
});
