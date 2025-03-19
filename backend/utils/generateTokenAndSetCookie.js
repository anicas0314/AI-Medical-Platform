import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, id, cookieName = "token") => {
    // Use the id parameter passed into the function
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token expires in 7 days
    });

    // Set the token as a cookie in the response
    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return token;
};
