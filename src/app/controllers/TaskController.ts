import { Request, Response } from "express";
import Task from "../../database/models/task";

class TaskController {
    async save(req: any, res: Response) {
        const { task } = req.body;
        try {
            const newTask = await Task.create({
                userId: req.userId,
                task: task
            });
            return res.json(newTask);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async list(req: any, res: Response) {
        const { check } = req.query;
        try {
            const tasks = await Task.findAll({
                where: {
                    check: check ? check : false,
                    userId: req.userId
                }
            });
            return res.json(tasks);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async update(req: any, res: Response) {
        const { id } = req.params;
        try {
            const task = await Task.findOne({
                where: {
                    id: id,
                    userId: req.userId
                }
            });
            if (!task)
                return res.status(404).json({ error: 'Task not found' });
            await task.update({
                check: true
            });
            return res.json(task);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async delete(req: any, res: Response) {
        const { id } = req.params;
        try {
            const task = await Task.findOne({
                where: {
                    id: id,
                    userId: req.userId
                }
            });
            if (!task)
                return res.status(404).json({ error: 'Task not found' });
            await task.destroy();
            return res.json(task);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }
}

export default new TaskController();