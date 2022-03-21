import { Router } from 'express';
import LogsController from './app/controllers/LogsController';
import NotificationController from './app/controllers/NotificationController';
import SessionController from './app/controllers/SessionController';
import TaskController from './app/controllers/TaskController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import roleMiddleware from './app/middlewares/role';

const routes = Router();

routes.post('/session', SessionController.verify);

routes.post('/user', UserController.save);
routes.get('/user/:id', authMiddleware, UserController.detail);
routes.get('/user', authMiddleware, roleMiddleware, UserController.list);
routes.delete('/user/:id', authMiddleware, roleMiddleware, UserController.delete);

routes.post('/task', authMiddleware, TaskController.save);
routes.get('/task', authMiddleware, TaskController.list);
routes.put('/task/:id', authMiddleware, TaskController.update);
routes.delete('/task/:id', authMiddleware, TaskController.delete);
//routes.get('/task/all', authMiddleware, roleMiddleware, TaskController.listAll);


routes.get('/notification/realtime', authMiddleware, NotificationController.getRealTime);
routes.get('/notification', authMiddleware, NotificationController.list);
routes.put('/notification/:id', authMiddleware, NotificationController.update);
routes.delete('/notification/:id', authMiddleware, NotificationController.delete);
routes.get('/notification/full', authMiddleware, roleMiddleware, NotificationController.listFull);

routes.get('/logs', authMiddleware, roleMiddleware, LogsController.getLogs);

routes.use((req, res, next)=> res.status(404).json({ error: 'Sorry, route not found' }));

export default routes;

//Futuros testes com a biblioteca multer
//import multer from 'multer';
//import uploadFiles from './app/middlewares/uploadFiles';
//const upload = multer(uploadFiles);
//routes.post('/user', upload.single('image_perfil'), UserController.save);