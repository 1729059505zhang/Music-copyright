const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
      dateStrings: true,
      typeCast: true,
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true,
    },
    pool: {
      max: 50,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    logging: config.nodeEnv === 'development' ? console.log : false,
    timezone: '+08:00',
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('[Database] 数据库连接成功');
  } catch (error) {
    console.error('[Database] 数据库连接失败:', error.message);
  }
};

module.exports = { sequelize, DataTypes, testConnection };
