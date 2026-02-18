import { asyncHandler } from "../utils/asyncHandler.js";
import doctorModel from "../models/doctorModel.js";

//instead of try and catch fot every controller use asyncHandler for error handling and pass the error to error handler middleware

export const createDoctor = asyncHandler(async (req: any, res: any) => {
  const doctor = new doctorModel(req.body);
  await doctor.save();
  res.status(201).json({ success: true, data: doctor });
});


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
