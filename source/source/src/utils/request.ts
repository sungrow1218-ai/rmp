import { notification, message } from 'antd';
import { codeMessage, CustomCode, customCodeMessage } from './constant';
import { redirectToLogin } from './utils';
import { errCodeMessage } from './errCodeMessage';

/**
 * 请求配置接口
 */
interface RequestConfig extends RequestInit {
  prefix?: string;
  timeout?: number;
  data?: any; // 为了方便使用，添加data属性
}

/**
 * 响应包装器接口
 */
export interface ResponseWrapper<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页响应包装器接口
 */
export interface PaginatedResponseWrapper<T = any> {
  code: number;
  message: string;
  data: {
    resultList: T[];
    pageId: number;
    pageSize: number;
    totalSize: number;
  };
}

/**
 * 全局请求配置
 */
export const globalConfig = {
  prefix: '/rmp',
  timeout: 3 * 60 * 1000, // 3分钟
  credentials: 'include', // 携带 Cookie
  headers: {
    'Content-Type': 'application/json',
  } as Record<string, string>,
};

/**
 * 扩展请求选项
 * 用于设置全局请求头等配置
 */
export const extendOptions = (options: { headers?: Record<string, string> }) => {
  if (options.headers) {
    console.log('🔍 [extendOptions] 设置全局请求头:', options.headers);
    console.log('🔍 [extendOptions] 之前全局headers:', globalConfig.headers);
    globalConfig.headers = { ...globalConfig.headers, ...options.headers };
    console.log('🔍 [extendOptions] 之后全局headers:', globalConfig.headers);
  }
};

/**
 * 获取默认请求配置
 */
const getDefaultConfig = (): RequestConfig => ({
  prefix: globalConfig.prefix,
  timeout: globalConfig.timeout,
  credentials: globalConfig.credentials,
  headers: { ...globalConfig.headers },
});

/**
 * 错误处理器
 */
