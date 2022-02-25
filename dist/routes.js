"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = require("fs");
const multer_1 = __importDefault(require("multer"));
const UserController_1 = __importDefault(require("./app/controllers/UserController"));
const SessionController_1 = __importDefault(require("./app/controllers/SessionController"));
const TaskController_1 = __importDefault(require("./app/controllers/TaskController"));
const auth_1 = __importDefault(require("./app/middlewares/auth"));
const uploadFiles_1 = __importDefault(require("./app/middlewares/uploadFiles"));
const routes = (0, express_1.Router)();
const upload = (0, multer_1.default)(uploadFiles_1.default);
routes.post('/user', upload.single('image_perfil'), UserController_1.default.save);
routes.post('/session', SessionController_1.default.verify);
routes.use(auth_1.default);
routes.get('/user', UserController_1.default.list);
routes.delete('/user/:id', UserController_1.default.delete);
routes.post('/task', TaskController_1.default.save);
routes.get('/task', TaskController_1.default.list);
routes.put('/task/:id', TaskController_1.default.update);
routes.delete('/task/:id', TaskController_1.default.delete);
routes.get('/logs', (req, res) => {
    const src = 'logs/logs.log';
    (0, fs_1.readFile)(src, (err, data) => {
        if (err)
            return res.status(500).json({ error: 'Error on our server. Try later', details: err });
        return res.set({ 'Content-Type': 'application/json' }).send(data);
    });
});
exports.default = routes;
