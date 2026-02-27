export const sanitizeDoctor = (doctor: any) => {
  const obj = doctor.toObject ? doctor.toObject() : { ...doctor };
  delete obj.password;
  return obj;
};

export const sanitizePatient = (patient: any) => {
  const obj = patient.toObject ? patient.toObject() : { ...patient };
  delete obj.password;
  return obj;
};
