declare module "utils/math" {
    /**
     * 四舍五入，Number.toFixed 是四舍六入五取偶
     * @param num     [待处理数字]
     * @param decimal [需要保留的小数位]
     * @param opt     {floor: 处理精度、舍入时是否向下取“整” 默认false}
     */
    export const roundNumber: (num: number | string, decimal?: number, opt?: {
        floor?: boolean | undefined;
    } | undefined) => number;
    /**
     * 数值向下取“整”，包括处理精度时
     * @param num     [待处理数字]
     * @param decimal [需要保留的小数位]
     */
    export const floorNumber: (num: number | string, decimal?: number) => number;
}
declare module "utils/storage" {
    interface StorageOptions {
        /**
         * 有效期，毫秒
         */
        expired?: number;
        /**
         * 是否仅存运行时，采用 sesstionStorage
         */
        runTime?: boolean;
    }
    /**
     * 本地存储-存
     * @param {String} k key
     * @param {any} data
     * @param {Object} options StorageOptions
     */
    export function setStorage(k: string, data: any, options?: StorageOptions): void;
    /**
     * 本地存储-取
     * @param {String} k key
     * @param {Object} options StorageOptions
     * @returns any
     */
    export function getStorage(k: string, options?: StorageOptions): any;
    /**
     * 移除某一项本地存储
     * @param k key
     * @param options StorageOptions
     */
    export function removeStorage(k: string, options?: StorageOptions): void;
    /**
     * 清空本地存储
     * @param options StorageOptions
     */
    export function clearStorage(options?: StorageOptions): void;
}
declare module "utils/system" {
    interface SystemInfo {
        devicePixelRatio: number;
        language: string;
        windowHeight: number;
        windowWidth: number;
        isMac: boolean;
        isIos: boolean;
        isWeixin: boolean;
        isAlipay: boolean;
    }
    export function getSystemInfo(): SystemInfo;
    /**
     * 拨打电话
     * @param phone 电话号码
     */
    export function makingCall(phone: string): void;
}
declare module "utils/util" {
    /**
     * 字符串（连字符）转驼峰格式
     * @param str 待转换的字符串
     * @param pascal 帕斯卡，是否转为大驼峰，即首字母也大写
     */
    export function camelize(str: string, pascal?: boolean): string;
    /**
     * 字符串（驼峰）转连字符
     * @param str 待转换的字符串
     */
    export function kebabCase(str: string): string;
    /**
     * 节流函数
     */
    export function throttle(fn: Function, wait?: number): (...args: any) => void;
    /**
     * 防抖函数
     */
    export function debounce(fn: Function, wait?: number, immediate?: boolean): (...args: any) => any;
    /**
     * 转换颜色值为 rgba
     * @description 推荐使用 TinyColor 库：https://github.com/scttcper/tinycolor
     * @param color 要转换的色值，目前支持十六进制、rgb、rgba
     * @param opacity rgba 的 a
     * @returns color
     */
    export function colorRgba(color: string, opacity?: number): string | undefined;
    /**
     * 从日期字符串获取 Date
     * @param {String} datetimeStr 日期时间 2021-12-17 02:16:16 | 2022-01-01T00:00:00+08:00
     * @returns Date
     */
    export function dateFromString(datetimeStr: string): Date;
    /**
     * 给数字补齐长度
     * @param n 数字
     * @param width 位数，也就是最终字符串的长度
     * @param opt { right: 是否从右侧补, sign: 默认补0 }
     */
    export function padNumber(n: number, width?: number, opt?: {
        right?: boolean;
        sign?: string;
    }): string;
    /**
     * 格式化日期
     * @param date 日期Date
     * @param opt { format: YYYY-MM-DD HH:mm:ss 目前只支持删减、改符号 }
     */
    export function formatDate(date: Date, opt?: {
        format?: string;
    }): string;
    /**
     * 把数字转换成三位逗号分隔的字符串(最多支持小数点三位)
     * @param n 要转化的数字
     * @returns 123,231
     */
    export const partNumber: (n: number | string) => string;
    /**
     * 把时间差转化成具体的倒计时时间
     * @param time 时间差
     * @param hasDays 是否显示天
     * @returns
     */
    export const parseTimeData: (time: number, hasDays?: boolean) => {
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
        milliseconds: number;
    };
}
declare module "utils/check" {
    /**
     * 是否是一个Promise
     * @param it 要判断的变量
     * @returns true | false
     */
    export function isPromiseLike<T>(it: unknown): it is PromiseLike<T>;
    /**
     * 校验手机号
     * @param phone
     */
    export function validatePhoneNumber(phone: string): boolean;
    /**
     * 判断是否是浏览器环境
     */
    export const inBrowser: boolean;
}
declare module "utils/clipboard" {
    export const setClipboard: (txt: string) => Promise<void>;
}
declare module "utils/weixin" {
    global {
        interface Window {
            wx?: any;
        }
    }
    export interface WxSdkConfigData {
        config: Record<string, any>;
        shareData?: {
            link: string;
            title: string;
            desc: string;
            imgUrl: string;
        };
    }
    export type WxSdkDataGetter = (params: {
        url: string;
        sdkLoadedUrl: string | false;
    }) => WxSdkConfigData | Promise<WxSdkConfigData>;
    /**
     * useWxSdk 单例
     * @param opt {
     *   dataGetter: 配置数据获取器（函数），会收到两个参数：
     *     sdkLoadedUrl：为字符串有值时，请求 wxjssdk 时的 url 用这个
     *     url：当前页面 url
     *     dataGetter 请求 wxjssdk 时的 url 一般可以为 sdkLoadedUrl || url，后者可以自定义
     *
     *   sdkLoadedUrl?: 自定义手动加载 wxjssdk 文件，加载文件时的页面 url，默认 useWxSdk 自动加载
     * }
     * @returns wx.ready 完成了
     */
    export const useWxSdk: (opt?: {
        dataGetter?: WxSdkDataGetter | undefined;
        sdkLoadedUrl?: string | undefined;
    } | undefined) => {
        configWxSdk: () => Promise<unknown>;
        onConfigReady: (fn: Function, opt?: {
            url: string;
        } | undefined) => void;
        removeReadyCallback: (fn: Function, opt?: {
            url: string;
        } | undefined) => void;
    };
}
declare module "utils/compressImage" {
    /**
     * 压缩图片
     * @param file 文件
     * @param damaged 压缩率
     * @returns file
     */
    export const compressImage: (file: File, damaged?: number) => Promise<{
        file: File;
    }>;
}
declare module "utils/index" {
    export * from "utils/math";
    export * from "utils/storage";
    export * from "utils/system";
    export * from "utils/util";
    export * from "utils/check";
    export * from "utils/clipboard";
    export * from "utils/weixin";
    export * from "utils/compressImage";
}
declare module "byn-utils" {
    export * from "utils/index";
}
