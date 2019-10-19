import User from '../model/User';
import Notification from '../schemas/Notification';

class NotificationController {
    async index(req, res){

    //Consultamos para verificar se o usuario é um provider
    const checkUserProvider = await User.findOne({
      where: {
        id: req.idUser,
        provider: true
      }
    });

    // Tratamos caso o usúario não seja um provider
    if (!(checkUserProvider)){
      return res.status(401).json({error: 'User is not a provider.'})
    };      

    const notifications = await Notification.find({
      user: req.idUser,
    }).sort({createAt:'desc'}).limit(20);

    return res.json(notifications);
    }
}

export default new NotificationController();