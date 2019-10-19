import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns'
import User from '../model/User';
import Appointment from '../model/Appointments';
import File from '../model/File';

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
    })


    res.json({appointment})
  }

}

export default new AppointmentController();