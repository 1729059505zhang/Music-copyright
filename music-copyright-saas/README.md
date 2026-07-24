# 音乐版权SaaS平台 - MusicCopyright

一套完整的音乐版权生态SaaS全栈系统，对标TME数字音乐版权管理平台，面向音乐全产业链提供词曲版权交易、音乐作品发行、版权登记存证一站式服务。

> **重要声明**：本系统**不包含、不预留**任何AI作词、AI作曲、AI生成歌曲相关功能、页面、接口、数据表。核心业务为人工创作的词曲版权交易与管理。

---

## 一、系统架构

### 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端 | Vue3 + Vite + Element Plus + Pinia + Vue Router + Axios |
| 后端 | Node.js + Koa2 + Sequelize ORM + JWT |
| 数据库 | MySQL 8.0 + Redis |
| 文件存储 | 本地存储（兼容阿里云OSS） |

### 六大独立访问端口

| 端口 | 名称 | 说明 | 默认开发端口 |
|------|------|------|-------------|
| 1 | SaaS官方宣传落地网站 | 公网访问，品牌展示、业务介绍、入驻引导 | 5174 |
| 2 | 采购方门户（买家端） | 企业/品牌/传媒采购词曲 | 5175 |
| 3 | 创作者工作台（卖家端） | 音乐人/唱片公司/MCN管理作品与收益 | 5176 |
| 4 | 版权审核端 | 版权审核员专用，内容审核与登记 | 5177 |
| 5 | 运营管理端 | 平台运营人员使用 | 5173（admin-console） |
| 6 | 系统管理&运维端 | 超级管理员，SaaS运维与配置 | 5173（admin-console，通过权限区分） |

### 项目目录结构

```
music-copyright-saas/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── app.js           # 应用入口
│   │   ├── config/          # 配置文件
│   │   ├── controllers/     # 控制器层
│   │   ├── services/        # 业务服务层
│   │   ├── models/          # 数据模型层
│   │   ├── routes/          # 路由层
│   │   ├── middleware/      # 中间件
│   │   └── utils/           # 工具函数
│   ├── uploads/             # 上传文件目录
│   ├── logs/                # 日志目录
│   ├── .env.example         # 环境变量模板
│   └── package.json
│
├── frontend/
│   ├── official-site/       # 1. 官方宣传网站
│   ├── buyer-portal/        # 2. 采购方门户
│   ├── creator-portal/      # 3. 创作者工作台
│   ├── copyright-audit/     # 4. 版权审核端
│   └── admin-console/       # 5/6. 运营/系统管理端
│
├── database/
│   └── init.sql             # MySQL初始化脚本
│
└── README.md
```

---

## 二、本地环境部署

### 前置要求

- Node.js >= 16.0.0
- MySQL >= 8.0
- Redis >= 6.0
- npm >= 8.0.0

### 第一步：数据库初始化

1. 创建数据库

```sql
CREATE DATABASE music_copyright_saas DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 执行初始化脚本

```bash
mysql -u root -p music_copyright_saas < database/init.sql
```

> 初始化脚本包含：25张业务表 + 基础种子数据（曲风分类、系统配置、管理员角色、默认租户、超级管理员账号等）

### 第二步：后端服务启动

1. 进入后端目录

```bash
cd backend
```

2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，修改数据库连接信息、Redis连接信息等。

3. 安装依赖

```bash
npm install
```

4. 启动服务

```bash
npm run dev
```

服务默认启动在 `http://localhost:3000`

### 第三步：前端项目启动

系统包含5个独立前端项目，按需启动。

#### 1. 官方宣传网站

```bash
cd frontend/official-site
npm install
npm run dev
```
访问地址：`http://localhost:5174`

#### 2. 采购方门户（买家端）

```bash
cd frontend/buyer-portal
npm install
npm run dev
```
访问地址：`http://localhost:5175`

#### 3. 创作者工作台（卖家端）

```bash
cd frontend/creator-portal
npm install
npm run dev
```
访问地址：`http://localhost:5176`

#### 4. 版权审核端

```bash
cd frontend/copyright-audit
npm install
npm run dev
```
访问地址：`http://localhost:5177`

