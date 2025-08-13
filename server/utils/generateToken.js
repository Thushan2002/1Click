import jwt from 'jsonwebtoken'

const generateToken = (userId, res) => {
    try {
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    } catch (error) {
        console.log("Error in generateToken", error.message);
    }
}

export default generateToken;