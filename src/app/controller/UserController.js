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

};

export default new UserController();