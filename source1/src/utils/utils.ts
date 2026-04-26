import Cookies from 'js-cookie';
import {
  intersectionWith,
  isArray,
  isEqual,
  isFunction,
  isObject,
  mergeWith,
  unionWith,
} from 'lodash';
import { COOKIE_TOKEN_KEY, KEEPALIVE_CACHE_KEY_PREFIX } from './constant';

export const getPageQuery = () => Object.fromEntries(new URLSearchParams(window.location.search));

export const getDynamicCacheKey = (
  prefix: typeof KEEPALIVE_CACHE_KEY_PREFIX[keyof typeof KEEPALIVE_CACHE_KEY_PREFIX],
  workGroupId: string
) => {
  return `${prefix}__${workGroupId}`;
};

/**
 * 退出登录
 * 1、删除 cookie 中的 access token
 * 2、页面重新加载至登录地址
 */
export const logout = () => {
  removeAccessToken();
  redirectToLogin();
};

/**
 * 判断是否eip/eipsit
 */
export const isEip = () => {
  const { hostname } = window.location;
  const regex = /\beip(?!(new|uat|dev|sit)\b)/i;

  const isValid = regex.test(hostname);
  return isValid;
};

/**
 * 页面重新加载至登录地址
 */
export const redirectToLogin = () => {
  const { protocol, host, pathname } = window.location;
  window.location.href = `${protocol}//${host}${pathname}#/login`;
};

/**
 * 页面重新加载至入口地址
 */
export const redirectToEntry = () => {
  const { protocol, host, pathname } = window.location;
  window.location.href = `${protocol}//${host}${pathname}#/welcome`;
};

/**
 * 设置 cookie 中的 access token
 */
export const setAccessToken = (token: string) => {
  return Cookies.set(COOKIE_TOKEN_KEY, token);
};

/**
 * 获取 cookie 中的 access token
 */
export const getAccessToken = () => {
  return Cookies.get(COOKIE_TOKEN_KEY);
};

/**
 * 删除 cookie 中的 access token
 */
export const removeAccessToken = () => {
  return Cookies.remove(COOKIE_TOKEN_KEY);
};

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<
  T extends Record<string, unknown> | null | undefined,
  U extends Record<string, unknown> | null | undefined
>(
  source: T,
  target: U,
  mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace'
): T & U {
  if (!target) {
    return source as T & U;
  }
  if (!source) {
    return target as T & U;
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual);
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual);
        case 'concat':
          return sourceValue.concat(targetValue);
        case 'replace':
          return targetValue;
        default:
          throw new Error(
            `Unknown merge array strategy: ${mergeArrays as string}`
          );
      }
    }
    if (isFunction(targetValue) && isFunction(sourceValue)) {
      return targetValue;
    }
    if (isObject(targetValue) && isObject(sourceValue)) {
      return deepMerge(
        sourceValue as Record<string, unknown>,
        targetValue as Record<string, unknown>,
        mergeArrays
      );
    }
    return undefined;
  });
}

/**
 *
 * @returns 判断是否被引用
 */
export const getIsIfram = () => {
  if (self.frameElement && self.frameElement.tagName === 'IFRAME') {
    return true;
  } else {
    return false;
  }
};
/**
 *
 * @param data 数组
 * @param lable lable字段
 * @param value 数组联合或者单个值
 * @returns
 */
export const tranFromDataToOption = (
  data: any,
  label: string,
  value: string | string[]
) => {
  if (Array.isArray(data)) {
    if (Array.isArray(value)) {
      return data.map((p) => {
        const conectValue = value.map((i) => p[i]).join('|');
        return {
          label: p[label] as string,
          value: conectValue,
        };
      });
    } else {
      return data.map((p) => {
        return {
          label: p[label],
          value: p[value],
        };
      });
    }
  }
  return [];
};
export const tranFromDataToOptionNoAll = (props: {
  data: any;
  labelFild: string;
  valueFild: string | string[];
}) => {
  const { data, labelFild, valueFild } = props;
  if (Array.isArray(data)) {
    if (Array.isArray(valueFild)) {
      return data.map((p) => {
        const conectValue = valueFild.map((i) => p[i]).join('|');
        return {
          label: p[labelFild] as string,
          value: conectValue,
        };
      });
    } else {
      return data
        .filter((i) => String(i[valueFild]) !== '-1')
        .map((p) => {
          return {
            label: p[labelFild],
            value: p[valueFild],
          };
        });
    }
  }
  return [];
};

// 是否在页面内
export const isInPage = (node: HTMLElement) => {
  return node === document.body ? false : document.body.contains(node);
};

interface Dict {
  code: string;
  name: string;
}
interface Items {
  label: string;
  value: string;
}

export const transformDictToSelectOptions = (dict?: Dict[]) => {
  if (!dict) {
    return [];
  }
  return dict.map((item) => {
    return {
      label: `${item.code}-${item.name}`,
      value: item.code,
    };
  });
};
export const transformDictToSelectOptionsLabel = (dict?: Items[]) => {
  if (!dict) {
    return [];
  }
  return dict.map((item) => {
    return {
      label: `${item.value}-${item.label}`,
      value: item.value,
    };
  });
};

export const transformDictToSelectOptionsNumber = (dict?: Dict[]) => {
  if (!dict) {
    return [];
  }
  return dict.map((item) => {
    return {
      label: `${item.code}-${item.name}`,
      value: Number(item.code),
    };
  });
};

// 安全解析Json数据
export const safeJsonParse = (str: string | null | undefined) => {
  // 前置校验：若为 null/undefined/空字符串，直接返回默认值
  if (!str || typeof str !== 'string') {
    return null;
  }
  try {
    // 尝试解析
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON 解析失败：', error, '解析的字符串：', str);
    return null;
  }
};

export interface ITreeNode {
  code: string;
  name: string;
  disabled?: boolean;
  children?: ITreeNode[];
}

// 递归处理数据，禁用非叶子节点
export const processData = (data: ITreeNode[]): ITreeNode[] => {
  return data.map((item) => {
    if (item.children && item.children.length > 0) {
      // 如果有子节点，禁用它，并递归处理子节点
      return {
        ...item,
        disabled: true, // 禁用父节点
        children: processData(item.children),
      };
    } else {
      return item;
    }
  });
};

// 树形结构数据展示
export const transformDictTreeCodeToNameHelper = (
  code: string | number,
  dict: ITreeNode[]
) => {
  const codeMap: Recordable = {};
  const traversal = (nodes: ITreeNode[]) => {
    for (const node of nodes) {
      codeMap[node.code] = node.name;
      if (node.children && node.children.length > 0) {
        traversal(node.children);
      }
    }
  };
  traversal(dict);
  return codeMap[code] || '未知';
};
