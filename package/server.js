"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Mr.Mao
 * @Date: 2021-07-06 09:09:31
 * @LastEditTime: 2021-07-19 21:36:41
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./middlewares");
const app = express_1.default();
app.use(middlewares_1.fontAdminMiddlewares({ path: 'fontsdb' }));
let port = 5050;
const server = app.listen(port, () => {
    console.log(`服务开启成功! 地址: http://localhost:${port}/fonts`);
});
const onError = (e) => {
    if (e.code === 'EADDRINUSE') {
        server.removeListener('error', onError);
        server.listen(++port, () => {
            console.log(`端口发生冲突! 端口更换: http://localhost:${port}/fonts`);
        });
    }
    else {
        server.removeListener('error', onError);
    }
};
server.on('error', onError);
//# sourceMappingURL=server.js.map