import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./database/connectdb.js";
import authRoutes from "./routes/auth.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to database
connectDB();

// Use routes
app.use("/api/auth", authRoutes);

app.use(cookieParser());

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
