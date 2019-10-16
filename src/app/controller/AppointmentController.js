import * as Yup from 'yup';

import User from '../model/User';
import Appointment from '../model/Appointments';

class AppointmentController {
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


    const appointment = await Appointment.create({
      user_id: req.idUser,
      provider_id,
      date,
    })


    res.json({appointment})
  }

}

export default new AppointmentController();