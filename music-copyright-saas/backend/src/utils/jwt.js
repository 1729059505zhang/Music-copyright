const jwt = require('jsonwebtoken');
const config = require('../config');

class JwtUtil {
  /**
   * 生成用户token
   */
  static generateUserToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * 生成管理员token
   */
  static generateAdminToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.adminExpiresIn,
    });
  }

  /**
   * 验证token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      return null;
    }
  }

  /**
   * 解析token（不验证过期）
   */
  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}

module.exports = JwtUtil;
