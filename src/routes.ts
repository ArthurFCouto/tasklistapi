import { Router } from 'express';
//import multer from 'multer';
import LogsController from './app/controllers/LogsController';
import NotificationController from './app/controllers/NotificationController';
import SessionController from './app/controllers/SessionController';
import TaskController from './app/controllers/TaskController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import roleMiddleware from './app/middlewares/role';
import uploadFiles from './app/middlewares/uploadFiles';

const routes = Router();
//const upload = multer(uploadFiles);

//routes.post('/user', upload.single('image_perfil'), UserController.save);
routes.post('/user', UserController.save);
routes.post('/session', SessionController.verify);

//routes.use(authMiddleware);

routes.get('/user', authMiddleware, roleMiddleware, UserController.list);
routes.get('/user/:id', authMiddleware, UserController.detail);
routes.delete('/user/:id', authMiddleware, roleMiddleware, UserController.delete);

routes.post('/task', authMiddleware, TaskController.save);
routes.get('/task', authMiddleware, TaskController.list);
routes.put('/task/:id', authMiddleware, TaskController.update);
routes.delete('/task/:id', authMiddleware, TaskController.delete);

routes.get('/notification/realtime', authMiddleware, NotificationController.getLast);
//routes.get('/notification/realtime/:userId', NotificationController.getLast);
routes.get('/notification', authMiddleware, NotificationController.list);
routes.get('/notification/all', authMiddleware, roleMiddleware, NotificationController.getAll);
routes.put('/notification/:id', authMiddleware, NotificationController.update);
routes.delete('/notification/:id', authMiddleware, NotificationController.delete);

routes.get('/logs', authMiddleware, roleMiddleware, LogsController.getLogs);

routes.use((req, res, next)=> res.status(404).json({ error: 'Sorry, route not found' }));

export default routes;