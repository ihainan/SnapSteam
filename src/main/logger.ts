import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { app } from 'electron';

// 获取日志目录
const logDir = path.join(app.getPath('userData'), 'logs');

// 创建日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// 创建日志记录器
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    // 控制台输出
    new winston.transports.Console({
      level: 'info',
    }),
    // 文件输出，每天轮转
    new winston.transports.DailyRotateFile({
      level: 'info',
      dirname: logDir,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '5m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  ],
});

export default logger; 