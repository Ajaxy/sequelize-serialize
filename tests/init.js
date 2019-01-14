const Sequelize = require('sequelize');
const serialize = require('../lib/index');

const sequelize = new Sequelize({
  dialect: 'sqlite',
});

const VARIOUS_FIELDS = {
  a: Sequelize.DataTypes.STRING,
  b: Sequelize.DataTypes.INTEGER,
  c: Sequelize.DataTypes.BOOLEAN,
};

const DUMMY_VALUES = {
  a: 'x',
  b: 777,
  c: true,
};

function createModel() {
  class TestModel extends Sequelize.Model {
  }

  TestModel.init(VARIOUS_FIELDS, { sequelize });

  return TestModel;
}

module.exports = {
  createModel,
  DUMMY_VALUES,
};
