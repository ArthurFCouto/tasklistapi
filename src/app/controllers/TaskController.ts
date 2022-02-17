import { Request, Response } from "express";
import Task from "../../database/models/task";

class TaskController {
    async save(req: Request, res: Response) {
        const { task } = req.body;
        try {
            const newTask = await Task.create({
                user_id: req.params.userId,
                task: task
            });
            return res.json(newTask);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async list(req: Request, res: Response) {
        const { check } = req.query;
        const tasks = await Task.findAll({
            where: {
                check: check ? check : false,
                user_id: req.params.userId
            }
        });
        return res.json(tasks);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const task = await Task.findOne({
                where: {
                    id: id,
                    user_id: req.params.userId
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

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const task = await Task.findOne({
                where: {
                    id: id,
                    user_id: req.params.userId
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