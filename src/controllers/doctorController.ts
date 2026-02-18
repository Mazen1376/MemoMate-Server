import { asyncHandler } from "../utils/asyncHandler.js";
import doctorModel from "../models/doctorModel.js";

//instead of try and catch fot every controller use asyncHandler for error handling and pass the error to error handler middleware

export const getDoctors = asyncHandler(async (req: any, res: any) => {
  const doctors = await doctorModel.find();
  res.status(200).json({ success: true, count: doctors.length, data: doctors });
});


export const getDoctorById = asyncHandler(async (req: any, res: any) => {
  const doctor = await doctorModel.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  res.status(200).json({ success: true, data: doctor });
});


export const doctorLogin = asyncHandler(async (req: any, res: any) => {
  const doctor = await doctorModel.findOne({ email: req.body.email });
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  if (req.body.password !== doctor.password) {
    res.status(401);
    throw new Error("Invalid password");
  }
  res.status(200).json({ success: true, data: doctor });
});

export const createDoctor = asyncHandler(async (req: any, res: any) => {
  const doctor = new doctorModel(req.body);
  await doctor.save();
  res.status(201).json({ success: true, data: doctor });
});


export const updateDoctor = asyncHandler(async (req: any, res: any) => {
  const doctor = await doctorModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
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

// GET /api/doctors/:id/requests — get all requests for a doctor
export const getDoctorRequests = asyncHandler(async (req: any, res: any) => {
  const doctor = await doctorModel.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  res.status(200).json({ success: true, count: doctor.requests.length, data: doctor.requests });
});

// POST /api/doctors/:id/requests — caregiver sends a request to a doctor
export const addRequest = asyncHandler(async (req: any, res: any) => {
  const doctor = await doctorModel.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  await doctorModel.findByIdAndUpdate(req.params.id, {
    $push: { requests: req.body._id },
  });

  res.status(201).json({ success: true, data: req.body });
});

// PUT /api/doctors/:id/requests/:requestId — accept or decline a request
export const updateRequestStatus = asyncHandler(async (req: any, res: any) => {
  const { status } = req.body; // "accepted" or "declined"

  if(status === "accepted"){
    await doctorModel.findByIdAndUpdate(req.params.id, {
      $push: { patients: req.body._id },
      $pull: { requests: req.body._id },
    });
  }

  if(status === "declined"){
    await doctorModel.findByIdAndUpdate(req.params.id, {
      $pull: { requests: req.body._id },
    });
  }

  res.status(200).json({ success: true, data: req.body });
});
