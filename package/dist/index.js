"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Mr.Mao
 * @Date: 2021-06-29 16:57:51
 * @LastEditTime: 2021-07-02 22:38:21
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
const express_1 = __importDefault(require("express"));
const json_server_1 = __importDefault(require("json-server"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const svgtofont_1 = __importDefault(require("svgtofont"));
const lodash_1 = require("lodash");
const axios_1 = __importDefault(require("axios"));
const archiver_1 = __importDefault(require("archiver"));
const utils_1 = require("./utils");
const multer_1 = __importDefault(require("multer"));
const utils = require('nodejs-fs-utils');
/**
 * 开启 ViteFontsPlugin 服务
 * @param option
 * @returns {Plugin}
 */
const ViteFontsPlugin = (option = {}) => {
    const app = express_1.default();
    const dirPath = option.dir || 'src/VSvg';
    const pluginHtmlPath = path_1.default.join(__dirname, './public/index.html');
    const optionPath = `${dirPath}/index.json`;
    const fontsPath = path_1.default.resolve(dirPath, 'fonts');
    const cachesPath = path_1.default.resolve(__dirname, 'caches');
    // 初始化服务器配置
    const initServerStart = (server) => {
        const { host, port } = server.config.server;
        axios_1.default.defaults['baseURL'] = `http://${host || 'localhost'}:${port || 3000}/json`;
        // 假如 fonts 为空, 同步 fonts
        if (!fs_1.default.existsSync(fontsPath)) {
            utils.mkdirsSync(fontsPath);
            syncSvgToFonts();
        }
        if (!fs_1.default.existsSync(cachesPath)) {
            utils.mkdirsSync(cachesPath);
        }
    };
    // 判断路径是否存在 / 符合创建环境
    try {
        fs_1.default.readFileSync(optionPath);
    }
    catch (error) {
        utils.mkdirsSync(dirPath);
        fs_1.default.writeFileSync(optionPath, '{ "group": [], "fonts": [] }', { flag: 'w' });
    }
    // 进行同步 fonts 配置
    const syncSvgToFonts = lodash_1.debounce(async () => {
        try {
            const { data: fonts } = await axios_1.default.get('/fonts');
            if (!fonts.length)
                return undefined;
            utils_1.generateSvgCahes(fonts);
            await svgtofont_1.default({
                src: path_1.default.resolve(__dirname, './caches'),
                dist: fontsPath,
                fontName: option.fontName,
                classNamePrefix: option.classNamePrefix,
                css: typeof option.css === 'undefined' || option.css,
            });
            if (option.base64) {
                // 生成 base64
                const ttfBase64 = fs_1.default.readFileSync(path_1.default.resolve(fontsPath, 'iconfont.ttf'), 'base64');
                const css = fs_1.default.readFileSync(path_1.default.resolve(fontsPath, 'iconfont.css'), 'utf-8');
                const replaceCss = css.replace(/\@font-face \{([\s\S]*)\*\/\n\}/, `\
@font-face { font-family: "iconfont"; src: url('data:font/woff2;charset=utf-8;base64,${ttfBase64}') format('truetype'); }\
    `);
                fs_1.default.writeFileSync(path_1.default.resolve(fontsPath, 'iconfont.base64.css'), replaceCss);
            }
        }
        catch (error) {
            console.log('同步失败', error);
        }
    }, 100);
    // 配置静态资源访问
    app.use('/fonts', express_1.default.static(path_1.default.resolve(__dirname, 'public')));
    // 配置 josn-server 服务
    app.use('/json', json_server_1.default.router(optionPath));
    app.use('/json-default', json_server_1.default.defaults());
    // 导出 Fonts
    app.get('/out-fonts', async (req, res) => {
        try {
            const ids = req.query.ids;
            const prefix = req.query.prefix;
            const groupFonts = await Promise.all(ids.map(v => {
                return axios_1.default
                    .get('/fonts', { params: { group: v } })
                    .then(v => v.data);
            }));
            const fonts = groupFonts.flat(1);
            if (!fonts.length)
                return res.status(401).send('暂无图标!');
            utils_1.generateSvgCahes(fonts);
            const distPath = path_1.default.resolve(__dirname, 'iconfont');
            const compressPath = path_1.default.resolve(__dirname, 'compress/iconfont.zip');
            utils.mkdirsSync(distPath);
            utils.mkdirsSync(path_1.default.resolve(__dirname, 'compress'));
            await svgtofont_1.default({
                src: cachesPath,
                dist: distPath,
                classNamePrefix: prefix,
                css: true
            });
            const typeKeys = fonts.map(v => `'${v.key}'`).join(' | ').trim();
            fs_1.default.writeFileSync(path_1.default.resolve(distPath, 'iconfont.key.ts'), `export type IconfontKey = ${typeKeys || 'string'}`);
            // 生成 base64
            const ttfBase64 = fs_1.default.readFileSync(path_1.default.resolve(distPath, 'iconfont.ttf'), 'base64');
            const css = fs_1.default.readFileSync(path_1.default.resolve(distPath, 'iconfont.css'), 'utf-8');
            const replaceCss = css.replace(/\@font-face \{([\s\S]*)\*\/\n\}/, `\
@font-face { font-family: "iconfont"; src: url('data:font/woff2;charset=utf-8;base64,${ttfBase64}') format('truetype'); }\
    `);
            fs_1.default.writeFileSync(path_1.default.resolve(distPath, 'iconfont.base64.css'), replaceCss);
            // 创建文件流, 压缩打包, 完成归档
            const output = fs_1.default.createWriteStream(compressPath);
            const archive = archiver_1.default("zip", {
                zlib: { level: 9 }
            });
            utils_1.archiverLogger(output, archive);
            archive.directory(distPath, false);
            archive.pipe(output);
            archive.finalize();
            output.on('close', () => {
                res.sendFile(compressPath);
            });
        }
        catch (error) {
            console.log('导出失败', error);
        }
    });
    // 配置上传, 导入多个 svg
    const upload = multer_1.default({
        fileFilter: (req, file, callback) => {
            const ext = path_1.default.extname(file.originalname);
            callback(null, ext === '.svg');
        }
    });
    // 接收上传 svg
    app.post('/upload-svgs', upload.array('files', 20), async (req, res) => {
        try {
            const multerFiles = req.files;
            const group = JSON.parse(req.body.group);
            const isRetainColor = JSON.parse(req.body.isRetainColor);
            await Promise.all(multerFiles
                .map(v => ({
                key: v.originalname.split('.')[0],
                value: v.buffer.toString(),
                group
            }))
                .map(v => {
                if (!isRetainColor) {
                    v.value = v.value.replace(/fill="(\w*%?)"/g, `fill="${'currentColor'}"`);
                }
                return v;
            })
                .map(v => axios_1.default.post('/fonts', v)));
        }
        catch (error) {
            console.log('上传失败', error);
        }
        res.send('上传完毕!');
    });
    // 监听配置变化, 同步 fonts
    const fSWatcher = fs_1.default.watch(optionPath, syncSvgToFonts);
    const result = {
        name: 'vite-plugin-svgs',
        configureServer: (server) => {
            server.middlewares.use(app);
            setTimeout(() => initServerStart(server));
        },
        buildEnd() {
            fSWatcher.close();
        }
    };
    return result;
};
exports.default = ViteFontsPlugin;
//# sourceMappingURL=index.js.map