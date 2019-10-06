import jwt from 'jsonwebtoken';

import User from '../model/User'

import authConfig from '../../config/auth';

class SessionControler {
  async store(req, res) {
    //Pegamos os valores de validação na requisição
    const { email, password } = req.body;

    //Buscamos o usuario no banco de dados
    const user = await User.findOne({where: {email}});

    //Verificamos se achamos um usuário com base no seu e-mail
    if (!(user)) {
      return res.status(401).json({error: 'User not found !'});
    };

    //Verificamos se a senha bate com a do usuário encontrado
    if ( !(await  user.checkPassword(password))) {
      return res.status(401).json({error: 'Password does not match !'});
    }; 

    // Pegamos algumas informações a mais para retornar na resposta
    const {id, name} = user;

    //Enviamos uma resposta com os dados do usuário e o seu token
    return res.json({
      user: {id, 
            name, 
            email,
      },
      token: jwt.sign({id}, 
                      authConfig.secret,
                      { 
                        expiresIn: authConfig.expiresIn 
                      })
                    })
  }; 
};

export default new SessionControler();