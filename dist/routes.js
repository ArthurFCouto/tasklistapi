"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("./app/controllers/UserController"));
const routes = (0, express_1.Router)();
routes.get('/user', UserController_1.default.list);
routes.post('/user', UserController_1.default.save);
exports.default = routes;
