/** 
 * Request 网络请求工具 - 采用原生 Fetch 实现以替换 umi-request
 * 解决环境中缺失 umi-request 依赖的问题
 */
import { notification, message } from 'antd';
import { redirectToLogin } from './utils';
import {
  CommonResponseIWrapper,
  ResponseParameterPagination,
} from '@/services/typing';
import { errCodeMessage } from './errCodeMessage';

const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 模拟 ResponseError
export class ResponseError extends Error {
  response: Response;
  data: any;
  constructor(response: Response, text: string, data?: any) {
    super(text);
    this.name = 'ResponseError';
    this.response = response;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  prefix?: string;
  timeout?: number;
  errorHandler?: (error: ResponseError) => Promise<never>;
  params?: any;
  data?: any;
  getResponse?: boolean;
}

type InterceptorRequest = (url: string, options: RequestOptions) => { url: string; options: RequestOptions };
type InterceptorResponse = (response: Response, options: RequestOptions) => Response | Promise<Response>;

class RequestInstance {
  options: RequestOptions;
  interceptors = {
    request: {
      use: (fn: InterceptorRequest) => { this.requestInterceptors.push(fn); }
    },
    response: {
      use: (fn: InterceptorResponse) => { this.responseInterceptors.push(fn); }
    }
  };
  private requestInterceptors: InterceptorRequest[] = [];
  private responseInterceptors: InterceptorResponse[] = [];

  constructor(options: RequestOptions = {}) {
    this.options = options;
  }

  async request(url: string, options: RequestOptions = {}) {
    const mergedOptions = { ...this.options, ...options, headers: { ...this.options.headers, ...options.headers } };
    let currentUrl = url;
    let currentOptions = mergedOptions;

    // 前缀处理
    if (currentOptions.prefix && !currentUrl.startsWith('http')) {
      currentUrl = `${currentOptions.prefix}${currentUrl}`;
    }

    // 参数处理 (Query Params)
    if (currentOptions.params) {
      const query = new URLSearchParams(currentOptions.params).toString();
      currentUrl = currentUrl.includes('?') ? `${currentUrl}&${query}` : `${currentUrl}?${query}`;
    }

    // Body处理
    if (currentOptions.data && !currentOptions.body) {
      currentOptions.body = JSON.stringify(currentOptions.data);
      if (!currentOptions.headers['Content-Type']) {
        (currentOptions.headers as any)['Content-Type'] = 'application/json';
      }
    }

    // 执行请求拦截器
    for (const interceptor of this.requestInterceptors) {
      const res = interceptor(currentUrl, currentOptions);
      currentUrl = res.url;
      currentOptions = res.options;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), currentOptions.timeout || 60000);

      const response = await fetch(currentUrl, {
        ...currentOptions,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // 执行响应拦截器
      let finalResponse = response;
      for (const interceptor of this.responseInterceptors) {
        finalResponse = await interceptor(finalResponse, currentOptions);
      }

      if (!finalResponse.ok) {
        const errorText = codeMessage[finalResponse.status] || finalResponse.statusText;
        const error = new ResponseError(finalResponse, errorText);
        if (currentOptions.errorHandler) {
          return await currentOptions.errorHandler(error);
        }
        throw error;
      }

      return await finalResponse.json();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const timeoutError = new Error('请求超时') as any;
        timeoutError.name = 'TimeoutError';
        throw timeoutError;
      }
      throw err;
    }
  }
}

/** 异常处理程序 */
const errorHandler = async (error: any): Promise<never> => {
  const { response } = error;
  let errorText = error.message;

  if (response && response.status) {
    errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else {
    errorText = '您的网络发生异常，无法连接服务器';
    notification.error({
      description: errorText,
      message: '网络异常',
    });
  }

  throw error;
};

const instance = new RequestInstance({
  prefix: '/rmp',
  timeout: 3 * 60 * 1000,
  errorHandler,
  credentials: 'include',
});

// 模拟 umi-request 的 extend 方法
export const extend = (options: RequestOptions) => {
  const newInstance = new RequestInstance({ ...instance.options, ...options });
  // 继承拦截器
  (newInstance as any).requestInterceptors = [...(instance as any).requestInterceptors];
  (newInstance as any).responseInterceptors = [...(instance as any).responseInterceptors];
  
  const requestFn = (url: string, opts: RequestOptions) => newInstance.request(url, opts);
  requestFn.interceptors = newInstance.interceptors;
  return requestFn;
};

// 导出默认 request
const requestFn = (url: string, opts: RequestOptions) => instance.request(url, opts);
requestFn.interceptors = instance.interceptors;

// 添加默认拦截器
requestFn.interceptors.request.use((url, options) => {
  console.log('🚀 发送请求:', { url, method: options.method, data: options.data || options.body });
  return { url, options };
});

requestFn.interceptors.response.use(async (response, options) => {
  const clonedResponse = response.clone();
  const data = await clonedResponse.json();
  const url = response.url;
  const isAegis = url.includes('/rmp/aegis/api');

  if (isAegis) {
    if (data && data.errorId !== 0 && data.errorId !== 145003 && !('faultList' in (data.data || {}))) {
      const messageStr = errCodeMessage(data.errorId, data.errorMessage);
      message.error(messageStr);
    }
  } else if (data && data.code !== 0 && data.code !== 145003 && !('faultList' in (data.data || {}))) {
    const messageStr = errCodeMessage(data.code, data.message);
    message.error(messageStr);
  }

  return response;
});

export default requestFn;

// Added for compatibility with api.ts
export const globalConfig: any = {
  headers: {}
};

export const extendOptions: any = (options: any) => {
  // 模拟 extendOptions 行为，更新全局配置
  if (options.headers) {
    Object.assign(instance.options.headers || {}, options.headers);
  }
};

export type ResultWrapper<T> = {
  code: number;
  message: string;
  data: T;
};

// 字段转换函数（全量）
export const parseRequest = <T, S = T>(
  requestPromise: Promise<any>,
  parseFn?: (prev: T) => S
): Promise<CommonResponseIWrapper<S>> =>
  requestPromise.then(
    (res) => {
      const { data, code, errorId, message: msg, errorMessage } = res;
      return {
        code: errorId ?? code,
        message: errorMessage || msg,
        data: parseFn && data ? parseFn(data) : data,
      } as CommonResponseIWrapper<S>;
    }
  );

// 字段转换函数（分页）
export const parseRequestByPage = <T, S = T>(
  requestPromise: Promise<any>,
  parseFn?: (prev: T) => S
): Promise<CommonResponseIWrapper<{ resultList: S[] } & ResponseParameterPagination>> =>
  requestPromise.then(
    (res) => {
      const { data, code, errorId, message: msg, errorMessage } = res;
      return {
        code: errorId ?? code,
        message: errorMessage || msg,
        data: {
          ...(data || {}),
          resultList: (data?.resultList || []).map((i: any) =>
            parseFn ? parseFn(i) : i
          ),
        },
      } as CommonResponseIWrapper<{ resultList: S[] } & ResponseParameterPagination>;
    }
  );
