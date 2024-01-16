import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('bookLend', 'postgres', 'Qwert@123', {
  host: 'localhost',
  dialect: 'postgres',
});

export default sequelize;
