import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ success: false, message: "No token Provided" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Token Invalid" })
        }

        const authUser = await User.findOne({ _id: decoded.id }).select("-password")
        req.user = authUser
        next()
    } catch (error) {
        console.error(`Error in protectedRoute Controller: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}