#### 5. 运营/系统管理端

```bash
cd frontend/admin-console
npm install
npm run dev
```
访问地址：`http://localhost:5173`

---

## 三、各端口访问与账号说明

### 默认账号

| 系统 | 账号 | 密码 | 说明 |
|------|------|------|------|
| 运营管理端 | admin | 123456 | 超级管理员 |
| 运营管理端 | operator | 123456 | 运营人员 |
| 版权审核端 | auditor | 123456 | 版权审核员 |

> 以上为初始化脚本中的默认账号，生产环境请务必修改密码。

### 各端口功能详解

#### 1. SaaS官方宣传落地网站

面向公网访客，展示平台品牌与业务：

- **首页**：品牌介绍、三大核心服务、合作客户案例、入驻分流入口
- **业务详情页**：词曲授权交易、音乐发行服务、版权登记服务介绍
- **授权方案页**：非商用授权、商用授权、独家授权、全版权买断说明
- **机构入驻页**：唱片公司、MCN、音乐工作室入驻指引
- **帮助中心**：FAQ、版权科普
- **其他**：商务合作、联系我们、用户协议、隐私政策、版权声明

#### 2. 采购方门户（买家端）

面向企业采购用户：

- **认证**：注册、登录、企业资质实名认证
- **词曲交易集市**：多维度筛选（曲风、调性、BPM、适用场景、价格区间等）、全文检索
- **作品详情**：Demo音频片段试听、多种授权套餐选择、版权协议预览、询价、购买
- **用户中心**：
  - 我的订单、已采购词曲
  - 电子版权授权凭证下载
  - 收藏词曲、询价记录
  - 账户余额、发票申请
  - 消息通知、企业信息管理

#### 3. 创作者工作台（卖家端）

面向音乐人、唱片公司、MCN机构：

- **入驻管理**：资质资料提交、平台审核
- **作品管理**：
  - 词曲作品上传（标题、曲风、歌词、曲谱、Demo、授权定价）
  - 明码标价 / 仅询价两种模式
  - 上架、下架、编辑管理
  - 发行作品管理（后台总开关控制）
- **交易台账**：订单记录、买家信息、成交明细
- **收益中心**：
  - 销售流水、分账明细
  - 可提现余额、提现申请
  - 收款账户管理
- **版权业务**：词曲版权登记申请
- **机构管理**：子账号管理（机构角色）

#### 4. 版权审核端

面向专职版权审核岗位：

- **审核概览**：工作台数据统计
- **作品审核**：词曲作品内容预审、发行作品合规审核
- **版权登记**：登记申请材料核验、版权存证登记
- **证书管理**：电子版权证书生成、管理、补发
- **风险筛查**：违规作品驳回、记录驳回原因
- **版权档案**：全平台版权档案检索、数据导出

#### 5. 运营管理端

面向平台运营人员：

- **运营仪表盘**：平台数据统计、订单趋势图表
- **用户主体管理**：采购方资质审核、音乐人/机构入驻审核
- **作品管理**：词曲管理、发行作品管理、曲风分类维护、违规作品管控
- **订单交易管理**：订单查询、退款受理、交易纠纷协调
- **内容运营**：官网公告、资讯管理、帮助中心维护
- **消息管理**：用户消息、询价消息统一管理

#### 6. 系统管理&运维端

面向超级管理员（包含在admin-console中，通过权限区分）：

- **SaaS租户管理**：创建/启停租户、品牌配置、独立分成策略
- **全局财务配置**：抽佣比例、结算冻结周期、最低提现金额等
- **财务中心**：提现终审、全平台营收报表、分账记录导出
- **第三方API配置**：支付网关、OSS、版权存证、音频审核接口配置
- **系统功能总开关**：音乐发行模块、版权登记模块一键开关
- **RBAC权限系统**：角色管理、菜单/按钮级权限控制
- **系统运维**：登录日志、操作日志、缓存管理、系统参数配置
- **管理员管理**：后台账号新增、启用、禁用

---

## 四、业务规则说明

### 交易与资金

