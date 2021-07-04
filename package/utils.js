"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.archiverLogger = exports.generateSvgCahes = void 0;
/*
 * @Author: Mr.Mao
 * @Date: 2021-06-30 14:22:24
 * @LastEditTime: 2021-07-02 10:21:26
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const utils = require('nodejs-fs-utils');
/**
 * 根据配置生成 SVG 缓存目录
 * @param svgsObject
 */
const generateSvgCahes = (fonts) => {
    const dirPath = path_1.default.resolve(__dirname, './caches');
    utils.emptyDirSync(dirPath);
    fonts.forEach(({ value, key }) => {
        fs_1.default.writeFileSync(path_1.default.resolve(dirPath, `${key}.svg`), value, { flag: 'w' });
    });
};
exports.generateSvgCahes = generateSvgCahes;
/**
 * 输出压缩打印
 * @param output
 * @param archive
 */
const archiverLogger = (output, archive) => {
    // 文件输出流结束
    output.on('close', () => {
        console.log(`总共 ${archive.pointer()} 字节`);
        console.log('archiver完成文件的归档，文件输出流描述符已关闭');
    });
    // 数据源是否耗尽
    output.on('end', () => {
        console.log('数据源已耗尽');
    });
    // 存档警告
    archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
            console.warn('stat故障和其他非阻塞错误');
        }
        else {
            throw err;
        }
    });
    // 存档出错
    archive.on('error', (err) => {
        throw err;
    });
};
exports.archiverLogger = archiverLogger;
//# sourceMappingURL=utils.js.map