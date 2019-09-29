import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(squelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_has: Sequelize.STRING,
        provaider: Sequelize.BOOLEAN,
      },
      {
        Sequelize,
      },
    );
  }
}

export default User;
