import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    // ─── Caregiver Info ────────────────────────────────────────────────────────
    caregiverName:         { type: String, required: true },
    email:                 { type: String, required: true },
    password:              { type: String, required: true },
    relationship:          { type: String, required: true },
    caregiverPhone:        { type: String, required: true },

    // ─── Patient Info ────────────────────────────────────────────────────────── DATA FOR AI
    patientName:     { type: String, required: true },
    age:             { type: Number, required: true },
    about:           { type: String, default: "" },
    weight:          { type: Number, required: true },
    address:         { type: String, required: true },
    patientPhone:    { type: String, required: true },

    // ─── Medical Info ──────────────────────────────────────────────────────────
    diseaseHistory: { type: [String], default: [] },
    memoryProblem:  { type: String, default: "" },
    allergies:      { type: [String], default: [] },

    // ─── Medicines ─────────────────────────────────────────────────────────────
    medicines: {
      type: [
        {
          name:  { type: String, required: true },
          dose:  { type: String, required: true },
          date:  { type: Date,   required: true },
          time:  { type: String, required: true },  // e.g. "08:00 AM"
          times: { type: Number, required: true },  // how many times per day
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const patientModel = mongoose.model("patient", patientSchema);

export default patientModel;
