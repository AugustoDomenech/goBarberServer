import User from '../model/User'

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

    const {id, name} = user;

    return res.json({
      user: {id, 
            name, 
            email,
      }
    })
  }; 
};

export default new SessionControler();