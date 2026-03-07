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
    patientImage:    { type: String, default: "" },
    age:             { type: Number, required: true },
    about:           { type: String, default: "" },
    weight:          { type: Number, required: true },
    address:         { type: String, required: true },
    patientPhone:    { type: String, required: true },
    familyTree:      { 
      type: [
        {
          familyMemberName:       { type: String, required: true },
          relationshipToPatient : { type: String, required: true },
          familyMemberImage:      { type: String, default: "" },
        }
      ],
      default: [] 
    },
    doctors:         { type: [mongoose.Schema.Types.ObjectId], ref: "doctor", default: [] },

    // ─── Location ──────────────────────────────────────────────────────────────
    lastLocation: {
      lat:       { type: Number, default: null },
      lng:       { type: Number, default: null },
      city:      { type: String, default: null },
      country:   { type: String, default: null },
      updatedAt: { type: Date,   default: null },
    },

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
