const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const ResponseUtil = require('../utils/response');
const config = require('../config');

class UploadController {
  /**
   * 上传图片
   */
  static async uploadImage(ctx) {
    const file = ctx.request.files?.file;
    if (!file) {
      return ResponseUtil.fail(ctx, '请选择要上传的文件');
    }

    const ext = path.extname(file.originalFilename || file.name).toLowerCase();
    const allowedExt = config.upload.allowedImageExt.map(e => '.' + e);
    if (!allowedExt.includes(ext)) {
      return ResponseUtil.fail(ctx, `不支持的图片格式，支持：${allowedExt.join(', ')}`);
    }

    if (file.size > config.upload.maxFileSize) {
      return ResponseUtil.fail(ctx, '文件大小超出限制');
    }

    const dateDir = new Date().toISOString().split('T')[0];
    const uploadDir = path.join(config.upload.dir, 'images', dateDir);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${nanoid(16)}${ext}`;
    const filepath = path.join(uploadDir, filename);

    const reader = fs.createReadStream(file.filepath || file.path);
    const writer = fs.createWriteStream(filepath);
    reader.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const url = `/uploads/images/${dateDir}/${filename}`;
    ResponseUtil.success(ctx, { url, filename }, '上传成功');
  }

  /**
   * 上传音频
   */
  static async uploadAudio(ctx) {
    const file = ctx.request.files?.file;
    if (!file) {
      return ResponseUtil.fail(ctx, '请选择要上传的文件');
    }

    const ext = path.extname(file.originalFilename || file.name).toLowerCase();
    const allowedExt = config.upload.allowedAudioExt.map(e => '.' + e);
    if (!allowedExt.includes(ext)) {
      return ResponseUtil.fail(ctx, `不支持的音频格式，支持：${allowedExt.join(', ')}`);
    }

    if (file.size > config.upload.maxFileSize) {
      return ResponseUtil.fail(ctx, '文件大小超出限制');
    }

    const dateDir = new Date().toISOString().split('T')[0];
    const uploadDir = path.join(config.upload.dir, 'audio', dateDir);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${nanoid(16)}${ext}`;
    const filepath = path.join(uploadDir, filename);

    const reader = fs.createReadStream(file.filepath || file.path);
    const writer = fs.createWriteStream(filepath);
    reader.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const url = `/uploads/audio/${dateDir}/${filename}`;
    ResponseUtil.success(ctx, { url, filename, size: file.size }, '上传成功');
  }

  /**
   * 上传文档/证书
   */
  static async uploadDoc(ctx) {
    const file = ctx.request.files?.file;
    if (!file) {
      return ResponseUtil.fail(ctx, '请选择要上传的文件');
    }

    const ext = path.extname(file.originalFilename || file.name).toLowerCase();
    const allowedExt = [...config.upload.allowedDocExt.map(e => '.' + e), ...config.upload.allowedImageExt.map(e => '.' + e)];
    if (!allowedExt.includes(ext)) {
      return ResponseUtil.fail(ctx, `不支持的文件格式`);
    }

    const dateDir = new Date().toISOString().split('T')[0];
    const uploadDir = path.join(config.upload.dir, 'certificates', dateDir);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${nanoid(16)}${ext}`;
    const filepath = path.join(uploadDir, filename);

    const reader = fs.createReadStream(file.filepath || file.path);
    const writer = fs.createWriteStream(filepath);
    reader.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const url = `/uploads/certificates/${dateDir}/${filename}`;
    ResponseUtil.success(ctx, { url, filename }, '上传成功');
  }
}

module.exports = UploadController;
