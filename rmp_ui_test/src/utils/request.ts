/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import { extend, ResponseError } from 'umi-request';
import { notification } from '@ht/sprite-ui';
import { redirectToLogin } from './utils';
import {
  CommonResponseIWrapper,
  ResponseParameterPagination,
} from '@/services/typing';
import { errCodeMessage } from './errCodeMessage';
import { message } from 'antd';

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

enum CustomCode {
  NO_AUTH = 30000,
  TOKEN_EXPIRED = 90005,
}

const customCodeMessage: Record<number, string> = {
  [CustomCode.NO_AUTH]: '无操作权限',
  [CustomCode.TOKEN_EXPIRED]: 'token过期，请重新登录',
};

/** 异常处理程序 */
const errorHandler = async (error: { response: Response }): Promise<void> => {
  const { response } = error;
  if (response && response.status) {
    // 自定义状态
    if (response.status === 200) {
      const data = await response.clone().json();
      // const messageText = data.message
      //   ? `错误信息：${data.message}`
      //   : customCodeMessage[data.code] || '自定义错误';

      // 异常处理-token过期重新登录
      if (data.code === CustomCode.TOKEN_EXPIRED) {
        redirectToLogin();
      }
    } else {
      const errorText = codeMessage[response.status] || response.statusText;
      const { status, url } = response;

      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw error;
};

const timeout = 3 * 60 * 1000;
/** 配置request请求时的默认参数 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  timeout,
  prefix: '/rmp',
});

// 添加请求拦截器用于调试
request.interceptors.request.use((url, options) => {
  console.log('🚀 发送请求:', {
    url,
    method: options.method,
    data: options.data,
    timestamp: new Date().toISOString()
  });
  return { url, options };
});


// response拦截器, 处理response
request.interceptors.response.use(async (response, options) => {
  const data = await response.clone().json();

  // if (data && customCodeMessage[data.code]) {
  //   throw { response } as ResponseError;
  // }
  const { url } = response;
  const isAegis = url.includes('/rmp/aegis/api');
  if (isAegis) {
    if (
      data &&
      data.errorId !== 0 &&
      data.errorId !== 145003 &&
      !('faultList' in (data.data || {}))
    ) {
      const messageStr = errCodeMessage(
        isAegis ? data.errorId : data.code,
        isAegis ? data.errorMessage : data.message
      );
      message.error(messageStr);
    }
  } else if (
    data &&
    data.code !== 0 &&
    data.code !== 145003 &&
    !('faultList' in (data.data || {}))
  ) {
    const messageStr = errCodeMessage(
      isAegis ? data.errorId : data.code,
      isAegis ? data.errorMessage : data.message
    );
    message.error(messageStr);
  }

  return response;
});

export default request;

export type ResultWrapper<T> = {
  code: number;
  message: string;
  data: T;
};

export type ListData<T> = {
  /**
   * @description 列表数据
   */
  list: T[];

  /**
   * @description 当前是第几页
   */
  current: number;

  /**
   * @description 分页大小
   */
  pageSize: number;

  /**
   * @description 记录条数
   */
  total: number;

  /**
   * @description 页数
   */
  pages: number;
};
// 字段转换函数（全量）
export const parseRequest = <T, S = T>(
  requestPromise: Promise<CommonResponseIWrapper<T>>,
  parseFn?: (prev: T) => S
): Promise<CommonResponseIWrapper<S>> =>
  requestPromise.then(
    ({ data, code, errorId, message, errorMessage }) =>
      ({
        code: errorId ?? code,
        message: errorMessage || message,
        data: parseFn && data ? parseFn(data) : data,
      } as CommonResponseIWrapper<S>)
  );

// 字段转换函数（分页）
export const parseRequestByPage = <T, S = T>(
  requestPromise: Promise<
    CommonResponseIWrapper<{ resultList: T[] } & ResponseParameterPagination>
  >,
  parseFn?: (prev: T) => S
): Promise<
  CommonResponseIWrapper<{ resultList: S[] } & ResponseParameterPagination>
> =>
  requestPromise.then(
    ({ data, code, errorId, message, errorMessage }) =>
      ({
        code: errorId ?? code,
        message: errorMessage || message,
        data: {
          ...(data || {}),
          resultList: (data?.resultList || []).map((i) =>
            parseFn ? parseFn(i) : i
          ),
        },
      } as CommonResponseIWrapper<
        { resultList: S[] } & ResponseParameterPagination
      >)
  );
