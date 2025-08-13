// server.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRouter from './routes/authRoute.js';

// Load env variables (only in development)
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Create express app
const app = express();

// Middleware: Parse JSON
app.use(express.json({ limit: '10mb' }));

// Middleware: CORS (restrict to specific frontend origin)
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Middleware: Cookies
app.use(cookieParser());

// Security Middleware
app.use(helmet());



// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
    message: 'Too many requests, please try again later.'
});
app.use(limiter);

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Test Route
app.get('/api/status', (req, res) => {
    return res.status(200).json({ success: true, message: 'Server is Live' });
});

// app routes
app.use("/api/auth", authRouter)

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// mongoDB connection

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on PORT:${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => process.exit(0));
});
