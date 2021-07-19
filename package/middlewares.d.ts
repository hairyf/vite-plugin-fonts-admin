import express from 'express';
interface FontsPluginOption {
    path?: string;
    fontName?: string;
    classNamePrefix?: string;
    css?: boolean;
    base64?: boolean;
}
interface GenerateFontsOption extends FontsPluginOption {
    groups?: (number | string)[];
    target?: string;
    outTarget?: string;
}
export declare const fontAdminMiddlewares: (option?: FontsPluginOption) => express.Express & {
    font: {
        generateFonts: (defaultOption?: GenerateFontsOption) => Promise<string | undefined>;
        targetPath: string;
        optionPath: string;
    };
};
export {};
