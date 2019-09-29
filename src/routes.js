import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({
  message: 'Arquivos de configuração ficam na raiz do projeto',
}));

export default routes;
