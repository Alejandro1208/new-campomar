const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la instancia de Sequelize

const Product = sequelize.define('Product', {
id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
},
name: {
  type: DataTypes.STRING(255),
  allowNull: false
},
description: {
  type: DataTypes.TEXT
},
price: {
  type: DataTypes.DECIMAL(10, 2),
  allowNull: false
},
imageUrl: {
  type: DataTypes.STRING(255)
},
createdAt: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
}
}, {
tableName: 'products', // Especifica el nombre de la tabla
timestamps: false // Desactiva las marcas de tiempo automáticas
});

module.exports = Product;