import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'
import { pt } from 'date-fns/locale/pt'
import User from '../model/User';
import Appointment from '../model/Appointments';
import File from '../model/File';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
  
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {user_id: req.idUser, canceled_at: null},
      order:['date'],
      attributes:['id', 'date'],
      limit: 20,
      offSet: (page - 1) * 20,
      include: [
        {model: User,
        as: 'provider',
        attributes:['id', 'name'],
        include:[{
          model: File,
          as: 'avatar',
          attributes:['id','path','url']
        }]
      },  
      ]
    })

    res.json(appointments);

  };
  
  async store(req, res) {
    
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    })
    
    if (!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails'});
    };
    
    const {provider_id, date} = req.body;

    const isProvaider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!(isProvaider)) {
      return res.status(401).json({error: 'You can only create appointment with providers'})
    }

    //Validamos se a data é maior que a data atual
    const startHour = startOfHour(parseISO(date));

    if (isBefore(startHour, new Date())) {
      res.status(400).json({error: 'Past date are not permitted'})
    }

    //Verificamos se já existe um agendamento no banco com o mesmo provider e data

    const checkIsAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: startHour
      }
    })


    if (checkIsAvailability) {
      res.status(400).json({error: 'Appointment date is not available'})
    };

    const appointment = await Appointment.create({
      user_id: req.idUser,
      provider_id,
      date: startHour,
    });

    const user = await User.findByPk(req.idUser);

    const formattedDate = format(
      startHour,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {locale: pt}
      );


    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: req.idUser,      
    })


    res.json({appointment})
  };

  async delete(req, res) {
  


    const appointment = await Appointment.findByPk(req.params.id);

    if (req.idUser !== appointment.user_id){
      return res.status(401).json({error: "You don't have a permission.",})
    };

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date() )){
      return res.status(401).json({error: 'You only can cancel a appointment only 2 hours before.'});
    };

    appointment.canceled_at = new Date();
    await appointment.save();

    return res.json(appointment)
  };


}

export default new AppointmentController();