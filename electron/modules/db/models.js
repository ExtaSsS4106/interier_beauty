const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const clients = sequelize.define('clients', {
    first_name:     { type: DataTypes.STRING, allowNull: false },
    last_name:     { type: DataTypes.STRING, allowNull: false },
    number: { type: DataTypes.STRING, allowNull: false },
    email:  { type: DataTypes.STRING, allowNull: false, unique: true },
  });

  const employees = sequelize.define('employees', {
    first_name:     { type: DataTypes.STRING, allowNull: false },
    last_name:     { type: DataTypes.STRING, allowNull: false },
    email:    { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false,defaultValue: 'user'},
  });

  const services = sequelize.define('services', {
    title:       { type: DataTypes.STRING, allowNull: false },
    price:       { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
  });

  const appointments = sequelize.define('appointments', {
    date:   { type: DataTypes.DATEONLY, allowNull: false },
    time:   { type: DataTypes.TIME, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'new' },
  });

  // Связи: внешние ключи (client_id, employee_id, service_id)
  // Sequelize создаст в appointments сам
  clients.hasMany(appointments, { foreignKey: 'client_id' });
  appointments.belongsTo(clients, { foreignKey: 'client_id' });

  employees.hasMany(appointments, { foreignKey: 'employee_id' });
  appointments.belongsTo(employees, { foreignKey: 'employee_id' });

  services.hasMany(appointments, { foreignKey: 'service_id' });
  appointments.belongsTo(services, { foreignKey: 'service_id' });

  return { clients, employees, services, appointments };
};