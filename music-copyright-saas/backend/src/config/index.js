require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'music_copyright_saas',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
  },

  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: Number(process.env.REDIS_DB) || 0,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'music_copyright_saas_2024_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    adminExpiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '24h',
  },

  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: Number(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024,
    allowedAudioExt: (process.env.ALLOWED_AUDIO_EXT || 'mp3,wav,flac,m4a').split(','),
    allowedImageExt: (process.env.ALLOWED_IMAGE_EXT || 'jpg,jpeg,png,gif,webp').split(','),
    allowedDocExt: (process.env.ALLOWED_DOC_EXT || 'pdf,doc,docx').split(','),
  },

  oss: {
    provider: process.env.OSS_PROVIDER || 'local',
    aliyun: {
      accessKeyId: process.env.OSS_ALIYUN_ACCESS_KEY_ID || '',
      accessKeySecret: process.env.OSS_ALIYUN_ACCESS_KEY_SECRET || '',
      region: process.env.OSS_ALIYUN_REGION || '',
      bucket: process.env.OSS_ALIYUN_BUCKET || '',
    },
  },

  finance: {
    defaultPlatformShareRatio: Number(process.env.DEFAULT_PLATFORM_SHARE_RATIO) || 20,
    defaultTenantShareRatio: Number(process.env.DEFAULT_TENANT_SHARE_RATIO) || 10,
    settlementFreezeDays: Number(process.env.SETTLEMENT_FREEZE_DAYS) || 7,
    minWithdrawalAmount: Number(process.env.MIN_WITHDRAWAL_AMOUNT) || 10000,
    withdrawalFeeRate: Number(process.env.WITHDRAWAL_FEE_RATE) || 1,
    withdrawalFeeMin: Number(process.env.WITHDRAWAL_FEE_MIN) || 100,
    copyrightRegisterFee: Number(process.env.COPYRIGHT_REGISTER_FEE) || 30000,
  },

  modules: {
    enableReleaseModule: process.env.ENABLE_RELEASE_MODULE === '1',
    enableCopyrightModule: process.env.ENABLE_COPYRIGHT_MODULE === '1',
  },
};

module.exports = config;
