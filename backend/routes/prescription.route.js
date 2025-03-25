import express from "express";
import {
    uploadPrescription,
    getPrescriptions,
} from "../controllers/prescription.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Routes
router.post("/upload", verifyToken, uploadPrescription);
router.get("/", verifyToken, getPrescriptions);

export default router;
