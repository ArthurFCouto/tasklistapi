import { Router } from 'express';
import { readFile } from 'fs';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import TaskController from './app/controllers/TaskController';
import authMiddleware from './app/middlewares/auth';
import uploadFiles from './app/middlewares/uploadFiles';

const routes = Router();
const upload = multer(uploadFiles);

routes.post('/user', upload.single('image_perfil'), UserController.save);
routes.post('/session', SessionController.verify);

routes.use(authMiddleware);

routes.get('/user', UserController.list);
routes.delete('/user/:id', UserController.delete);

routes.post('/task', TaskController.save);
routes.get('/task', TaskController.list);
routes.put('/task/:id', TaskController.update);
routes.delete('/task/:id', TaskController.delete);

routes.get('/logs', (req, res) => {
    const src = 'logs/logs.log';
    readFile(src, (err, data) => {
        if (err)
            return res.status(500).json({ error: 'Error on our server. Try later', details: err });
        return res.set({ 'Content-Type': 'application/json' }).send(data);
    });
});

export default routes;