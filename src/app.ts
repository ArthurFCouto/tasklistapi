require("dotenv").config();

import cors from 'cors';
import express from 'express';
import path from 'path';
import routes from './routes';

class App{

    server: any;

    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(cors());
        this.server.use('/public', express.static(path.resolve(__dirname, 'public'))); //Liberando o acesso através de uma rota get a pasta public
        this.server.use(express.json());
    }
    
    routes() {
        this.server.use(routes);
    }
}
export default new App().server;