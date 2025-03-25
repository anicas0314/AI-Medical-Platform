import { Prescription } from "../models/prescription.model.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { User } from "../models/user.model.js"; // Ensure you import the User model

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Prescription
export const uploadPrescription = async (req, res) => {
    try {
        const { fileUrl, fileName, email } = req.body;

        // Validate input
        if (!fileUrl || !fileName || !email) {
            return res
                .status(400)
                .json({ error: "Missing fileUrl, fileName, or email" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create a new prescription linked to the found user
        const newPrescription = await Prescription.create({
            userId: user._id, // Assign the correct user ID
            fileName,
            fileUrl,
        });

        res.status(201).json({
            success: true,
            message: "Prescription uploaded successfully",
            prescription: newPrescription,
        });
    } catch (error) {
        console.error("Error uploading prescription:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Get Prescriptions for Logged-in User
export const getPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ userId: req.userId });

        if (!prescriptions.length) {
            return res.status(200).json({
                success: true,
                prescriptions: [],
                message: "No prescriptions uploaded yet.",
            });
        }

        return res.status(200).json(prescriptions);
    } catch (error) {
        console.error("Error fetching prescriptions:", error);
        return res
            .status(500)
            .json({ success: false, message: "Server error." });
    }
};
