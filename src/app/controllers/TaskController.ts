import { Response } from 'express';
import Task from '../../database/models/task';
import logger from '../../logger';

class TaskController {
    async save(req: any, res: Response) {
        const { task, deadline } = req.body;
        try {
            const newTask = await Task.create({
                userId: req.userId,
                task: task,
                deadline: deadline
            });
            return res.json(newTask);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async list(req: any, res: Response) {
        const { check } = req.query;
        try {
            const tasks = await Task.findAll({
                where: {
                    userId: req.userId
                }
            })
            .then((list: any) =>
                list.map((tasks: any) => {
                    const { id, task, check, deadline, createdAt, updatedAt, userId } = tasks;
                    return {
                        id,
                        task,
                        check,
                        deadline,
                        createdAt,
                        updatedAt,
                        userId
                    }
                })
            );
            if (check && tasks.length > 0) {
                return res.json(tasks.filter((task: any) => {
                    if (String(task.check) == String(check))
                        return task;
                }));
            }
            return res.json(tasks);
        } catch (error) {
            logger.error(error);
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
            logger.error(error);
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
            return res.status(200).json({});
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }
}

export default new TaskController();