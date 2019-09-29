import { Router } from 'express';
import User from "./app/model/User";

const routes = new Router();

routes.get('/',  async (req, res) => {
  const user = await User.create({
    name: "Augusto Domenech",
    email:"augustodomenech@gmail.com",
    password_hash:"12346789",
  });
  
  return res.json(user);
  
});

export default routes;
