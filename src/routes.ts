import { Router, Request, Response } from 'express';
import UserController from './app/controllers/UserController';
const routes = Router();

routes.get('/user', UserController.list);
routes.post('/user', UserController.save);

export default routes;