# MemoMate Server

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success.svg)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black.svg)](https://socket.io/)

> A robust backend REST API and real-time chat application designed to handle patient and doctor interactions seamlessly.

## 🌟 Key Features

- 🔐 **Authentication & Authorization**: Secure JWT-based authentication for both Doctors and Patients.
- 👥 **Role-based Profiles**: Distinct models and data flows for `Patient` and `Doctor` users.
- 💬 **Real-time Messaging**: Socket.io integration for instant, secure chat between patients and doctors.
- 🤝 **Doctor-Patient Network**: Send requests to doctors, accept/decline workflows, and manage assigned primary physicians.
- 📍 **Location Tracking**: Endpoints to capture and save the patient's last known location.
- 👨‍👩‍👧‍👦 **Patient Context Management**: Track patient's family tree, history, and medical records.

## 💻 Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Real-time Communication:** [Socket.io](https://socket.io/)
- **Security:** `bcryptjs` (password hashing), `jsonwebtoken` (JWT Auth)

## 📁 Project Structure

```text
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

## 🚀 Setup Instructions

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory and configure the following environment variables:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
```

### 3. Development Server

Run the application in development mode using `nodemon` and `tsx` for hot-reloading:

```bash
npm run dev
```

### 4. Production Build

Build the TypeScript files to JavaScript and start the production server:

```bash
npm run build
npm run start
```

## 🌐 API Overview

- **Auth Routes**: Handle the registration and login of both Patients and Doctors.
- **Patient Routes**: Retrieve patient information, update records, and retrieve location info.
- **Doctor Routes**: Accept/decline patient requests, manage assigned patients.
- **Message Routes**: Access historical messages to feed the Socket.io real-time chat.
- **Socket Events**: Connect via JWT token authentication to securely send and receive instant messages.
