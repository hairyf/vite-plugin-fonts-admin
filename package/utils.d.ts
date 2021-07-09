import fs from 'fs';
import archiver from 'archiver';
interface FontOption {
    value: string;
    key: string;
    group: number;
}
/**
 * 根据配置生成 SVG 缓存目录
 * @param svgsObject
 */
export declare const generateSvgCahes: (fonts: FontOption[]) => Promise<void>;
/**
 * 输出压缩打印
 * @param output
 * @param archive
 */
export declare const archiverLogger: (output: fs.WriteStream, archive: archiver.Archiver) => void;
export {};
