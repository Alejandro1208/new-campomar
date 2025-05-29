const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la instancia de Sequelize

const User = sequelize.define('User', {
id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
},
username: {
  type: DataTypes.STRING(50),
  unique: true,
  allowNull: false
},
password: {
  type: DataTypes.STRING(255),
  allowNull: false
},
email: {
  type: DataTypes.STRING(100),
  unique: true,
  allowNull: false
},
createdAt: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
}
}, {
tableName: 'users', // Especifica el nombre de la tabla
timestamps: false // Desactiva las marcas de tiempo automáticas
});

module.exports = User;