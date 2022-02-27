"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
class App {
    constructor() {
        this.server = (0, express_1.default)();
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.server.use((0, cors_1.default)());
        this.server.use('/public', express_1.default.static(path_1.default.resolve(__dirname, 'public'))); //Liberando o acesso através de uma rota get a pasta public
        this.server.use(express_1.default.json());
    }
    routes() {
        this.server.use(routes_1.default);
    }
}
exports.default = new App().server;
