const express = require('express');
const router = express.Router();
const Task = require('../model/task_schema');
const User = require('../model/userSchema');

// Get all tasks
const getTask = async (req, res) => {
    try {
        const page = parseInt(req.query.page,10) || 1;
        const limit = parseInt(req.query.limit,10) || 10;
        const santpage = page>1?page:1;
        const santLimit = limit<1?0:limit;
        skip = (santpage - 1)*santLimit;
        const{tasks,totalPages} = await Promise.all([
            Task.find().populate('user').sort({ createdAt: -1 }).skip(skip).limit(santLimit),
            Task.countDocuments()
        ]);
        totalPages = Math.ceil(totalPages/santLimit);
        return res.status(200).json({
            success:true,
            metadata:{
                totalTask:totalPages,
                totalPages,
                currentPage:page
            },
            data : tasks
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'Failed to retrieve tasks'
        });
    }
};

// Delete task by title
const deleteTask = async (req, res) => {
    try {
        const { title } = req.params;

        const taskToDelete = await Task.findOneAndDelete({ title });

        if (!taskToDelete) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        return res.status(200).json({
            message: 'Task deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete task'
        });
    }
};

// Update task by title
const updateTask = async (req, res) => {
    try {
        const { title } = req.params;
        const { description, status } = req.body;

        const existingTask = await Task.findOne({ title });

        if (!existingTask) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        if (
            status !== undefined &&
            !['pending', 'completed'].includes(status)
        ) {
            return res.status(400).json({
                message: 'Status must be either pending or completed'
            });
        }

        if (description !== undefined) {
            existingTask.description = description;
        }

        if (status !== undefined) {
            existingTask.status = status;
        }

        await existingTask.save();

        return res.status(200).json(existingTask);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to update task'
        });
    }
};

// Create a task for an existing or new user
router.post('/user', async (req, res) => {
    try {
        const { name, email, title, description } = req.body;

        if (!name || !email || !title || !description) {
            return res.status(400).json({
                message: 'Name, email, title and description are required'
            });
        }

        // Find user by email
        let existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        let userCreated = false;

        // Create user if not found
        if (!existingUser) {
            existingUser = await User.create({
                name: name.trim(),
                email: email.trim().toLowerCase()
            });

            userCreated = true;
        }

        // Create task and associate it with the user
        const newTask = await Task.create({
            title: title.trim(),
            description: description.trim(),
            user: existingUser._id
        });

        return res.status(201).json({
            message: userCreated
                ? 'New user and task created successfully'
                : 'Task added to existing user successfully',
            user: existingUser,
            task: newTask
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Failed to create user or task'
        });
    }
});

// Routes
router.get('/tasks', getTask);
router.delete('/tasks/:title', deleteTask);
router.put('/tasks/:title', updateTask);

module.exports = {
    router,
    getTask,
    deleteTask,
    updateTask
};