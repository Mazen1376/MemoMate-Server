import { io } from "socket.io-client";
import readline from "readline";

// Connect to your local server
const socket = io("http://localhost:5000");

// Get IDs from command line arguments or fall back to defaults
// Usage: node test-patient.js <myPatientId> <targetDoctorId>
const myPatientId = process.argv[2] || "69adb67d024502b191971962";
const targetDoctorId = process.argv[3] || "69aa0a0275c71f8f7c348386";

console.log(`\n=================================`);
console.log(`PATIENT SCRIPT`);
console.log(`My ID (Patient): ${myPatientId}`);
console.log(`Target Doctor ID: ${targetDoctorId}`);
console.log(`=================================\n`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

socket.on("connect", () => {
  console.log(
    "✅ PATIENT: Successfully connected! My socket ID is:",
    socket.id,
  );

  // 1. Register as the patient
  socket.emit("register", myPatientId);

  console.log("Type a message and press Enter to send it to the doctor.");
  rl.prompt();
});

rl.on("line", (line) => {
  const text = line.trim();
  if (text) {
    socket.emit("send_message", {
      doctorId: targetDoctorId,
      patientId: myPatientId,
      sender: "patient",
      text: text,
    });
  }
  rl.prompt();
});

// 2. Listen for incoming messages
socket.on("receive_message", (messageData) => {
  // Clear the current line
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);

  console.log(
    `\n📨 DOCTOR (${messageData.doctorId}) SAYS: ${messageData.text}`,
  );
  rl.prompt();
});

socket.on("user_typing", (data) => {
  // Optional typing indicator
});

socket.on("disconnect", () => {
  console.log("\n❌ PATIENT: Disconnected from server.");
  process.exit(0);
});
