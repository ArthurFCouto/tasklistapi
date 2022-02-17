import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import TaskController from './app/controllers/TaskController';
import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/user', UserController.save);
routes.post('/session', SessionController.verify);

routes.use(authMiddleware);

routes.get('/user', UserController.list);
routes.delete('/user/:id', UserController.delete);

routes.post('/task', TaskController.save);
routes.get('/task', TaskController.list);
routes.put('/task/:id', TaskController.update);
routes.delete('/task/:id', TaskController.delete);

export default routes;