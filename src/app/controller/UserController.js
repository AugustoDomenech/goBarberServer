import User from '../model/User'

import * as Yup from 'yup';


class UserController{
  async store(req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails'});
    };


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
      
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field
                ),
      confirmePassword: Yup.string()
                           .when('password', (password, field) =>
                           password ? field.required().oneOf([Yup.ref('password')]) : field
                           )

    });

    if (!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails'});
    };

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