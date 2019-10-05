import { Router } from 'express';

import SessionController from "./app/controller/SessionControler";
import UserController from "./app/controller/UserController";


const routes = new Router();

routes.post('/session', SessionController.store)
routes.post('/users', UserController.store)

export default routes;
