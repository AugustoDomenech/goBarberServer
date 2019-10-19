import User from '../model/User';

import { startOfDay, endOfDay, parseISO } from 'date-fns';

import Appointment from '../model/Appointments';

import {Op} from 'sequelize';

class ScheduleController {
  async index(req, res) {

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

    const { date } = req.query;
    
    const parseDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.idUser,
        canceled_at: null,
        date:{
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },        
      },
      order:['date']
    });

    res.json(appointments);
  };




// ****************************************************************************
};

export default new ScheduleController();