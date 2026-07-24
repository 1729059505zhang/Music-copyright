const { sequelize, DataTypes } = require('../db/sequelize');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  order_no: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true,
  },
  buyer_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  order_type: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '1-词曲授权 2-版权登记 3-发行服务',
  },
  total_amount: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  discount_amount: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  pay_amount: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  pay_type: {
    type: DataTypes.TINYINT,
    comment: '1-余额支付 2-微信支付 3-支付宝',
  },
  pay_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-待支付 1-已支付 2-已退款 3-支付失败',
  },
  pay_time: DataTypes.DATE,
  transaction_id: DataTypes.STRING(128),
  order_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-待支付 1-已支付待结算 2-交易完成 3-已取消 4-已退款',
  },
  settlement_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-未结算 1-结算中 2-已结算',
  },
  settlement_time: DataTypes.DATE,
  frozen_until: DataTypes.DATE,
  buyer_company: DataTypes.STRING(128),
  buyer_contact: DataTypes.STRING(64),
  buyer_phone: DataTypes.STRING(32),
  invoice_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  remark: DataTypes.STRING(512),
  cancel_reason: DataTypes.STRING(255),
  refund_reason: DataTypes.STRING(255),
}, {
  tableName: 'orders',
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  order_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  work_id: DataTypes.BIGINT.UNSIGNED,
  item_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  item_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  item_cover: DataTypes.STRING(255),
  license_type: DataTypes.TINYINT,
  license_duration: DataTypes.INTEGER,
  price: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  total_price: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  creator_id: DataTypes.BIGINT.UNSIGNED,
  creator_name: DataTypes.STRING(128),
  settlement_amount: DataTypes.BIGINT,
  platform_commission: DataTypes.BIGINT,
  tenant_share: DataTypes.BIGINT,
}, {
  tableName: 'order_item',
  updatedAt: false,
});

const FinancialFlow = sequelize.define('FinancialFlow', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  flow_no: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  flow_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
    comment: '1-订单收入 2-订单退款 3-充值 4-提现 5-分账结算 6-平台抽佣',
  },
  flow_direction: {
    type: DataTypes.TINYINT,
    allowNull: false,
    comment: '1-收入 2-支出',
  },
  amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  balance_before: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  balance_after: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  related_user_id: DataTypes.BIGINT.UNSIGNED,
  related_order_id: DataTypes.BIGINT.UNSIGNED,
  related_settlement_id: DataTypes.BIGINT.UNSIGNED,
  related_withdrawal_id: DataTypes.BIGINT.UNSIGNED,
  remark: DataTypes.STRING(512),
}, {
  tableName: 'financial_flow',
  updatedAt: false,
});

const SettlementRecord = sequelize.define('SettlementRecord', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  settlement_no: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  order_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  order_item_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  creator_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  work_id: DataTypes.BIGINT.UNSIGNED,
  total_amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  platform_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  platform_amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  tenant_rate: DataTypes.DECIMAL(5, 2),
  tenant_amount: DataTypes.BIGINT,
  creator_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  creator_amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '1-已结算 2-已冲正',
  },
  settled_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'settlement_record',
});

const WithdrawalApply = sequelize.define('WithdrawalApply', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  withdrawal_no: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  creator_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  fee: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  actual_amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  withdrawal_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
    comment: '1-银行卡 2-支付宝 3-微信',
  },
  account_name: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  account_number: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  bank_name: DataTypes.STRING(128),
  apply_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-待审核 1-审核通过 2-已拒绝 3-打款中 4-已完成 5-打款失败',
  },
  audit_user_id: DataTypes.BIGINT.UNSIGNED,
  audit_time: DataTypes.DATE,
  audit_remark: DataTypes.STRING(255),
  reject_reason: DataTypes.STRING(255),
  transfer_time: DataTypes.DATE,
  transfer_voucher: DataTypes.STRING(255),
  transfer_no: DataTypes.STRING(128),
}, {
  tableName: 'withdrawal_apply',
});

module.exports = {
  Order,
  OrderItem,
  FinancialFlow,
  SettlementRecord,
  WithdrawalApply,
};
