import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from "./app/controller/SessionControler";
import UserController from "./app/controller/UserController";

import authMiddleware from './app/middleware/auth'

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store)
routes.post('/users', UserController.store)

routes.use(authMiddleware);

routes.put('/update', UserController.update)

routes.put('/files', upload.single('file'), (req, res) => {
  return res.json({ok: true})
})
export default routes;