1. **订单状态流转**：待支付 → 已支付待结算 → 交易完成 → 已取消 / 已退款
2. **支付方式**：站内余额支付（预留微信支付、支付宝接口），本地开发支持模拟支付
3. **资源权限**：未购买仅可试听音频片段；支付成功后解锁完整歌词、曲谱、完整Demo下载
4. **结算机制**：订单支付成功资金进入冻结池，7天冷静期结束无纠纷自动分账
5. **分账策略**：全局默认分成比例，支持单独设置音乐人、机构、租户差异化分成
6. **金额计算**：强制使用分为整数单位，杜绝浮点数精度错误
7. **资金流水**：所有资金收支行为生成永久不可删除资金流水，数据库事务保障一致性

### SaaS多租户

- 所有业务表均含 `tenant_id` 字段，实现租户数据逻辑隔离
- 支持独立域名、品牌贴牌、差异化分成策略
- 租户之间无法互相访问对方作品、用户信息、交易数据

### 权限体系

- RBAC精细化权限：超级管理员、运维、运营、版权审核员等角色
- 菜单级、按钮级权限控制
- 各岗位严格隔离：版权审核人员无法修改财务配置，运营人员无法操作底层运维参数

---

## 五、服务器上线部署

### 后端部署

1. 安装PM2

```bash
npm install -g pm2
```

2. 构建生产配置

```bash
cd backend
cp .env.example .env
# 修改为生产环境配置
```

3. 启动服务

```bash
pm2 start src/app.js --name music-copyright-backend
```

### 前端部署

以官方网站为例，其他前端项目同理：

```bash
cd frontend/official-site
npm install
npm run build
```

将 `dist` 目录部署到Nginx，示例配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 文件存储

生产环境建议使用阿里云OSS：

1. 在 `.env` 中设置 `STORAGE_TYPE=oss`
2. 配置OSS的AccessKey、Bucket、Region等信息
3. 后端已封装好存储接口，切换存储方式无需修改业务代码

---

## 六、开发规范

### 后端规范

- RESTful API 设计
- 分层架构：路由层 → 控制器层 → 服务层 → 模型层
- 统一异常处理与响应格式
- 完整中文注释
- 数据库操作使用 Sequelize ORM
- 财务相关操作强制使用数据库事务

### 前端规范

- Vue3 Composition API + script setup
- 组件化开发，Element Plus 为基础UI库
- Pinia 状态管理
- 路由懒加载
- scoped scss 样式隔离

---

## 七、数据库表清单

| 表名 | 说明 |
|------|------|
| saas_tenant | 租户信息表 |
| users | 用户基础表 |
| creator_accounts | 创作者主体表 |
| creator_sub_account | 机构子账号表 |
| music_lyric_work | 词曲作品主表 |
| music_release_work | 发行作品表 |
| work_license_package | 授权套餐配置表 |
| music_category | 曲风分类表 |
| copyright_apply | 版权登记申请表 |
| copyright_certificate | 电子版权凭证表 |
| orders | 订单主表 |
| order_item | 订单明细表 |
| financial_flow | 全站资金流水表 |
| settlement_record | 分账结算记录表 |
| withdrawal_apply | 创作者提现申请表 |
| collection | 用户收藏表 |
| admin_user | 后台管理员账号 |
| admin_role | 后台角色表 |
| admin_permission | 权限表 |
| system_config | 全局系统配置 |
| third_api_config | 第三方API配置表 |
| operation_log | 后台操作日志表 |

---

## 八、注意事项

1. **AI功能约束**：本系统严格禁止开发任何AI作词、AI作曲、歌曲生成相关功能。第三方API配置模块严禁接入任何AI音乐生成接口。
2. **数据安全**：生产环境请务必修改JWT密钥、数据库密码、管理员默认密码。
3. **资金安全**：财务相关操作均已实现事务保障，请勿绕过Service层直接操作数据库。
4. **版权合规**：平台仅提供交易撮合服务，作品版权权属由上传者负责。建议对接第三方版权存证机构增强法律效力。

---

## 九、技术支持

如遇部署或开发问题，请参考以下资源：

- 后端日志：`backend/logs/`
- 数据库初始化脚本：`database/init.sql`
- 环境变量模板：`backend/.env.example`
