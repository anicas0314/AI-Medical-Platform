import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, id) => {
    // Use the id parameter passed into the function
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // Set the token as a cookie in the response
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // Fixed typo: should be "sameSite" (not "samesite")
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return token;
};
