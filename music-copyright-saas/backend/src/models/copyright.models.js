const { sequelize, DataTypes } = require('../db/sequelize');

const CopyrightApply = sequelize.define('CopyrightApply', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  work_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  creator_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  work_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
    comment: '1-词曲作品 2-发行作品',
  },
  work_title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  author_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  author_id_type: DataTypes.TINYINT,
  author_id_number: DataTypes.STRING(64),
  creation_date: DataTypes.DATEONLY,
  first_publish_date: DataTypes.DATEONLY,
  copyright_owner: DataTypes.STRING(128),
  owner_type: DataTypes.TINYINT,
  work_sample_url: DataTypes.STRING(255),
  id_card_front: DataTypes.STRING(255),
  id_card_back: DataTypes.STRING(255),
  business_license: DataTypes.STRING(255),
  power_of_attorney: DataTypes.STRING(255),
  other_materials: {
    type: DataTypes.JSON,
    get() {
      const raw = this.getDataValue('other_materials');
      return raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : [];
    },
    set(val) {
      this.setDataValue('other_materials', val ? JSON.stringify(val) : null);
    },
  },
  apply_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-待提交 1-审核中 2-已通过 3-已拒绝',
  },
  reject_reason: DataTypes.STRING(512),
  audit_user_id: DataTypes.BIGINT.UNSIGNED,
  audit_time: DataTypes.DATE,
  certificate_id: DataTypes.BIGINT.UNSIGNED,
  registered_no: DataTypes.STRING(64),
  apply_fee: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  pay_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-未支付 1-已支付',
  },
}, {
  tableName: 'copyright_apply',
});

const CopyrightCertificate = sequelize.define('CopyrightCertificate', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  certificate_no: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  apply_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  work_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  work_title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  work_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  author_name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  copyright_owner: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  register_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  valid_date: DataTypes.DATEONLY,
  certificate_url: DataTypes.STRING(255),
  hash_value: DataTypes.STRING(128),
  blockchain_tx: DataTypes.STRING(255),
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '0-作废 1-有效',
  },
  revoke_reason: DataTypes.STRING(255),
  reissue_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'copyright_certificate',
});

module.exports = {
  CopyrightApply,
  CopyrightCertificate,
};
