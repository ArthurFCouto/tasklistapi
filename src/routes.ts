import { Router } from 'express';
import LogsController from './app/controllers/LogsController';
import NotificationController from './app/controllers/NotificationController';
import SessionController from './app/controllers/SessionController';
import TaskController from './app/controllers/TaskController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import roleMiddleware from './app/middlewares/role';

const routes = Router();

//Rotas que não precisam de autorização
routes.post('/session', SessionController.verify);
routes.post('/user', UserController.save);

//Rotas que precisam de autorização
routes.get('/user/:id', authMiddleware, UserController.detail);
routes.post('/task', authMiddleware, TaskController.save);
routes.get('/task', authMiddleware, TaskController.list);
routes.put('/task/:id', authMiddleware, TaskController.update);
routes.delete('/task/:id', authMiddleware, TaskController.delete);
routes.get('/notification/realtime', authMiddleware, NotificationController.getRealTime);
routes.get('/notification', authMiddleware, NotificationController.list);
routes.put('/notification/:id', authMiddleware, NotificationController.update);
routes.delete('/notification/:id', authMiddleware, NotificationController.delete);

//Rotas que precisam de autorização, e perfil Admin
routes.get('/user', authMiddleware, roleMiddleware, UserController.list);
routes.delete('/user/:id', authMiddleware, roleMiddleware, UserController.delete);
routes.get('/task/all', authMiddleware, roleMiddleware, TaskController.listAll);
routes.get('/notification/full', authMiddleware, roleMiddleware, NotificationController.listFull);
routes.get('/logs', authMiddleware, roleMiddleware, LogsController.getLogs);

//Foi preciso inserir manualmente cada middleware devido a esta rota 404
routes.use((req, res, next) => res.status(404).json({ error: 'Desculpe, essa rota não existe.' }));

export default routes;