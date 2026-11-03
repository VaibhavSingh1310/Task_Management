
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const { router } = require('./Router/taskRoute');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Security headers using Helmet
app.use(helmet());

// CORS middleware
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Rate limiting middleware
const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    message: "Exceeded limit of accessing the API. Please try again later.",
    standardHeaders: 'draft-8',
    legacyHeaders: false
});

app.use(limit);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Task Management API is running',
        tasksUrl: '/api/tasks'
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err.message);
    });

// Task routes
app.use('/api', router);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Tasks endpoint: http://localhost:${PORT}/api/tasks`);
});
