import { Router } from 'express';

import SessionController from "./app/controller/SessionControler";
import UserController from "./app/controller/UserController";

import authMiddleware from './app/middleware/auth'

const routes = new Router();

routes.post('/session', SessionController.store)
routes.post('/users', UserController.store)

routes.use(authMiddleware);

routes.put('/update', UserController.update)


export default routes;
