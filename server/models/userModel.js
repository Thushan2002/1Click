import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: ""
    },
    usermode: {
        type: String,
        enum: ["student", "teacher"],
        default: "student"
    },
    appMode: {
        type: String,
        enum: ["normal", "class"],
        default: "normal"
    }
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User;