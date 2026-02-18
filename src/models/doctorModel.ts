import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    specialization: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "request" }],
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "patient" }],
  },
  { timestamps: true }
);

const doctorModel = mongoose.model("doctor", doctorSchema);

export default doctorModel;
