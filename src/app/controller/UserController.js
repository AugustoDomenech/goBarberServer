import User from '../model/User'


class UserController{
  async store(req, res) {
    const UsertExist = await User.findOne({where: { email : req.body.email }})
    
    if (UsertExist) {
      return res.status(400).json({error: "Usuario já existente"})
    }  



    const {name, email, provider} = await User.create(req.body);

    return res.json({
      name, 
      email, 
      provider
    })
  };

  //Metado de alteração de dados do ususários
  async update(req, res) {
      
    //Pegamos o email e a senha antiga do corpo da requisição
    const {email, oldPassword} = req.body;
    
    //Procuramos o usuário no banco 
    const user = await User.findByPk(req.idUser);

    //Vericamos se o novo email já existe cadastrado no banco
    if (email !== user.email){
      const UsertExist = await User.findOne({where: { email }});
    
      if (UsertExist) {
        return res.status(400).json({error: "User already exists."})
      };  
    };

    //Verificamos se a senha bate com a senha atual
    if ( oldPassword && !(await user.checkPassword(oldPassword)) ) {
      return res.status(401).json({error: 'Password does not match '})
    };

    //Realizamos o update
    const {name, password, provider} = await user.update(req.body);

    //Retornamos o usuário
    return res.json({
      name, 
      email, 
      password,
      provider
    })
  };


};
export default new UserController();