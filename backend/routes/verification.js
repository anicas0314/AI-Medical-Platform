import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Define the GET route for email verification
router.get("/verify-email", async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required." });
        }

        const secretKey = process.env.JWT_SECRET;

        // Verify the token
        const decoded = jwt.verify(token, secretKey);

        console.log("Token verified:", decoded);

        // Example: Update user data to mark email as verified
        // await User.update({ isVerifiedEmail: true }, { where: { id: decoded.userId } });

        res.status(200).json({ success: true, message: "Email verified successfully!" });
    } catch (error) {
        console.error("Error verifying token:", error);
        
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ success: false, message: "Token has expired." });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ success: false, message: "Invalid token." });
        }

        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

export default router;
