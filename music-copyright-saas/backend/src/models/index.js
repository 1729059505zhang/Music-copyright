const userModels = require('./user.models');
const workModels = require('./work.models');
const orderModels = require('./order.models');
const copyrightModels = require('./copyright.models');
const adminModels = require('./admin.models');

const models = {
  ...userModels,
  ...workModels,
  ...orderModels,
  ...copyrightModels,
  ...adminModels,
};

module.exports = models;
