import { Plugin } from 'vite';
export * from './middlewares';
interface FontsPluginOption {
    path?: string;
    fontName?: string;
    classNamePrefix?: string;
    css?: boolean;
    base64?: boolean;
}
export declare const ViteFontsAdmin: (option?: FontsPluginOption | undefined) => Plugin;
