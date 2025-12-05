const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// GET /tasks - Get all tasks with optional filtering
router.get('/', async (req, res) => {
    try {
        const { status, priority, search } = req.query;
        const where = {};

        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } }
            ];
        }

        const tasks = await prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST /tasks - Create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'todo',
                priority: priority || 'medium',
                dueDate: dueDate ? new Date(dueDate) : null
            }
        });
        res.status(201).json(task);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PUT /tasks/:id - Update a task
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;
        const task = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null
            }
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE /tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
