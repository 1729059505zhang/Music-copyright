const bcrypt = require('bcryptjs');
const { User, CreatorAccount } = require('../models');
const ResponseUtil = require('../utils/response');
const JwtUtil = require('../utils/jwt');

class AuthController {
  /**
   * 采购方注册
   */
  static async register(ctx) {
    const { username, password, phone, nickname, companyName } = ctx.request.body;

    if (!username || !password) {
      return ResponseUtil.fail(ctx, '用户名和密码不能为空');
    }

    const tenantId = 0;
    const existingUser = await User.findOne({ where: { tenant_id: tenantId, username } });
    if (existingUser) {
      return ResponseUtil.fail(ctx, '用户名已存在');
    }

    if (phone) {
      const phoneUser = await User.findOne({ where: { tenant_id: tenantId, phone } });
      if (phoneUser) {
        return ResponseUtil.fail(ctx, '手机号已被注册');
      }
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
      tenant_id: tenantId,
      username,
      password: hashedPassword,
      phone,
      nickname: nickname || username,
      user_type: 1,
      company_name: companyName,
      status: 1,
    });

    const token = JwtUtil.generateUserToken({
      userId: user.id,
      username: user.username,
      tenantId: user.tenant_id,
      userType: 'user',
      role: 'buyer',
    });

    ResponseUtil.success(ctx, {
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        phone: user.phone,
        userType: user.user_type,
      },
    }, '注册成功');
  }

  /**
   * 创作者入驻申请
   */
  static async creatorRegister(ctx) {
    const {
      username, password, phone, nickname, creatorType,
      creatorName, description, contactName, contactPhone, contactEmail,
      realName, idCard, idCardFront, idCardBack,
      businessLicense, companyName,
    } = ctx.request.body;

    if (!username || !password) {
      return ResponseUtil.fail(ctx, '用户名和密码不能为空');
    }
    if (!creatorType || !creatorName) {
      return ResponseUtil.fail(ctx, '创作者类型和名称不能为空');
    }

    const tenantId = 0;
    const existingUser = await User.findOne({ where: { tenant_id: tenantId, username } });
    if (existingUser) {
      return ResponseUtil.fail(ctx, '用户名已存在');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
      tenant_id: tenantId,
      username,
      password: hashedPassword,
      phone,
      nickname: nickname || username,
      user_type: 2,
      real_name: realName,
      id_card: idCard,
      company_name: companyName,
      status: 1,
    });

    const creator = await CreatorAccount.create({
      tenant_id: tenantId,
      user_id: user.id,
      creator_type: creatorType,
      creator_name: creatorName,
      description,
      contact_name: contactName || realName,
      contact_phone: contactPhone || phone,
      contact_email: contactEmail,
      id_card_front: idCardFront,
      id_card_back: idCardBack,
      business_license: businessLicense,
      status: 0,
    });

    const token = JwtUtil.generateUserToken({
      userId: user.id,
      username: user.username,
      tenantId: user.tenant_id,
      userType: 'user',
      role: 'creator',
      creatorId: creator.id,
    });

    ResponseUtil.success(ctx, {
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        userType: user.user_type,
      },
      creator: {
        id: creator.id,
        creatorName: creator.creator_name,
        creatorType: creator.creator_type,
        status: creator.status,
      },
    }, '入驻申请已提交，请等待审核');
  }

  /**
   * 用户登录
   */
  static async login(ctx) {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      return ResponseUtil.fail(ctx, '用户名和密码不能为空');
    }

    const tenantId = 0;
    const user = await User.findOne({ where: { tenant_id: tenantId, username } });
    if (!user) {
      return ResponseUtil.fail(ctx, '用户名或密码错误');
    }

    if (user.status !== 1) {
      return ResponseUtil.fail(ctx, '账号已被禁用，请联系客服');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return ResponseUtil.fail(ctx, '用户名或密码错误');
    }

    await User.update(
      { last_login_time: new Date(), last_login_ip: ctx.ip },
      { where: { id: user.id } }
    );

    let role = 'buyer';
    let creator = null;

    if (user.user_type === 2 || user.user_type === 3) {
      const creatorAccount = await CreatorAccount.findOne({
        where: { tenant_id: tenantId, user_id: user.id },
      });
      if (creatorAccount) {
        role = 'creator';
        creator = {
          id: creatorAccount.id,
          creatorName: creatorAccount.creator_name,
          creatorType: creatorAccount.creator_type,
          status: creatorAccount.status,
        };
      }
    }

    const token = JwtUtil.generateUserToken({
      userId: user.id,
      username: user.username,
      tenantId: user.tenant_id,
      userType: 'user',
      role,
      creatorId: creator?.id,
    });

    ResponseUtil.success(ctx, {
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        email: user.email,
        userType: user.user_type,
        authStatus: user.auth_status,
        balance: user.balance,
      },
      creator,
      role,
    }, '登录成功');
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(ctx) {
    const userInfo = ctx.state.user;
    const user = await User.findByPk(userInfo.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return ResponseUtil.fail(ctx, '用户不存在', 404, 404);
    }

    let creator = null;
    if (user.user_type === 2 || user.user_type === 3) {
      creator = await CreatorAccount.findOne({
        where: { tenant_id: user.tenant_id, user_id: user.id },
      });
    }

    ResponseUtil.success(ctx, {
      user,
      creator,
    });
  }

  /**
   * 修改密码
   */
  static async changePassword(ctx) {
    const userId = ctx.state.user.userId;
    const { oldPassword, newPassword } = ctx.request.body;

    if (!oldPassword || !newPassword) {
      return ResponseUtil.fail(ctx, '旧密码和新密码不能为空');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return ResponseUtil.fail(ctx, '用户不存在');
    }

    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isPasswordValid) {
      return ResponseUtil.fail(ctx, '旧密码错误');
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: userId } });

    ResponseUtil.success(ctx, null, '密码修改成功');
  }
}

module.exports = AuthController;
