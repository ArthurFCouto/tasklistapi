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
class TaskController {
    save(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { task } = req.body;
            try {
                const newTask = yield task_1.default.create({
                    userId: req.userId,
                    task: task
                });
                return res.json(newTask);
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
                        check: check ? check : false,
                        userId: req.userId
                    }
                });
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
                return res.json(task);
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
                return res.json(task);
            }
            catch (error) {
                logger_1.default.error(error);
                return res.status(500).json({ error: 'Error on our server. Try later' });
            }
        });
    }
}
exports.default = new TaskController();
