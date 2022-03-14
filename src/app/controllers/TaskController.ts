import { Response } from 'express';
import Task from '../../database/models/task';
import logger from '../../logger';

type Task = {
    id: number;
    task: string;
    deadline: string;
    check: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
};

const task_model = (task: Task) => {
    return {
        id: task.id,
        task: task.task,
        deadline: task.deadline,
        check: task.check,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        userId: task.userId
    };
};

class TaskController {
    async save(req: any, res: Response) {
        const { task, deadline } = req.body;
        if (!task || !deadline)
            return res.status(400).json({ error: 'Please check the submitted fields' });
        try {
            const tasks = await Task.findAll({
                where: {
                    userId: req.userId
                }
            });
            if (tasks.length >= 5)
                return res.status(400).json({ error: 'Maximum registrations reached.' });
            const newTask = await Task.create({
                userId: req.userId,
                task: task,
                deadline: deadline
            });
            return res.json(task_model(newTask));
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
                    list.map((tasks: Task) => {
                        return task_model(tasks);
                    }).sort((x: Task, y: Task) => x.id == y.id ? 0 : x.id > y.id ? 1 : -1)
                );
            if (check && tasks.length > 0) {
                return res.json(tasks.filter((task: Task) => {
                    if (String(task.check) == String(check))
                        return task;
                }));
            };
            return res.json(tasks);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async update(req: any, res: Response) {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: 'Please check the submitted fields' });
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
            return res.json(task_model(task));
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Error on our server. Try later' });
        }
    }

    async delete(req: any, res: Response) {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ error: 'Please check the submitted fields' });
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