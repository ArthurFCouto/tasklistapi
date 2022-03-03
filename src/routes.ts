import { Router } from 'express';
//import multer from 'multer';
import LogsController from './app/controllers/LogsController';
import SessionController from './app/controllers/SessionController';
import TaskController from './app/controllers/TaskController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import uploadFiles from './app/middlewares/uploadFiles';

const routes = Router();
//const upload = multer(uploadFiles);

//routes.post('/user', upload.single('image_perfil'), UserController.save);
routes.post('/user', UserController.save);
routes.post('/session', SessionController.verify);

//routes.use(authMiddleware);

routes.get('/user', authMiddleware, UserController.list);
routes.get('/user/:id', authMiddleware, UserController.detail);
routes.delete('/user/:id', authMiddleware, UserController.delete);

routes.post('/task', authMiddleware, TaskController.save);
routes.get('/task', authMiddleware, TaskController.list);
routes.put('/task/:id', authMiddleware, TaskController.update);
routes.delete('/task/:id', authMiddleware, TaskController.delete);

routes.get('/logs', authMiddleware, LogsController.getLogs);

routes.use((req, res, next)=> res.status(404).json({ error: 'Sorry, route not found' }));

export default routes;