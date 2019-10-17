import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';


import SessionController from "./app/controller/SessionController";
import UserController from "./app/controller/UserController";
import FileController from "./app/controller/FileController";
import ProviderController from './app/controller/ProviderController';
import AppointmentController from './app/controller/AppointmentController';

import authMiddleware from './app/middleware/auth'

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store)
routes.post('/users', UserController.store)

routes.use(authMiddleware);

routes.put('/update', UserController.update)
routes.put('/files', upload.single('file'), FileController.store)

routes.get('/providers', ProviderController.index);

routes.get('/appointment', AppointmentController.index);
routes.post('/appointment', AppointmentController.store);

export default routes;
