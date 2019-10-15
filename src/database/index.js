import Sequelize from "sequelize";

import databaseConfig from "../config/database"

import User from "../app/model/User";
import File from "../app/model/File"
import Appointments from "../app/model/Appointments"

const models = [User, File, Appointments];

class Database {
  constructor(){
    
    this.init();
  }

  init(){
    this.connection = new Sequelize(databaseConfig);

    models
    .map(model => model.init(this.connection))
    .map(model => model.associate && model.associate(this.connection.models) );

  }
}

export default new Database();