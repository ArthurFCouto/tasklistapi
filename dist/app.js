"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config(); //Ter acesso aos arquivos .env
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
        //Liberando o acesso através de uma rota get a pasta public
        this.server.use('/public', express_1.default.static(path_1.default.resolve(__dirname, 'public')));
        //Setando que as respostas serão do tipo Json
        this.server.use(express_1.default.json());
    }
    routes() {
        //Inserindo as rotas no server
        this.server.use(routes_1.default);
    }
}
exports.default = new App().server;
/*
//Configurando o cors
this.server.use((req: Request, res: Response, next: Function) => {
    //Qual site tem permissão de realizar a conexão
    res.header("Access-Control-Allow-Origin", "https://to-do-list-vercel.vercel.app");
    //Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    this.server.use(cors());
    next();
});
*/ 
