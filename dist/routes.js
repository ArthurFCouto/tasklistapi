"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LogsController_1 = __importDefault(require("./app/controllers/LogsController"));
const NotificationController_1 = __importDefault(require("./app/controllers/NotificationController"));
const SessionController_1 = __importDefault(require("./app/controllers/SessionController"));
const TaskController_1 = __importDefault(require("./app/controllers/TaskController"));
const UserController_1 = __importDefault(require("./app/controllers/UserController"));
const auth_1 = __importDefault(require("./app/middlewares/auth"));
const role_1 = __importDefault(require("./app/middlewares/role"));
const routes = (0, express_1.Router)();
//Rotas que não precisam de autorização
routes.post('/session', SessionController_1.default.verify);
routes.post('/user', UserController_1.default.save);
//Rotas que precisam de autorização
routes.get('/user/:id', auth_1.default, UserController_1.default.detail);
routes.post('/task', auth_1.default, TaskController_1.default.save);
routes.get('/task', auth_1.default, TaskController_1.default.list);
routes.put('/task/:id', auth_1.default, TaskController_1.default.update);
routes.delete('/task/:id', auth_1.default, TaskController_1.default.delete);
routes.get('/notification/realtime', auth_1.default, NotificationController_1.default.getRealTime);
routes.get('/notification', auth_1.default, NotificationController_1.default.list);
routes.put('/notification/:id', auth_1.default, NotificationController_1.default.update);
routes.delete('/notification/:id', auth_1.default, NotificationController_1.default.delete);
//Rotas que precisam de autorização, e perfil Admin
routes.get('/user', auth_1.default, role_1.default, UserController_1.default.list);
routes.delete('/user/:id', auth_1.default, role_1.default, UserController_1.default.delete);
routes.get('/task/all', auth_1.default, role_1.default, TaskController_1.default.listAll);
routes.get('/notification/full', auth_1.default, role_1.default, NotificationController_1.default.listFull);
routes.get('/logs', auth_1.default, role_1.default, LogsController_1.default.getLogs);
//Foi preciso inserir manualmente cada middleware devido a esta rota 404
routes.use((req, res, next) => res.status(404).json({ error: 'Desculpe, essa rota não existe.' }));
exports.default = routes;
