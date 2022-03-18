"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = __importDefault(require("../../database/models/task"));
const logger_1 = __importDefault(require("../../logger"));
const notificationService_1 = __importDefault(require("../../service/notificationService"));
const task_model = (task) => {
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
    save(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { task, deadline } = req.body;
            if (!task || !deadline)
                return res.status(400).json({ error: 'Please check the submitted fields' });
            try {
                const tasks = yield task_1.default.findAll({
                    where: {
                        userId: req.userId
                    }
                });
                if (tasks.length >= 5)
                    return res.status(400).json({ error: 'Maximum registrations reached.' });
                const newTask = yield task_1.default.create({
                    userId: req.userId,
                    task: task,
                    deadline: deadline
                });
                notificationService_1.default.saveNotification("Inclusão realizada", `Atividade de ID ${newTask.id} incluída com sucesso.`, req.userId);
                return res.json(task_model(newTask));
            }
            catch (error) {
                logger_1.default.error(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { check } = req.query;
            try {
                const tasks = yield task_1.default.findAll({
                    where: {
                        userId: req.userId
                    }
                })
                    .then((list) => list.map((tasks) => {
                    return task_model(tasks);
                }).sort((x, y) => x.id == y.id ? 0 : x.id > y.id ? 1 : -1));
                if (check && tasks.length > 0) {
                    return res.json(tasks.filter((task) => {
                        if (String(task.check) == String(check))
                            return task;
                    }));
                }
                ;
                return res.json(tasks);
            }
            catch (error) {
                logger_1.default.error(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id)
                return res.status(400).json({ error: 'Please check the submitted fields' });
            try {
                const task = yield task_1.default.findOne({
                    where: {
                        id: id,
                        userId: req.userId
                    }
                });
                if (!task)
                    return res.status(404).json({ error: 'Task not found' });
                yield task.update({
                    check: true
                });
                notificationService_1.default.saveNotification("Tarefa finalizada", `Atividade de ID ${id} concluída com sucesso.`, req.userId);
                return res.json(task_model(task));
            }
            catch (error) {
                logger_1.default.error(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id)
                return res.status(400).json({ error: 'Please check the submitted fields' });
            try {
                const task = yield task_1.default.findOne({
                    where: {
                        id: id,
                        userId: req.userId
                    }
                });
                if (!task)
                    return res.status(404).json({ error: 'Task not found' });
                yield task.destroy();
                notificationService_1.default.saveNotification("Exclusão realizada", `Atividade de ID ${id} excluída com sucesso.`, req.userId);
                return res.status(200).json({});
            }
            catch (error) {
                logger_1.default.error(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        });
    }
}
exports.default = new TaskController();
