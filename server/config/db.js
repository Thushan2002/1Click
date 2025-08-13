import mongoose from "mongoose";

// connect with mongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected");
    } catch (error) {
        console.log("Error in MongoDB connection:", error.message);
    }
}

export default connectDB;