"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//import multer from 'multer';
const LogsController_1 = __importDefault(require("./app/controllers/LogsController"));
const SessionController_1 = __importDefault(require("./app/controllers/SessionController"));
const TaskController_1 = __importDefault(require("./app/controllers/TaskController"));
const UserController_1 = __importDefault(require("./app/controllers/UserController"));
const auth_1 = __importDefault(require("./app/middlewares/auth"));
const routes = (0, express_1.Router)();
//const upload = multer(uploadFiles);
//routes.post('/user', upload.single('image_perfil'), UserController.save);
routes.post('/user', UserController_1.default.save);
routes.post('/session', SessionController_1.default.verify);
//routes.use(authMiddleware);
routes.get('/user', auth_1.default, UserController_1.default.list);
routes.get('/user/:id', auth_1.default, UserController_1.default.detail);
routes.delete('/user/:id', auth_1.default, UserController_1.default.delete);
routes.post('/task', auth_1.default, TaskController_1.default.save);
routes.get('/task', auth_1.default, TaskController_1.default.list);
routes.put('/task/:id', auth_1.default, TaskController_1.default.update);
routes.delete('/task/:id', auth_1.default, TaskController_1.default.delete);
routes.get('/logs', auth_1.default, LogsController_1.default.getLogs);
routes.use((req, res, next) => res.status(404).json({ error: 'Sorry, route not found' }));
exports.default = routes;
