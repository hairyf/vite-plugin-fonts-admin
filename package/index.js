"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViteFontsAdmin = void 0;
/*
 * @Author: Mr.Mao
 * @Date: 2021-07-06 09:09:31
 * @LastEditTime: 2021-07-19 20:50:36
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
const middlewares_1 = require("./middlewares");
const lodash_1 = require("lodash");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
__exportStar(require("./middlewares"), exports);
const utils = require('nodejs-fs-utils');
const ViteFontsAdmin = (option) => {
    let watcher;
    const pluginOption = {
        name: 'vite-fonts-admin',
        configureServer: (server) => {
            const app = middlewares_1.fontAdminMiddlewares(option);
            server.middlewares.use(app);
            const generateFonts = lodash_1.debounce(() => app.font.generateFonts({ target: path_1.default.resolve(app.font.optionPath, '/fonts') }), 50);
            watcher = fs_1.default.watch(app.font.optionPath, generateFonts);
        },
        buildEnd: () => { var _a; return (_a = watcher === null || watcher === void 0 ? void 0 : watcher.close) === null || _a === void 0 ? void 0 : _a.call(watcher); }
    };
    return pluginOption;
};
exports.ViteFontsAdmin = ViteFontsAdmin;
//# sourceMappingURL=index.js.map