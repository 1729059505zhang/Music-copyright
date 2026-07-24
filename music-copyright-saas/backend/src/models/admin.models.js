const { sequelize, DataTypes } = require('../db/sequelize');

const AdminUser = sequelize.define('AdminUser', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  username: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  real_name: DataTypes.STRING(64),
  avatar: DataTypes.STRING(255),
  phone: DataTypes.STRING(32),
  email: DataTypes.STRING(128),
  role_id: DataTypes.BIGINT.UNSIGNED,
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  last_login_time: DataTypes.DATE,
  last_login_ip: DataTypes.STRING(64),
  created_by: DataTypes.BIGINT.UNSIGNED,
}, {
  tableName: 'admin_user',
});

const AdminRole = sequelize.define('AdminRole', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  role_name: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  role_code: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  description: DataTypes.STRING(255),
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
}, {
  tableName: 'admin_role',
});

const AdminPermission = sequelize.define('AdminPermission', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  parent_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  permission_name: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  permission_code: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  permission_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
    comment: '1-菜单 2-按钮 3-接口',
  },
  path: DataTypes.STRING(255),
  icon: DataTypes.STRING(64),
  component: DataTypes.STRING(255),
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
}, {
  tableName: 'admin_permission',
});

const AdminRolePermission = sequelize.define('AdminRolePermission', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  role_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  permission_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
}, {
  tableName: 'admin_role_permission',
  updatedAt: false,
});

const SystemConfig = sequelize.define('SystemConfig', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  config_key: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
  },
  config_value: DataTypes.TEXT,
  config_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  config_group: {
    type: DataTypes.STRING(64),
    defaultValue: 'basic',
  },
  config_type: {
    type: DataTypes.STRING(32),
    defaultValue: 'string',
  },
  remark: DataTypes.STRING(512),
}, {
  tableName: 'system_config',
  createdAt: false,
});

const ThirdApiConfig = sequelize.define('ThirdApiConfig', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  api_type: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  api_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  api_provider: DataTypes.STRING(64),
  base_url: DataTypes.STRING(255),
  request_method: {
    type: DataTypes.STRING(16),
    defaultValue: 'POST',
  },
  app_key: DataTypes.STRING(128),
  app_secret: DataTypes.STRING(255),
  headers: {
    type: DataTypes.JSON,
    get() {
      const raw = this.getDataValue('headers');
      return raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null;
    },
    set(val) {
      this.setDataValue('headers', val ? JSON.stringify(val) : null);
    },
  },
  extra_params: {
    type: DataTypes.JSON,
    get() {
      const raw = this.getDataValue('extra_params');
      return raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null;
    },
    set(val) {
      this.setDataValue('extra_params', val ? JSON.stringify(val) : null);
    },
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  remark: DataTypes.STRING(512),
}, {
  tableName: 'third_api_config',
});

const OperationLog = sequelize.define('OperationLog', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  user_id: DataTypes.BIGINT.UNSIGNED,
  username: DataTypes.STRING(64),
  module: DataTypes.STRING(64),
  action: DataTypes.STRING(128),
  method: DataTypes.STRING(16),
  path: DataTypes.STRING(255),
  params: DataTypes.TEXT,
  result: DataTypes.TEXT,
  ip: DataTypes.STRING(64),
  user_agent: DataTypes.STRING(512),
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  error_msg: DataTypes.STRING(512),
  duration: DataTypes.INTEGER,
}, {
  tableName: 'operation_log',
  updatedAt: false,
});

module.exports = {
  AdminUser,
  AdminRole,
  AdminPermission,
  AdminRolePermission,
  SystemConfig,
  ThirdApiConfig,
  OperationLog,
};
