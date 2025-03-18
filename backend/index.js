import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./database/connectdb.js"; // Import connectDB

import authRoutes from "./routes/auth.js"; // Import authRoutes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Call connectDB to establish a database connection



app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
