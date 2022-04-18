require("dotenv").config(); //Ter acesso aos arquivos .env

import cors from 'cors';
import express from 'express';
import path from 'path';
import routes from './routes';

class App{

    public server: any;

    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(cors());
        //Liberando o acesso através de uma rota get a pasta public
        this.server.use('/public', express.static(path.resolve(__dirname, 'public')));
        //Setando que as respostas serão do tipo Json
        this.server.use(express.json());
    }
    
    routes() {
        //Inserindo as rotas no server
        this.server.use(routes);
    }
}
export default new App().server;

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