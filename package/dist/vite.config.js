"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Mr.Mao
 * @Date: 2021-06-28 14:36:00
 * @LastEditTime: 2021-07-02 22:40:45
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
const vite_1 = require("vite");
const _1 = __importDefault(require("./"));
exports.default = vite_1.defineConfig({
    plugins: [
        _1.default({
            dir: 'VSvg',
            base64: true
        })
    ]
});
//# sourceMappingURL=vite.config.js.map