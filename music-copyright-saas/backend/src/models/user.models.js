const { sequelize, DataTypes } = require('../db/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  nickname: DataTypes.STRING(64),
  avatar: DataTypes.STRING(255),
  phone: DataTypes.STRING(32),
  email: DataTypes.STRING(128),
  user_type: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '1-采购方 2-创作者 3-机构成员',
  },
  real_name: DataTypes.STRING(64),
  id_card: DataTypes.STRING(32),
  company_name: DataTypes.STRING(128),
  business_license: DataTypes.STRING(255),
  auth_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-未认证 1-审核中 2-已通过 3-已拒绝',
  },
  auth_reject_reason: DataTypes.STRING(255),
  balance: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  frozen_balance: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '0-禁用 1-正常',
  },
  last_login_time: DataTypes.DATE,
  last_login_ip: DataTypes.STRING(64),
}, {
  tableName: 'users',
});

const SaasTenant = sequelize.define('SaasTenant', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_code: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  tenant_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  logo_url: DataTypes.STRING(255),
  domain: DataTypes.STRING(128),
  contact_name: DataTypes.STRING(64),
  contact_phone: DataTypes.STRING(32),
  contact_email: DataTypes.STRING(128),
  revenue_share_ratio: DataTypes.DECIMAL(5, 2),
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  expire_time: DataTypes.DATE,
  remark: DataTypes.STRING(512),
}, {
  tableName: 'saas_tenant',
});

const CreatorAccount = sequelize.define('CreatorAccount', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  creator_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
    comment: '1-独立音乐人 2-唱片公司 3-音乐工作室 4-MCN机构',
  },
  creator_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  logo: DataTypes.STRING(255),
  description: DataTypes.TEXT,
  contact_name: DataTypes.STRING(64),
  contact_phone: DataTypes.STRING(32),
  contact_email: DataTypes.STRING(128),
  revenue_share_ratio: DataTypes.DECIMAL(5, 2),
  id_card_front: DataTypes.STRING(255),
  id_card_back: DataTypes.STRING(255),
  business_license: DataTypes.STRING(255),
  tax_number: DataTypes.STRING(64),
  bank_account_name: DataTypes.STRING(64),
  bank_account_number: DataTypes.STRING(64),
  bank_name: DataTypes.STRING(128),
  alipay_account: DataTypes.STRING(128),
  wechat_account: DataTypes.STRING(128),
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-待审核 1-已通过 2-已拒绝 3-已禁用',
  },
  reject_reason: DataTypes.STRING(255),
  verified_at: DataTypes.DATE,
  total_works: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_sales: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
}, {
  tableName: 'creator_accounts',
});

const CreatorSubAccount = sequelize.define('CreatorSubAccount', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  creator_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  role_name: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  permissions: {
    type: DataTypes.JSON,
    get() {
      const raw = this.getDataValue('permissions');
      return raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null;
    },
    set(val) {
      this.setDataValue('permissions', val ? JSON.stringify(val) : null);
    },
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
}, {
  tableName: 'creator_sub_account',
});

const MusicCategory = sequelize.define('MusicCategory', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  parent_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  name: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
}, {
  tableName: 'music_category',
});

module.exports = {
  User,
  SaasTenant,
  CreatorAccount,
  CreatorSubAccount,
  MusicCategory,
};