const errorHandler = async (error: any): Promise<void> => {
  console.error('🔍 错误处理器收到错误:', error);

  if (error.name === 'AbortError') {
    console.error('🔍 请求超时');
    notification.error({
      message: '请求超时',
      description: '请求超时，请稍后重试',
    });
  } else if (error.response) {
    const { status, url } = error.response;
    console.error('🔍 响应错误:', { status, url });

    // 自定义状态
    if (status === 200) {
      try {
        const data = await error.response.clone().json();
        console.error('🔍 响应数据（状态200但业务错误）:', data);

        // 异常处理-token过期重新登录
        if (data.code === CustomCode.TOKEN_EXPIRED) {
          console.error('🔍 Token过期，重定向到登录页');
          redirectToLogin();
        }
      } catch (jsonError) {
        console.error('🔍 JSON解析错误:', jsonError);
      }
    } else {
      const errorText = codeMessage[status] || error.response.statusText;
      console.error('🔍 HTTP错误:', errorText);
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
  } else if (!error.response) {
    console.error('🔍 网络异常');
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  console.error('🔍 错误处理器完成，重新抛出错误');
  throw error;
};

/**
 * 请求函数
 */
export async function request<T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<ResponseWrapper<T>> {
  // 合并配置，确保headers正确合并
  const defaultConfig = getDefaultConfig();
  const mergedConfig = { ...defaultConfig, ...config };
  const { prefix, timeout, data, ...fetchConfig } = mergedConfig;

  // 调试日志：显示请求头和全局配置
  console.log('🔍 [request] 全局配置headers:', globalConfig.headers);
  console.log('🔍 [request] 当前请求headers:', fetchConfig.headers);

  // 确保headers正确合并
  if (!fetchConfig.headers) {
    fetchConfig.headers = { ...defaultConfig.headers };
  } else if (typeof fetchConfig.headers === 'object') {
    // 合并headers，确保Content-Type存在
    fetchConfig.headers = { ...defaultConfig.headers, ...fetchConfig.headers };
  }

  // 如果提供了data，将其转换为body
  if (data !== undefined && !fetchConfig.body) {
    fetchConfig.body = JSON.stringify(data);
    // 确保Content-Type设置为application/json
    if (typeof fetchConfig.headers === 'object' && !('Content-Type' in fetchConfig.headers)) {
      (fetchConfig.headers as Record<string, string>)['Content-Type'] = 'application/json';
    }
  }

  const fullUrl = prefix ? `${prefix}${url}` : url;

  console.log('🔍 请求信息:', {
    url,
    prefix,
    fullUrl,
    method: config.method || 'GET',
    data: config.data || (config.body ? JSON.parse(config.body) : undefined),
    headers: config.headers,
    credentials: fetchConfig.credentials,
    body: fetchConfig.body
  });

  // 创建 AbortController 用于超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log('🔍 开始fetch请求:', fullUrl);
    let response;
    try {
      response = await fetch(fullUrl, {
        ...fetchConfig,
        signal: controller.signal,
      });
      console.log('🔍 fetch请求完成，状态:', response.status);
    } catch (fetchError) {
      console.error('🔍 fetch请求失败:', fetchError);
      clearTimeout(timeoutId);
      throw {
        name: 'FetchError',
        message: fetchError.message,
        response: null
      };
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('🔍 响应不OK:', response.status, response.statusText);
      throw {
        response: {
          status: response.status,
          statusText: response.statusText,
          url: fullUrl,
        },
      };
    }

    console.log('🔍 响应状态:', response.status, response.statusText);

    const data = await response.json();
    console.log('🔍 响应数据:', data);
    console.log('🔍 响应字段:', {
      hasErrorId: 'errorId' in data,
      errorId: (data as any).errorId,
      hasCode: 'code' in data,
      code: data.code,
      hasErrorMessage: 'errorMessage' in data,
      errorMessage: (data as any).errorMessage,
      hasMessage: 'message' in data,
      message: data.message
    });

    // 检查 Token 过期
    if (data.code === CustomCode.TOKEN_EXPIRED) {
      console.log('🔍 Token过期，重定向到登录页');
      redirectToLogin();
      throw new Error('Token expired');
    }

    console.log('🔍 请求成功，返回数据');
    return data as ResponseWrapper<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    await errorHandler(error);
    throw error; // 重新抛出错误，让调用者处理
  }
}

// 注意：原生fetch API不支持拦截器机制
// 以下代码是umi-request的拦截器语法，在原生fetch中不会生效
// 业务错误处理已经在parseRequest函数中实现

/**
 * 解析请求响应（通用）
 */
export async function parseRequest<T = any>(
  promise: Promise<ResponseWrapper<T>>
): Promise<ResponseWrapper<T>> {
  try {
    const response = await promise;

    // 处理Aegis格式响应
    if ('errorId' in response) {
      const { errorId, errorMessage, data, ...rest } = response as any;
      return {
        ...rest,
        code: errorId ?? response.code,
        message: errorMessage || response.message,
        data: data ?? response.data,
      };
    }

    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * 解析请求响应（分页）
 */
export async function parseRequestByPage<T = any>(
  promise: Promise<ResponseWrapper<{
    resultList: T[];
    pageId: number;
    pageSize: number;
    totalSize: number;
  }>>
): Promise<PaginatedResponseWrapper<T>> {
  try {
    const response = await promise;

    // 处理Aegis格式响应
    if ('errorId' in response) {
      const { errorId, errorMessage, data, ...rest } = response as any;
      return {
        ...rest,
        code: errorId ?? response.code,
        message: errorMessage || response.message,
        data: data ?? response.data,
      };
    }

    return {
      code: response.code,
      message: response.message,
      data: response.data,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * GET 请求
 */
export async function get<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: RequestConfig
): Promise<ResponseWrapper<T>> {
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : '';
  return request<T>(`${url}${queryString}`, {
    ...config,
    method: 'GET',
  });
}

/**
 * POST 请求
 */
export async function post<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ResponseWrapper<T>> {
  return request<T>(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT 请求
 */
export async function put<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ResponseWrapper<T>> {
  return request<T>(url, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE 请求
 */
export async function del<T = any>(
  url: string,
  config?: RequestConfig
): Promise<ResponseWrapper<T>> {
  return request<T>(url, {
    ...config,
    method: 'DELETE',
  });
}

export default request;