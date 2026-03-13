# MemoMate Server (memo-ts-2)

A robust backend REST API and real-time chat application designed to handle patient and doctor interactions seamlessly. Built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Authentication & Authorization**: Secure JWT-based authentication for both Doctors and Patients.
- **Role-based Profiles**: Distinct models and data flows for `Patient` and `Doctor` users.
- **Real-time Messaging**: Socket.io integration for instant, secure chat between patients and doctors.
- **Doctor-Patient Network**: Send requests to doctors, accept/decline workflows, and manage assigned primary physicians.
- **Location Tracking**: Endpoints to capture and save the patient's last known location.
- **Patient Context Management**: Track patient's family tree, history, and records.

## Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB & Mongoose
- **Real-time Communication:** Socket.io
- **Security:** bcryptjs (password hashing), jsonwebtoken (JWT Auth)

## Project Structure

```bash
memo-ts-2/
├── src/
│   ├── index.ts           # Main application entry point and server startup
│   ├── controllers/       # Route request handlers (Doctor, Patient, Messages)
│   ├── routes/            # Express route definitions
│   ├── models/            # Mongoose schemas (Doctor, Patient, Message)
│   ├── middlewares/       # Custom middlewares (Auth logic, Error handling)
│   ├── lib/               # Shared logic (Database config, Socket.io initialization)
│   ├── helpers/           # Reusable helper functions
│   └── utils/             # Utility classes and tools
├── dist/                  # Compiled JavaScript output (generated)
├── package.json           # Dependencies and NPM scripts
└── tsconfig.json          # TypeScript configuration
```

## Setup Instructions

1. **Clone the repository and install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory and configure the following environment variables:

   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   ```

3. **Running the Application (Development):**

   ```bash
   npm run dev
   ```

   This will start the server using `nodemon` and `tsx` for hot-reloading TypeScript changes.

4. **Building for Production:**
   ```bash
   npm run build
   npm run start
   ```

## API Overview

- **Auth Routes**: Handle the registration and login of both Patients and Doctors.
- **Patient Routes**: Retrieve patient information, update records, and retrieve location info.
- **Doctor Routes**: Accept/decline patient requests, manage assigned patients.
- **Message Routes**: Access historical messages to feed the Socket.io real-time chat.
- **Socket Events**: Connect via JWT token authentication to securely send and receive instant messages.

## Scripts Context

A few scripts are provided in the root directory for quick ad-hoc testing:

- `test-doctor.js` - Tests the API routes/sockets from a doctor's perspective.
- `test-patient.js` - Tests the API routes/sockets from a patient's perspective.
