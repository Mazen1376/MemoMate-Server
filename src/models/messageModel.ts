import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "doctor" },
    patientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "patient" },
    sender: { type: String, required: true, enum: ["doctor", "patient"] },
    text: { type: String, required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
