const { sequelize, DataTypes } = require('../db/sequelize');

const MusicLyricWork = sequelize.define('MusicLyricWork', {
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
  creator_sub_id: DataTypes.BIGINT.UNSIGNED,
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  subtitle: DataTypes.STRING(255),
  category_id: DataTypes.INTEGER.UNSIGNED,
  style_tags: {
    type: DataTypes.JSON,
    get() {
      const raw = this.getDataValue('style_tags');
      return raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : [];
    },
    set(val) {
      this.setDataValue('style_tags', val ? JSON.stringify(val) : null);
    },
  },
  language: DataTypes.STRING(32),
  tempo: DataTypes.INTEGER,
  tonality: DataTypes.STRING(32),
  mood: DataTypes.STRING(64),
  scenario: DataTypes.STRING(64),
  duration: DataTypes.INTEGER,
  lyric: DataTypes.TEXT,
  lyric_preview: DataTypes.STRING(500),
  score_url: DataTypes.STRING(255),
  demo_url: DataTypes.STRING(255),
  demo_preview_url: DataTypes.STRING(255),
  cover_url: DataTypes.STRING(255),
  sale_mode: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '1-明码标价 2-仅询价',
  },
  is_exclusive_available: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  play_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  favorite_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  sale_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  audit_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-待审核 1-审核通过 2-审核拒绝',
  },
  audit_reject_reason: DataTypes.STRING(255),
  audit_time: DataTypes.DATE,
  audit_user_id: DataTypes.BIGINT.UNSIGNED,
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-已下架 1-已上架',
  },
  offline_reason: DataTypes.STRING(255),
  copyright_registered: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  copyright_cert_id: DataTypes.BIGINT.UNSIGNED,
}, {
  tableName: 'music_lyric_work',
});

const WorkLicensePackage = sequelize.define('WorkLicensePackage', {
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
  license_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
    comment: '1-非商用授权 2-商用授权 3-独家授权 4-全版权买断',
  },
  price: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  duration: DataTypes.INTEGER,
  territory: DataTypes.STRING(128),
  description: DataTypes.TEXT,
  terms: DataTypes.TEXT,
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
}, {
  tableName: 'work_license_package',
});

const MusicReleaseWork = sequelize.define('MusicReleaseWork', {
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
  lyric_work_id: DataTypes.BIGINT.UNSIGNED,
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  singer: DataTypes.STRING(128),
  album: DataTypes.STRING(128),
  cover_url: DataTypes.STRING(255),
  audio_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  duration: DataTypes.INTEGER,
  lyricist: DataTypes.STRING(64),
  composer: DataTypes.STRING(64),
  arranger: DataTypes.STRING(64),
  isrc: DataTypes.STRING(32),
  upc: DataTypes.STRING(32),
  release_date: DataTypes.DATEONLY,
  release_platforms: {
    type: DataTypes.JSON,
    get() {
      const raw = this.getDataValue('release_platforms');
      return raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : [];
    },
    set(val) {
      this.setDataValue('release_platforms', val ? JSON.stringify(val) : null);
    },
  },
  audit_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  audit_reject_reason: DataTypes.STRING(255),
  audit_time: DataTypes.DATE,
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-草稿 1-已发行 2-已下架',
  },
}, {
  tableName: 'music_release_work',
});

const Collection = sequelize.define('Collection', {
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
  work_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  work_type: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
}, {
  tableName: 'collection',
});

const InquiryRecord = sequelize.define('InquiryRecord', {
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
  buyer_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  creator_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  license_type: DataTypes.TINYINT,
  expected_price: DataTypes.BIGINT,
  usage_scenario: DataTypes.STRING(255),
  contact_name: DataTypes.STRING(64),
  contact_phone: DataTypes.STRING(32),
  contact_email: DataTypes.STRING(128),
  message: DataTypes.TEXT,
  reply_content: DataTypes.TEXT,
  reply_time: DataTypes.DATE,
  inquiry_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-待回复 1-已回复 2-已关闭',
  },
}, {
  tableName: 'inquiry_record',
});

const UserMessage = sequelize.define('UserMessage', {
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
  msg_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
    comment: '1-系统通知 2-订单消息 3-交易消息 4-审核消息 5-财务消息',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: DataTypes.TEXT,
  related_id: DataTypes.BIGINT.UNSIGNED,
  related_type: DataTypes.STRING(64),
  is_read: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  read_time: DataTypes.DATE,
}, {
  tableName: 'user_message',
  updatedAt: false,
});

module.exports = {
  MusicLyricWork,
  WorkLicensePackage,
  MusicReleaseWork,
  Collection,
  InquiryRecord,
  UserMessage,
};
