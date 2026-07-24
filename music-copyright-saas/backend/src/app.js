const Koa = require('koa');
const cors = require('@koa/cors');
const koaStatic = require('koa-static');
const { koaBody } = require('koa-body');
const path = require('path');

const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const { testConnection } = require('./db/sequelize');
const apiRouter = require('./routes/api/v1');
const adminRouter = require('./routes/api/v1/admin');

const app = new Koa();

app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
}));

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '../uploads/tmp'),
    keepExtensions: true,
    maxFileSize: config.upload.maxFileSize,
    onFileBegin: (name, file) => {
      const fs = require('fs');
      const tmpDir = path.join(__dirname, '../uploads/tmp');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    },
  },
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb',
}));

app.use(errorHandler());

app.use(koaStatic(path.join(__dirname, '../uploads'), {
  prefix: '/uploads',
}));

app.use(async (ctx, next) => {
  console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url}`);
  await next();
});

app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
app.use(adminRouter.routes()).use(adminRouter.allowedMethods());

app.use(async (ctx) => {
  if (ctx.path.startsWith('/api/')) {
    ctx.status = 404;
    ctx.body = {
      code: 404,
      message: '接口不存在',
      data: null,
    };
  }
});

const setupAssociations = () => {
  const models = require('./models');

  models.User.hasOne(models.CreatorAccount, { foreignKey: 'user_id', as: 'creator' });
  models.CreatorAccount.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });

  models.MusicLyricWork.belongsTo(models.MusicCategory, { foreignKey: 'category_id', as: 'category' });
  models.MusicLyricWork.belongsTo(models.CreatorAccount, { foreignKey: 'creator_id', as: 'creator' });
  models.MusicLyricWork.hasMany(models.WorkLicensePackage, { foreignKey: 'work_id', as: 'packages' });

  models.WorkLicensePackage.belongsTo(models.MusicLyricWork, { foreignKey: 'work_id', as: 'work' });

  models.MusicReleaseWork.belongsTo(models.CreatorAccount, { foreignKey: 'creator_id', as: 'creator' });

  models.Collection.belongsTo(models.MusicLyricWork, { foreignKey: 'work_id', as: 'work' });

  models.InquiryRecord.belongsTo(models.MusicLyricWork, { foreignKey: 'work_id', as: 'work' });

  models.Order.belongsTo(models.User, { foreignKey: 'buyer_id', as: 'buyer' });
  models.Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
  models.OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });

  models.CopyrightApply.belongsTo(models.MusicLyricWork, { foreignKey: 'work_id', as: 'work' });
  models.CopyrightApply.belongsTo(models.CreatorAccount, { foreignKey: 'creator_id', as: 'creator' });
  models.CopyrightApply.belongsTo(models.CopyrightCertificate, { foreignKey: 'certificate_id', as: 'certificate' });

  models.SettlementRecord.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
  models.SettlementRecord.belongsTo(models.CreatorAccount, { foreignKey: 'creator_id', as: 'creator' });

  models.WithdrawalApply.belongsTo(models.CreatorAccount, { foreignKey: 'creator_id', as: 'creator' });
  models.WithdrawalApply.belongsTo(models.User, { foreignKey: 'user_id', as: 'applicant' });

  models.AdminUser.belongsTo(models.AdminRole, { foreignKey: 'role_id', as: 'role' });
  models.AdminRole.belongsToMany(models.AdminPermission, {
    through: models.AdminRolePermission,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions',
  });
  models.AdminPermission.belongsToMany(models.AdminRole, {
    through: models.AdminRolePermission,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles',
  });
  models.AdminRolePermission.belongsTo(models.AdminPermission, { foreignKey: 'permission_id', as: 'permission' });
};

const startServer = async () => {
  try {
    setupAssociations();
    await testConnection();

    app.listen(config.port, () => {
      console.log(`\n========================================`);
      console.log(`  音乐版权SaaS系统 - 后端服务`);
      console.log(`  环境: ${config.nodeEnv}`);
      console.log(`  端口: ${config.port}`);
      console.log(`  地址: http://localhost:${config.port}`);
      console.log(`========================================\n`);
    });
  } catch (error) {
    console.error('服务启动失败:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
