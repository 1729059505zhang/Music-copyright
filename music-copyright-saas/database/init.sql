-- ============================================================
-- 音乐版权生态SaaS系统 - 数据库初始化脚本
-- 数据库: MySQL 8.0+
-- 字符集: utf8mb4
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. 租户信息表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `saas_tenant`;
CREATE TABLE `saas_tenant` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '租户ID',
  `tenant_code` VARCHAR(64) NOT NULL COMMENT '租户编码（唯一标识）',
  `tenant_name` VARCHAR(128) NOT NULL COMMENT '租户名称',
  `logo_url` VARCHAR(255) DEFAULT NULL COMMENT '品牌LOGO地址',
  `domain` VARCHAR(128) DEFAULT NULL COMMENT '独立域名',
  `contact_name` VARCHAR(64) DEFAULT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(32) DEFAULT NULL COMMENT '联系电话',
  `contact_email` VARCHAR(128) DEFAULT NULL COMMENT '联系邮箱',
  `revenue_share_ratio` DECIMAL(5,2) DEFAULT NULL COMMENT '租户分成比例(%)，为空则使用全局默认',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
  `expire_time` DATETIME DEFAULT NULL COMMENT '到期时间',
  `remark` VARCHAR(512) DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_code` (`tenant_code`),
  UNIQUE KEY `uk_domain` (`domain`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SaaS租户信息表';

-- ------------------------------------------------------------
-- 2. 用户基础表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID，0表示平台官方',
  `username` VARCHAR(64) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（bcrypt加密）',
  `nickname` VARCHAR(64) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像',
  `phone` VARCHAR(32) DEFAULT NULL COMMENT '手机号',
  `email` VARCHAR(128) DEFAULT NULL COMMENT '邮箱',
  `user_type` TINYINT NOT NULL DEFAULT 1 COMMENT '用户类型: 1-采购方 2-创作者 3-机构成员',
  `real_name` VARCHAR(64) DEFAULT NULL COMMENT '真实姓名',
  `id_card` VARCHAR(32) DEFAULT NULL COMMENT '身份证号',
  `company_name` VARCHAR(128) DEFAULT NULL COMMENT '企业名称',
  `business_license` VARCHAR(255) DEFAULT NULL COMMENT '营业执照',
  `auth_status` TINYINT NOT NULL DEFAULT 0 COMMENT '实名认证状态: 0-未认证 1-审核中 2-已通过 3-已拒绝',
  `auth_reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '认证拒绝原因',
  `balance` BIGINT NOT NULL DEFAULT 0 COMMENT '账户余额（单位：分）',
  `frozen_balance` BIGINT NOT NULL DEFAULT 0 COMMENT '冻结余额（单位：分）',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(64) DEFAULT NULL COMMENT '最后登录IP',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_username` (`tenant_id`, `username`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_email` (`email`),
  KEY `idx_user_type` (`user_type`),
  KEY `idx_status` (`status`),
  KEY `idx_auth_status` (`auth_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户基础表';

-- ------------------------------------------------------------
-- 3. 创作者主体表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `creator_accounts`;
CREATE TABLE `creator_accounts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主体ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '关联用户ID（主账号）',
  `creator_type` TINYINT NOT NULL COMMENT '主体类型: 1-独立音乐人 2-唱片公司 3-音乐工作室 4-MCN机构',
  `creator_name` VARCHAR(128) NOT NULL COMMENT '主体名称（艺名/公司名）',
  `logo` VARCHAR(255) DEFAULT NULL COMMENT '主体LOGO',
  `description` TEXT COMMENT '主体简介',
  `contact_name` VARCHAR(64) DEFAULT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(32) DEFAULT NULL COMMENT '联系电话',
  `contact_email` VARCHAR(128) DEFAULT NULL COMMENT '联系邮箱',
  `revenue_share_ratio` DECIMAL(5,2) DEFAULT NULL COMMENT '创作者分成比例(%)，为空则使用租户/全局默认',
  `id_card_front` VARCHAR(255) DEFAULT NULL COMMENT '身份证正面照',
  `id_card_back` VARCHAR(255) DEFAULT NULL COMMENT '身份证反面照',
  `business_license` VARCHAR(255) DEFAULT NULL COMMENT '营业执照（机构类型）',
  `tax_number` VARCHAR(64) DEFAULT NULL COMMENT '税号（机构类型）',
  `bank_account_name` VARCHAR(64) DEFAULT NULL COMMENT '银行账户名',
  `bank_account_number` VARCHAR(64) DEFAULT NULL COMMENT '银行账号',
  `bank_name` VARCHAR(128) DEFAULT NULL COMMENT '开户银行',
  `alipay_account` VARCHAR(128) DEFAULT NULL COMMENT '支付宝账号',
  `wechat_account` VARCHAR(128) DEFAULT NULL COMMENT '微信账号',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0-待审核 1-已通过 2-已拒绝 3-已禁用',
  `reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '拒绝原因',
  `verified_at` DATETIME DEFAULT NULL COMMENT '审核通过时间',
  `total_works` INT NOT NULL DEFAULT 0 COMMENT '作品总数',
  `total_sales` BIGINT NOT NULL DEFAULT 0 COMMENT '累计销售额（分）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_creator_type` (`creator_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='创作者主体表';

-- ------------------------------------------------------------
-- 4. 机构子账号表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `creator_sub_account`;
CREATE TABLE `creator_sub_account` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '子账号ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `creator_id` BIGINT UNSIGNED NOT NULL COMMENT '所属创作者主体ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '关联用户ID',
  `role_name` VARCHAR(64) NOT NULL COMMENT '角色名称',
  `permissions` JSON DEFAULT NULL COMMENT '权限列表',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='机构子账号表';

-- ------------------------------------------------------------
-- 5. 曲风分类表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `music_category`;
CREATE TABLE `music_category` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID，0为全局共用',
  `parent_id` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '父级分类ID',
  `name` VARCHAR(64) NOT NULL COMMENT '分类名称',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='曲风分类表';

-- ------------------------------------------------------------
-- 6. 词曲作品主表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `music_lyric_work`;
CREATE TABLE `music_lyric_work` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '作品ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `creator_id` BIGINT UNSIGNED NOT NULL COMMENT '创作者主体ID',
  `creator_sub_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '上传子账号ID',
  `title` VARCHAR(255) NOT NULL COMMENT '作品标题',
  `subtitle` VARCHAR(255) DEFAULT NULL COMMENT '副标题',
  `category_id` INT UNSIGNED DEFAULT NULL COMMENT '曲风分类ID',
  `style_tags` JSON DEFAULT NULL COMMENT '风格标签',
  `language` VARCHAR(32) DEFAULT NULL COMMENT '语言',
  `tempo` INT DEFAULT NULL COMMENT 'BPM（速度）',
  `tonality` VARCHAR(32) DEFAULT NULL COMMENT '调性',
  `mood` VARCHAR(64) DEFAULT NULL COMMENT '情绪',
  `scenario` VARCHAR(64) DEFAULT NULL COMMENT '适用场景',
  `duration` INT DEFAULT NULL COMMENT '时长（秒）',
  `lyric` TEXT COMMENT '完整歌词',
  `lyric_preview` VARCHAR(500) DEFAULT NULL COMMENT '歌词预览（片段）',
  `score_url` VARCHAR(255) DEFAULT NULL COMMENT '曲谱文件URL',
  `demo_url` VARCHAR(255) DEFAULT NULL COMMENT '完整Demo音频URL',
  `demo_preview_url` VARCHAR(255) DEFAULT NULL COMMENT 'Demo试听片段URL',
  `cover_url` VARCHAR(255) DEFAULT NULL COMMENT '封面图URL',
  `sale_mode` TINYINT NOT NULL DEFAULT 1 COMMENT '销售模式: 1-明码标价 2-仅询价',
  `is_exclusive_available` TINYINT NOT NULL DEFAULT 0 COMMENT '是否可独家授权: 0-否 1-是',
  `view_count` INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `play_count` INT NOT NULL DEFAULT 0 COMMENT '播放次数',
  `favorite_count` INT NOT NULL DEFAULT 0 COMMENT '收藏次数',
  `sale_count` INT NOT NULL DEFAULT 0 COMMENT '成交次数',
  `audit_status` TINYINT NOT NULL DEFAULT 0 COMMENT '审核状态: 0-待审核 1-审核通过 2-审核拒绝',
  `audit_reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '审核拒绝原因',
  `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
  `audit_user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '审核人ID',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '上架状态: 0-已下架 1-已上架',
  `offline_reason` VARCHAR(255) DEFAULT NULL COMMENT '下架原因',
  `copyright_registered` TINYINT NOT NULL DEFAULT 0 COMMENT '是否已版权登记: 0-否 1-是',
  `copyright_cert_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '版权凭证ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_audit_status` (`audit_status`),
  KEY `idx_status` (`status`),
  KEY `idx_sale_mode` (`sale_mode`),
  KEY `idx_created_at` (`created_at`),
  FULLTEXT KEY `ft_title_lyric` (`title`, `lyric`) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='词曲作品主表';

-- ------------------------------------------------------------
-- 7. 授权套餐配置表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `work_license_package`;
CREATE TABLE `work_license_package` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '套餐ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `work_id` BIGINT UNSIGNED NOT NULL COMMENT '作品ID',
  `license_type` TINYINT NOT NULL COMMENT '授权类型: 1-非商用授权 2-商用授权 3-独家授权 4-全版权买断',
  `price` BIGINT NOT NULL DEFAULT 0 COMMENT '价格（单位：分）',
  `duration` INT DEFAULT NULL COMMENT '授权有效期（天），NULL为永久',
  `territory` VARCHAR(128) DEFAULT NULL COMMENT '授权地域范围',
  `description` TEXT COMMENT '授权范围描述',
  `terms` TEXT COMMENT '授权条款',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_work_id` (`work_id`),
  KEY `idx_license_type` (`license_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作品授权套餐配置表';

-- ------------------------------------------------------------
-- 8. 发行作品表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `music_release_work`;
CREATE TABLE `music_release_work` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '发行作品ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `creator_id` BIGINT UNSIGNED NOT NULL COMMENT '创作者主体ID',
  `lyric_work_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联词曲作品ID',
  `title` VARCHAR(255) NOT NULL COMMENT '歌曲名称',
  `singer` VARCHAR(128) DEFAULT NULL COMMENT '歌手',
  `album` VARCHAR(128) DEFAULT NULL COMMENT '所属专辑',
  `cover_url` VARCHAR(255) DEFAULT NULL COMMENT '封面图',
  `audio_url` VARCHAR(255) NOT NULL COMMENT '完整音频URL',
  `duration` INT DEFAULT NULL COMMENT '时长（秒）',
  `lyricist` VARCHAR(64) DEFAULT NULL COMMENT '作词',
  `composer` VARCHAR(64) DEFAULT NULL COMMENT '作曲',
  `arranger` VARCHAR(64) DEFAULT NULL COMMENT '编曲',
  `isrc` VARCHAR(32) DEFAULT NULL COMMENT 'ISRC编码',
  `upc` VARCHAR(32) DEFAULT NULL COMMENT 'UPC条码',
  `release_date` DATE DEFAULT NULL COMMENT '发行日期',
  `release_platforms` JSON DEFAULT NULL COMMENT '发行平台列表',
  `audit_status` TINYINT NOT NULL DEFAULT 0 COMMENT '审核状态: 0-待审核 1-审核通过 2-审核拒绝',
  `audit_reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '审核拒绝原因',
  `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0-草稿 1-已发行 2-已下架',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_lyric_work_id` (`lyric_work_id`),
  KEY `idx_audit_status` (`audit_status`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='音乐发行作品表';

-- ------------------------------------------------------------
-- 9. 版权登记申请表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `copyright_apply`;
CREATE TABLE `copyright_apply` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '申请ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `work_id` BIGINT UNSIGNED NOT NULL COMMENT '作品ID',
  `creator_id` BIGINT UNSIGNED NOT NULL COMMENT '申请人（创作者主体ID）',
  `work_type` TINYINT NOT NULL COMMENT '作品类型: 1-词曲作品 2-发行作品',
  `work_title` VARCHAR(255) NOT NULL COMMENT '作品名称',
  `author_name` VARCHAR(128) NOT NULL COMMENT '作者姓名',
  `author_id_type` TINYINT DEFAULT NULL COMMENT '作者证件类型: 1-身份证 2-护照',
  `author_id_number` VARCHAR(64) DEFAULT NULL COMMENT '作者证件号',
  `creation_date` DATE DEFAULT NULL COMMENT '创作完成日期',
  `first_publish_date` DATE DEFAULT NULL COMMENT '首次发表日期',
  `copyright_owner` VARCHAR(128) DEFAULT NULL COMMENT '版权所有人',
  `owner_type` TINYINT DEFAULT NULL COMMENT '所有人类型: 1-个人 2-企业',
  `work_sample_url` VARCHAR(255) DEFAULT NULL COMMENT '作品样本文件',
  `id_card_front` VARCHAR(255) DEFAULT NULL COMMENT '身份证正面',
  `id_card_back` VARCHAR(255) DEFAULT NULL COMMENT '身份证反面',
  `business_license` VARCHAR(255) DEFAULT NULL COMMENT '营业执照（企业）',
  `power_of_attorney` VARCHAR(255) DEFAULT NULL COMMENT '委托书（如有）',
  `other_materials` JSON DEFAULT NULL COMMENT '其他材料',
  `apply_status` TINYINT NOT NULL DEFAULT 0 COMMENT '申请状态: 0-待提交 1-审核中 2-已通过 3-已拒绝',
  `reject_reason` VARCHAR(512) DEFAULT NULL COMMENT '驳回原因',
  `audit_user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '审核人',
  `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
  `certificate_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '生成的证书ID',
  `registered_no` VARCHAR(64) DEFAULT NULL COMMENT '版权登记号',
  `apply_fee` BIGINT NOT NULL DEFAULT 0 COMMENT '申请费用（分）',
  `pay_status` TINYINT NOT NULL DEFAULT 0 COMMENT '支付状态: 0-未支付 1-已支付',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_work_id` (`work_id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_apply_status` (`apply_status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='版权登记申请表';

-- ------------------------------------------------------------
-- 10. 电子版权凭证表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `copyright_certificate`;
CREATE TABLE `copyright_certificate` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '凭证ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `certificate_no` VARCHAR(64) NOT NULL COMMENT '版权证书编号',
  `apply_id` BIGINT UNSIGNED NOT NULL COMMENT '关联申请ID',
  `work_id` BIGINT UNSIGNED NOT NULL COMMENT '作品ID',
  `work_title` VARCHAR(255) NOT NULL COMMENT '作品名称',
  `work_type` TINYINT NOT NULL COMMENT '作品类型',
  `author_name` VARCHAR(128) NOT NULL COMMENT '作者',
  `copyright_owner` VARCHAR(128) NOT NULL COMMENT '版权所有人',
  `register_date` DATE NOT NULL COMMENT '登记日期',
  `valid_date` DATE DEFAULT NULL COMMENT '有效期至',
  `certificate_url` VARCHAR(255) DEFAULT NULL COMMENT '证书文件URL',
  `hash_value` VARCHAR(128) DEFAULT NULL COMMENT '作品哈希值（存证）',
  `blockchain_tx` VARCHAR(255) DEFAULT NULL COMMENT '区块链交易哈希（预留）',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-作废 1-有效',
  `revoke_reason` VARCHAR(255) DEFAULT NULL COMMENT '作废原因',
  `reissue_count` INT NOT NULL DEFAULT 0 COMMENT '补发次数',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_certificate_no` (`certificate_no`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_work_id` (`work_id`),
  KEY `idx_apply_id` (`apply_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='电子版权凭证表';

-- ------------------------------------------------------------
-- 11. 订单主表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
  `buyer_id` BIGINT UNSIGNED NOT NULL COMMENT '买家用户ID',
  `order_type` TINYINT NOT NULL DEFAULT 1 COMMENT '订单类型: 1-词曲授权 2-版权登记 3-发行服务',
  `total_amount` BIGINT NOT NULL DEFAULT 0 COMMENT '订单总金额（分）',
  `discount_amount` BIGINT NOT NULL DEFAULT 0 COMMENT '优惠金额（分）',
  `pay_amount` BIGINT NOT NULL DEFAULT 0 COMMENT '实付金额（分）',
  `pay_type` TINYINT DEFAULT NULL COMMENT '支付方式: 1-余额支付 2-微信支付 3-支付宝',
  `pay_status` TINYINT NOT NULL DEFAULT 0 COMMENT '支付状态: 0-待支付 1-已支付 2-已退款 3-支付失败',
  `pay_time` DATETIME DEFAULT NULL COMMENT '支付时间',
  `transaction_id` VARCHAR(128) DEFAULT NULL COMMENT '第三方支付交易号',
  `order_status` TINYINT NOT NULL DEFAULT 0 COMMENT '订单状态: 0-待支付 1-已支付待结算 2-交易完成 3-已取消 4-已退款',
  `settlement_status` TINYINT NOT NULL DEFAULT 0 COMMENT '结算状态: 0-未结算 1-结算中 2-已结算',
  `settlement_time` DATETIME DEFAULT NULL COMMENT '结算时间',
  `frozen_until` DATETIME DEFAULT NULL COMMENT '资金冻结截止时间（冷静期）',
  `buyer_company` VARCHAR(128) DEFAULT NULL COMMENT '买家企业名称（下单时快照）',
  `buyer_contact` VARCHAR(64) DEFAULT NULL COMMENT '买家联系人',
  `buyer_phone` VARCHAR(32) DEFAULT NULL COMMENT '买家联系电话',
  `invoice_status` TINYINT NOT NULL DEFAULT 0 COMMENT '发票状态: 0-无需 1-待开具 2-已开具',
  `remark` VARCHAR(512) DEFAULT NULL COMMENT '买家备注',
  `cancel_reason` VARCHAR(255) DEFAULT NULL COMMENT '取消原因',
  `refund_reason` VARCHAR(255) DEFAULT NULL COMMENT '退款原因',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_buyer_id` (`buyer_id`),
  KEY `idx_order_type` (`order_type`),
  KEY `idx_order_status` (`order_status`),
  KEY `idx_pay_status` (`pay_status`),
  KEY `idx_settlement_status` (`settlement_status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单主表';

-- ------------------------------------------------------------
-- 12. 订单明细表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `order_item`;
CREATE TABLE `order_item` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `order_id` BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `work_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '作品ID',
  `item_type` TINYINT NOT NULL COMMENT '商品类型: 1-词曲授权 2-版权登记 3-发行服务',
  `item_name` VARCHAR(255) NOT NULL COMMENT '商品名称',
  `item_cover` VARCHAR(255) DEFAULT NULL COMMENT '商品封面',
  `license_type` TINYINT DEFAULT NULL COMMENT '授权类型',
  `license_duration` INT DEFAULT NULL COMMENT '授权期限（天）',
  `price` BIGINT NOT NULL DEFAULT 0 COMMENT '单价（分）',
  `quantity` INT NOT NULL DEFAULT 1 COMMENT '数量',
  `total_price` BIGINT NOT NULL DEFAULT 0 COMMENT '小计金额（分）',
  `creator_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '创作者主体ID',
  `creator_name` VARCHAR(128) DEFAULT NULL COMMENT '创作者名称快照',
  `settlement_amount` BIGINT DEFAULT NULL COMMENT '应结算金额（分）',
  `platform_commission` BIGINT DEFAULT NULL COMMENT '平台佣金（分）',
  `tenant_share` BIGINT DEFAULT NULL COMMENT '租户分成（分）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_work_id` (`work_id`),
  KEY `idx_creator_id` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';

-- ------------------------------------------------------------
-- 13. 全站资金流水表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `financial_flow`;
CREATE TABLE `financial_flow` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '流水ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `flow_no` VARCHAR(64) NOT NULL COMMENT '流水号',
  `flow_type` TINYINT NOT NULL COMMENT '流水类型: 1-订单收入 2-订单退款 3-充值 4-提现 5-分账结算 6-平台抽佣',
  `flow_direction` TINYINT NOT NULL COMMENT '资金方向: 1-收入 2-支出',
  `amount` BIGINT NOT NULL COMMENT '金额（分）',
  `balance_before` BIGINT NOT NULL COMMENT '变动前余额',
  `balance_after` BIGINT NOT NULL COMMENT '变动后余额',
  `related_user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联用户ID',
  `related_order_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联订单ID',
  `related_settlement_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联结算ID',
  `related_withdrawal_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联提现ID',
  `remark` VARCHAR(512) DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_flow_no` (`flow_no`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_flow_type` (`flow_type`),
  KEY `idx_flow_direction` (`flow_direction`),
  KEY `idx_related_user_id` (`related_user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='全站资金流水表';

-- ------------------------------------------------------------
-- 14. 分账结算记录表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `settlement_record`;
CREATE TABLE `settlement_record` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '结算记录ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `settlement_no` VARCHAR(64) NOT NULL COMMENT '结算单号',
  `order_id` BIGINT UNSIGNED NOT NULL COMMENT '关联订单ID',
  `order_item_id` BIGINT UNSIGNED NOT NULL COMMENT '订单明细ID',
  `creator_id` BIGINT UNSIGNED NOT NULL COMMENT '创作者主体ID',
  `work_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '作品ID',
  `total_amount` BIGINT NOT NULL COMMENT '订单实付金额（分）',
  `platform_rate` DECIMAL(5,2) NOT NULL COMMENT '平台分成比例(%)',
  `platform_amount` BIGINT NOT NULL COMMENT '平台分成金额（分）',
  `tenant_rate` DECIMAL(5,2) DEFAULT NULL COMMENT '租户分成比例(%)',
  `tenant_amount` BIGINT DEFAULT NULL COMMENT '租户分成金额（分）',
  `creator_rate` DECIMAL(5,2) NOT NULL COMMENT '创作者分成比例(%)',
  `creator_amount` BIGINT NOT NULL COMMENT '创作者分成金额（分）',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1-已结算 2-已冲正',
  `settled_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '结算时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_settlement_no` (`settlement_no`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_status` (`status`),
  KEY `idx_settled_at` (`settled_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分账结算记录表';

-- ------------------------------------------------------------
-- 15. 创作者提现申请表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `withdrawal_apply`;
CREATE TABLE `withdrawal_apply` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '提现ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `withdrawal_no` VARCHAR(64) NOT NULL COMMENT '提现单号',
  `creator_id` BIGINT UNSIGNED NOT NULL COMMENT '创作者主体ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '申请人用户ID',
  `amount` BIGINT NOT NULL COMMENT '提现金额（分）',
  `fee` BIGINT NOT NULL DEFAULT 0 COMMENT '手续费（分）',
  `actual_amount` BIGINT NOT NULL COMMENT '实到金额（分）',
  `withdrawal_type` TINYINT NOT NULL COMMENT '提现方式: 1-银行卡 2-支付宝 3-微信',
  `account_name` VARCHAR(64) NOT NULL COMMENT '账户名',
  `account_number` VARCHAR(64) NOT NULL COMMENT '账号',
  `bank_name` VARCHAR(128) DEFAULT NULL COMMENT '开户银行（银行卡）',
  `apply_status` TINYINT NOT NULL DEFAULT 0 COMMENT '申请状态: 0-待审核 1-审核通过 2-已拒绝 3-打款中 4-已完成 5-打款失败',
  `audit_user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '审核人',
  `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
  `audit_remark` VARCHAR(255) DEFAULT NULL COMMENT '审核备注',
  `reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '拒绝原因',
  `transfer_time` DATETIME DEFAULT NULL COMMENT '打款时间',
  `transfer_voucher` VARCHAR(255) DEFAULT NULL COMMENT '打款凭证',
  `transfer_no` VARCHAR(128) DEFAULT NULL COMMENT '第三方转账流水号',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_withdrawal_no` (`withdrawal_no`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_apply_status` (`apply_status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='创作者提现申请表';

-- ------------------------------------------------------------
-- 16. 用户收藏表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `collection`;
CREATE TABLE `collection` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `work_id` BIGINT UNSIGNED NOT NULL COMMENT '作品ID',
  `work_type` TINYINT NOT NULL DEFAULT 1 COMMENT '作品类型: 1-词曲作品 2-发行作品',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_user_work` (`tenant_id`, `user_id`, `work_id`, `work_type`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_work_id` (`work_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户收藏表';

-- ------------------------------------------------------------
-- 17. 后台管理员账号
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID，0为平台总后台',
  `username` VARCHAR(64) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码',
  `real_name` VARCHAR(64) DEFAULT NULL COMMENT '真实姓名',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像',
  `phone` VARCHAR(32) DEFAULT NULL COMMENT '手机号',
  `email` VARCHAR(128) DEFAULT NULL COMMENT '邮箱',
  `role_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '角色ID',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(64) DEFAULT NULL COMMENT '最后登录IP',
  `created_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '创建人',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_username` (`tenant_id`, `username`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台管理员账号表';

-- ------------------------------------------------------------
-- 18. 后台角色表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `admin_role`;
CREATE TABLE `admin_role` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID，0为平台全局',
  `role_name` VARCHAR(64) NOT NULL COMMENT '角色名称',
  `role_code` VARCHAR(64) NOT NULL COMMENT '角色编码',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '角色描述',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_role_code` (`tenant_id`, `role_code`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台角色表';

-- ------------------------------------------------------------
-- 19. 后台权限表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `admin_permission`;
CREATE TABLE `admin_permission` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `parent_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '父级权限ID',
  `permission_name` VARCHAR(64) NOT NULL COMMENT '权限名称',
  `permission_code` VARCHAR(128) NOT NULL COMMENT '权限编码',
  `permission_type` TINYINT NOT NULL COMMENT '权限类型: 1-菜单 2-按钮 3-接口',
  `path` VARCHAR(255) DEFAULT NULL COMMENT '路由路径/接口路径',
  `icon` VARCHAR(64) DEFAULT NULL COMMENT '菜单图标',
  `component` VARCHAR(255) DEFAULT NULL COMMENT '前端组件',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_permission_code` (`permission_code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_permission_type` (`permission_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台权限表';

-- ------------------------------------------------------------
-- 20. 角色权限关联表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `admin_role_permission`;
CREATE TABLE `admin_role_permission` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `permission_id` BIGINT UNSIGNED NOT NULL COMMENT '权限ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- ------------------------------------------------------------
-- 21. 全局系统配置表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `system_config`;
CREATE TABLE `system_config` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` VARCHAR(128) NOT NULL COMMENT '配置键',
  `config_value` TEXT COMMENT '配置值',
  `config_name` VARCHAR(128) NOT NULL COMMENT '配置名称',
  `config_group` VARCHAR(64) NOT NULL DEFAULT 'basic' COMMENT '配置分组',
  `config_type` VARCHAR(32) NOT NULL DEFAULT 'string' COMMENT '值类型: string/number/boolean/json',
  `remark` VARCHAR(512) DEFAULT NULL COMMENT '备注',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='全局系统配置表';

-- ------------------------------------------------------------
-- 22. 第三方API配置表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `third_api_config`;
CREATE TABLE `third_api_config` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `api_type` VARCHAR(64) NOT NULL COMMENT 'API类型: payment/oss/copyright/sms/email',
  `api_name` VARCHAR(128) NOT NULL COMMENT 'API名称',
  `api_provider` VARCHAR(64) DEFAULT NULL COMMENT '服务提供商',
  `base_url` VARCHAR(255) DEFAULT NULL COMMENT '接口基础地址',
  `request_method` VARCHAR(16) DEFAULT 'POST' COMMENT '请求方式: GET/POST/PUT/DELETE',
  `app_key` VARCHAR(128) DEFAULT NULL COMMENT '应用Key/AccessKey',
  `app_secret` VARCHAR(255) DEFAULT NULL COMMENT '应用Secret/SecretKey',
  `headers` JSON DEFAULT NULL COMMENT '自定义请求头（JSON）',
  `extra_params` JSON DEFAULT NULL COMMENT '额外参数配置（JSON）',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0-禁用 1-启用',
  `remark` VARCHAR(512) DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_api_type` (`api_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='第三方API配置表';

-- ------------------------------------------------------------
-- 23. 后台操作日志表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '操作用户ID',
  `username` VARCHAR(64) DEFAULT NULL COMMENT '操作用户名',
  `module` VARCHAR(64) DEFAULT NULL COMMENT '操作模块',
  `action` VARCHAR(128) DEFAULT NULL COMMENT '操作动作',
  `method` VARCHAR(16) DEFAULT NULL COMMENT '请求方法',
  `path` VARCHAR(255) DEFAULT NULL COMMENT '请求路径',
  `params` TEXT COMMENT '请求参数（JSON）',
  `result` TEXT COMMENT '返回结果（JSON）',
  `ip` VARCHAR(64) DEFAULT NULL COMMENT '操作IP',
  `user_agent` VARCHAR(512) DEFAULT NULL COMMENT 'UA',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1-成功 0-失败',
  `error_msg` VARCHAR(512) DEFAULT NULL COMMENT '错误信息',
  `duration` INT DEFAULT NULL COMMENT '耗时（毫秒）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_module` (`module`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台操作日志表';

-- ------------------------------------------------------------
-- 24. 询价记录表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `inquiry_record`;
CREATE TABLE `inquiry_record` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '询价ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `work_id` BIGINT UNSIGNED NOT NULL COMMENT '作品ID',
  `buyer_id` BIGINT UNSIGNED NOT NULL COMMENT '询价人用户ID',
  `creator_id` BIGINT UNSIGNED NOT NULL COMMENT '创作者主体ID',
  `license_type` TINYINT DEFAULT NULL COMMENT '意向授权类型',
  `expected_price` BIGINT DEFAULT NULL COMMENT '意向价格（分）',
  `usage_scenario` VARCHAR(255) DEFAULT NULL COMMENT '使用场景说明',
  `contact_name` VARCHAR(64) DEFAULT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(32) DEFAULT NULL COMMENT '联系电话',
  `contact_email` VARCHAR(128) DEFAULT NULL COMMENT '联系邮箱',
  `message` TEXT COMMENT '询价留言',
  `reply_content` TEXT COMMENT '回复内容',
  `reply_time` DATETIME DEFAULT NULL COMMENT '回复时间',
  `inquiry_status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0-待回复 1-已回复 2-已关闭',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_work_id` (`work_id`),
  KEY `idx_buyer_id` (`buyer_id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_inquiry_status` (`inquiry_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='询价记录表';

-- ------------------------------------------------------------
-- 25. 用户消息通知表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `user_message`;
CREATE TABLE `user_message` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '租户ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '接收用户ID',
  `msg_type` TINYINT NOT NULL COMMENT '消息类型: 1-系统通知 2-订单消息 3-交易消息 4-审核消息 5-财务消息',
  `title` VARCHAR(255) NOT NULL COMMENT '消息标题',
  `content` TEXT COMMENT '消息内容',
  `related_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联业务ID',
  `related_type` VARCHAR(64) DEFAULT NULL COMMENT '关联业务类型',
  `is_read` TINYINT NOT NULL DEFAULT 0 COMMENT '是否已读: 0-未读 1-已读',
  `read_time` DATETIME DEFAULT NULL COMMENT '阅读时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_msg_type` (`msg_type`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户消息通知表';

-- ============================================================
-- 初始化数据
-- ============================================================

-- 初始化曲风分类
INSERT INTO `music_category` (`id`, `tenant_id`, `parent_id`, `name`, `sort`, `status`) VALUES
(1, 0, 0, '流行', 1, 1),
(2, 0, 0, '摇滚', 2, 1),
(3, 0, 0, '民谣', 3, 1),
(4, 0, 0, '电子', 4, 1),
(5, 0, 0, '嘻哈说唱', 5, 1),
(6, 0, 0, '古典', 6, 1),
(7, 0, 0, '爵士', 7, 1),
(8, 0, 0, '古风', 8, 1),
(9, 0, 0, 'R&B', 9, 1),
(10, 0, 0, '乡村', 10, 1),
(11, 0, 0, '轻音乐', 11, 1),
(12, 0, 0, '影视配乐', 12, 1),
(13, 0, 0, '游戏配乐', 13, 1),
(14, 0, 0, '广告音乐', 14, 1),
(15, 0, 0, '儿童音乐', 15, 1);

-- 初始化系统配置
INSERT INTO `system_config` (`config_key`, `config_value`, `config_name`, `config_group`, `config_type`, `remark`) VALUES
('platform_name', 'MusicCopyright SaaS', '平台名称', 'basic', 'string', 'SaaS平台官方名称'),
('platform_logo', '', '平台LOGO', 'basic', 'string', '平台LOGO地址'),
('default_platform_share_ratio', '20.00', '默认平台分成比例', 'finance', 'number', '全局默认平台抽佣比例(%)'),
('default_tenant_share_ratio', '10.00', '默认租户分成比例', 'finance', 'number', '全局默认租户分成比例(%)'),
('settlement_freeze_days', '7', '结算冻结天数', 'finance', 'number', '订单支付后资金冻结天数（冷静期）'),
('min_withdrawal_amount', '10000', '最低提现金额', 'finance', 'number', '最低提现金额（分），默认100元'),
('withdrawal_fee_rate', '1.00', '提现手续费比例', 'finance', 'number', '提现手续费比例(%)'),
('withdrawal_fee_min', '100', '最低提现手续费', 'finance', 'number', '最低提现手续费（分），默认1元'),
('copyright_register_fee', '30000', '版权登记服务费', 'service', 'number', '版权登记服务费用（分），默认300元'),
('enable_release_module', '1', '音乐发行模块开关', 'module', 'boolean', '是否启用音乐发行模块：0-关闭 1-开启'),
('enable_copyright_module', '1', '版权登记模块开关', 'module', 'boolean', '是否启用版权登记模块：0-关闭 1-开启'),
('site_icp', '', 'ICP备案号', 'basic', 'string', '网站ICP备案信息'),
('site_copyright', '© 2024 MusicCopyright SaaS All Rights Reserved', '版权信息', 'basic', 'string', '网站底部版权信息'),
('contact_phone', '400-888-8888', '客服电话', 'basic', 'string', '官方客服电话'),
('contact_email', 'service@musiccopyright.com', '客服邮箱', 'basic', 'string', '官方客服邮箱'),
('audit_auto_pass', '0', '自动审核开关', 'audit', 'boolean', '作品上传后是否自动通过审核（测试用）');

-- 初始化管理员角色
INSERT INTO `admin_role` (`id`, `tenant_id`, `role_name`, `role_code`, `description`, `status`) VALUES
(1, 0, '超级管理员', 'super_admin', '拥有系统全部权限', 1),
(2, 0, '系统运维', 'ops', '系统运维管理', 1),
(3, 0, '运营管理员', 'operator', '平台运营管理', 1),
(4, 0, '版权审核员', 'copyright_auditor', '版权内容审核', 1),
(5, 0, '财务管理员', 'finance', '财务结算管理', 1);

-- 初始化权限（菜单级）
INSERT INTO `admin_permission` (`id`, `parent_id`, `permission_name`, `permission_code`, `permission_type`, `path`, `icon`, `component`, `sort`, `status`) VALUES
-- 一级菜单
(1, 0, '运营仪表盘', 'dashboard', 1, '/dashboard', 'DataLine', '/dashboard/index', 1, 1),
(2, 0, '用户管理', 'user', 1, '/user', 'User', '/user/index', 2, 1),
(3, 0, '作品管理', 'work', 1, '/work', 'Document', '/work/index', 3, 1),
(4, 0, '交易订单', 'order', 1, '/order', 'ShoppingCart', '/order/index', 4, 1),
(5, 0, '版权审核', 'copyright', 1, '/copyright', 'CircleCheck', '/copyright/index', 5, 1),
(6, 0, '内容运营', 'content', 1, '/content', 'Promotion', '/content/index', 6, 1),
(7, 0, '财务管理', 'finance', 1, '/finance', 'Money', '/finance/index', 7, 1),
(8, 0, 'SaaS租户', 'tenant', 1, '/tenant', 'Building', '/tenant/index', 8, 1),
(9, 0, '系统管理', 'system', 1, '/system', 'Setting', '/system/index', 9, 1);

-- 初始化超级管理员账号（密码: admin123，需要通过bcrypt加密）
-- 注意：实际部署时请使用bcrypt加密密码，这里先插入一个示例
INSERT INTO `admin_user` (`id`, `tenant_id`, `username`, `password`, `real_name`, `phone`, `email`, `role_id`, `status`, `created_by`) VALUES
(1, 0, 'admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '超级管理员', '13800000000', 'admin@musiccopyright.com', 1, 1, NULL);

-- 初始化角色权限关联（超级管理员拥有全部菜单权限）
INSERT INTO `admin_role_permission` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9);

-- 初始化默认租户（平台官方）
INSERT INTO `saas_tenant` (`id`, `tenant_code`, `tenant_name`, `logo_url`, `domain`, `contact_name`, `contact_phone`, `contact_email`, `revenue_share_ratio`, `status`, `remark`) VALUES
(0, 'platform', '平台官方', NULL, NULL, '官方运营', '400-888-8888', 'service@musiccopyright.com', NULL, 1, '系统内置平台租户，ID固定为0');

SET FOREIGN_KEY_CHECKS = 1;
