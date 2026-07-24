const { nanoid } = require('nanoid');
const crypto = require('crypto');
const dayjs = require('dayjs');

/**
 * 生成订单号
 */
function generateOrderNo() {
  const date = dayjs().format('YYYYMMDDHHmmss');
  const rand = nanoid(8).toUpperCase();
  return `OD${date}${rand}`;
}

/**
 * 生成流水号
 */
function generateFlowNo(prefix = 'FL') {
  const date = dayjs().format('YYYYMMDDHHmmss');
  const rand = nanoid(10);
  return `${prefix}${date}${rand}`;
}

/**
 * 生成结算单号
 */
function generateSettlementNo() {
  const date = dayjs().format('YYYYMMDDHHmmss');
  const rand = nanoid(8).toUpperCase();
  return `ST${date}${rand}`;
}

/**
 * 生成提现单号
 */
function generateWithdrawalNo() {
  const date = dayjs().format('YYYYMMDDHHmmss');
  const rand = nanoid(8).toUpperCase();
  return `WD${date}${rand}`;
}

/**
 * 生成版权登记号
 */
function generateCopyrightNo() {
  const year = dayjs().format('YYYY');
  const rand = nanoid(12).toUpperCase();
  return `CR${year}${rand}`;
}

/**
 * 计算文件MD5哈希
 */
function md5Hash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * 计算SHA256哈希
 */
function sha256Hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * 分页参数解析
 */
function parsePagination(query) {
  const page = parseInt(query.page || 1, 10);
  const pageSize = parseInt(query.pageSize || 10, 10);
  const offset = (page - 1) * pageSize;
  return {
    page,
    pageSize,
    offset,
    limit: pageSize,
  };
}

/**
 * 分转元（格式化显示用）
 */
function fenToYuan(fen) {
  return (fen / 100).toFixed(2);
}

/**
 * 元转分（整数，避免浮点误差）
 */
function yuanToFen(yuan) {
  return Math.round(parseFloat(yuan) * 100);
}

/**
 * 隐藏手机号中间四位
 */
function maskPhone(phone) {
  if (!phone || phone.length < 7) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 隐藏身份证号中间部分
 */
function maskIdCard(idCard) {
  if (!idCard || idCard.length < 8) return idCard;
  return idCard.replace(/^(.{6})(.+)(.{4})$/, '$1********$3');
}

/**
 * 解析JSON字段，容错处理
 */
function safeJsonParse(str, defaultValue = null) {
  if (!str) return defaultValue;
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
}

module.exports = {
  generateOrderNo,
  generateFlowNo,
  generateSettlementNo,
  generateWithdrawalNo,
  generateCopyrightNo,
  md5Hash,
  sha256Hash,
  parsePagination,
  fenToYuan,
  yuanToFen,
  maskPhone,
  maskIdCard,
  safeJsonParse,
};
