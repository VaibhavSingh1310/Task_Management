const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { router } = require('./Router/taskRoute');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();
// Rate limiting middleware-> we use limit to limit the number of requests from a single IP address within a specified time window. 
// This helps prevent abuse and ensures fair usage of the API.
const limit = rateLimit({
    windowMs : 15 * 60 * 1000, // 15 minutes
    limit : 10,
    message : "Exceeded limit of accessing the API. Please try again later.",
    standardHeader : 'draft-8',
    legacyHeaders : false
})

app.use(cors());
app.use(express.json());
app.use(limit);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err.message);
    });

app.use('/api', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});