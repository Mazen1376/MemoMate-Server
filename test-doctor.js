import { io } from "socket.io-client";
import readline from "readline";

// Connect to your local server
const socket = io("http://localhost:5000");

// Get IDs from command line arguments or fall back to defaults
// Usage: node test-doctor.js <myDoctorId> <targetPatientId>
const myDoctorId = process.argv[2] || "69aa0a0275c71f8f7c348386";
const targetPatientId = process.argv[3] || "69adb67d024502b191971962";

console.log(`\n=================================`);
console.log(`DOCTOR SCRIPT`);
console.log(`My ID (Doctor): ${myDoctorId}`);
console.log(`Target Patient ID: ${targetPatientId}`);
console.log(`=================================\n`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

socket.on("connect", () => {
  console.log("✅ DOCTOR: Successfully connected! My socket ID is:", socket.id);

  // 1. Register as the doctor
  socket.emit("register", myDoctorId);

  console.log("Type a message and press Enter to send it to the patient.");
  rl.prompt();
});

rl.on("line", (line) => {
  const text = line.trim();
  if (text) {
    socket.emit("send_message", {
      doctorId: myDoctorId,
      patientId: targetPatientId,
      sender: "doctor",
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
    `\n📨 PATIENT (${messageData.patientId}) SAYS: ${messageData.text}`,
  );
  rl.prompt();
});

socket.on("user_typing", (data) => {
  // Optional typing indicator
});

socket.on("disconnect", () => {
  console.log("\n❌ DOCTOR: Disconnected from server.");
  process.exit(0);
});
