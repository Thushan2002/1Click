import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signUp = async (req, res) => {
    try {
        const { username, email, profilePic, password } = req.body;

        // Validate required fields
        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required" });
        }
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }

        // Check for existing username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ success: false, message: "Username already exists" });
        }

        // Check for existing email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePic: profilePic || ""
        });

        await newUser.save();

        // Generate token
        generateToken(newUser._id, res);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic
            }
        });

    } catch (error) {
        console.error(`Error in Signup Controller: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "No User found" })
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched) {
            return res.status(401).json({ success: false, message: "Password Mismatched" })
        }
        generateToken(user._id, res)
        return res.status(201).json({
            success: true,
            message: "Login successfull",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic
            }
        });

    } catch (error) {
        console.error(`Error in Login Controller: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

export const authUser = async (req, res) => {
    try {
        const authUser = req.user
        return res.status(200).json({ success: true, authUser })
    } catch (error) {
        console.error(`Error in authUser Controller: ${error}`);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}
