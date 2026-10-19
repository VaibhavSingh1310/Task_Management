const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {getTask, deleteTask, updateTask, createTask} = require('./Router/taskRoute');
dotenv.config();
const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URI )
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