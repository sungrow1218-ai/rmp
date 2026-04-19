import { r as reactExports, j as jsxRuntimeExports } from "./index-CUErrqgd.js";
import { c as globalConfig, l as lodashExports } from "./utils-BVQ22sob.js";
import { U as UserRoleContext } from "./UserRoleContext-DMxWKclM.js";
import { M as MenuFuncContext } from "./MenuFuncContext-B04V1YTi.js";
import { S as Spin } from "./index-DpyJnIWD.js";
import { s as staticMethods } from "./index-CCOmhxaD.js";
import "./render-uL5zGIDv.js";
import "./asyncToGenerator-Bn7YJjF8.js";
import "./context-CN2GVsG0.js";
import "./useZIndex-BReSjmbj.js";
import "./ExclamationCircleFilled-CXyczA-G.js";
import "./InfoCircleFilled-6TjWreYB.js";
import "./reactNode-TfIvHo6t.js";
import "./LoadingOutlined-s4PR_g90.js";
const API_BASE_URL = "/rmp";
const API_TIMEOUT = 18e4;
const requestInterceptor = (config) => {
  const globalHeaders = globalConfig.headers || {};
  const headers = {
    ...globalHeaders,
    ...config.headers
  };
  return {
    ...config,
    headers,
    credentials: "include"
    // 包含cookie，与rmp_ui_test一致
  };
};
const responseInterceptor = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log("🔍 [responseInterceptor] 原始响应数据:", data);
  console.log("🔍 [responseInterceptor] 响应URL:", response.url);
  console.log("🔍 [responseInterceptor] 响应状态:", response.status, response.statusText);
  const isAegis = response.url.includes("/rmp/aegis/api");
  console.log("🔍 [responseInterceptor] 是否是aegis接口:", isAegis);
  if (isAegis) {
    console.log("🔍 [responseInterceptor] aegis接口数据:", {
      errorId: data.errorId,
      errorMessage: data.errorMessage,
      hasData: !!data.data,
      data: data.data
    });
    if (data.errorId !== 0 && data.errorId !== 145003) {
      throw new Error(data.errorMessage || "请求失败");
    }
    if (data.errorId === 90005) {
      window.location.href = "/login";
      throw new Error("登录已过期，请重新登录");
    }
    return {
      code: data.errorId,
      errorId: data.errorId,
      message: data.errorMessage,
      errorMessage: data.errorMessage,
      data: data.data
    };
  } else {
    console.log("🔍 [responseInterceptor] 普通接口数据:", {
      code: data.code,
      message: data.message,
      hasData: !!data.data,
      data: data.data
    });
    if (data.code !== 0 && data.code !== 145003) {
      throw new Error(data.message || "请求失败");
    }
    if (data.code === 90005) {
      window.location.href = "/login";
      throw new Error("登录已过期，请重新登录");
    }
    return {
      code: data.code,
      errorId: data.code,
      message: data.message,
      errorMessage: data.message,
      data: data.data
    };
  }
};
const request = async (url, options = {}) => {
  try {
    const config = requestInterceptor({
      ...options,
      url
    });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...config,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return await responseInterceptor(response);
  } catch (error) {
    console.error("API请求失败:", error);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("请求超时，请检查网络连接");
    }
    throw error;
  }
};
const requestByPage = async (url, data, options = {}) => {
  return request(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...options
  });
};
const getMenuByRole = async (params) => {
  return requestByPage("/aegis/api/ops/queryRoleMenuInfo", params);
};
const useUserRoles = () => {
  const {
    activeRoleId,
    availableRoles = [],
    setActiveRoleId
  } = reactExports.useContext(UserRoleContext);
  return {
    activeRoleId,
    availableRoles,
    setActiveRoleId
  };
};
function buildMenuItemConfig(menus = []) {
  const menuMap = {};
  const result = [];
  menus.forEach((menu) => {
    menuMap[menu.menuId] = {
      label: menu.menuName,
      key: String(menu.menuId)
    };
  });
  menus.forEach((menu) => {
    if (menu.parentMenuId && menu.parentMenuId !== -1 && menuMap[menu.parentMenuId]) {
      if (menuMap[menu.parentMenuId].children) {
        menuMap[menu.parentMenuId].children.push(menuMap[menu.menuId]);
      } else {
        menuMap[menu.parentMenuId].children = [menuMap[menu.menuId]];
      }
    } else {
      result.push(menuMap[menu.menuId]);
    }
  });
  return result;
}
function getLeafNodeKeys(menuTree) {
  const leafIds = [];
  function traverse(node) {
    if (!node.children || node.children.length === 0) {
      leafIds.push(Number(node.key));
    } else {
      node.children.forEach(traverse);
    }
  }
  menuTree.forEach(traverse);
  return leafIds;
}
const LOADING_STATUS = {
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  FAILED: "FAIL"
};
function menuFuncReducer(state, action) {
  if (action.type === "LOADING_BEGIN") {
    return {
      status: LOADING_STATUS.LOADING
    };
  }
  if (action.type === "LOADING_SUCCESS") {
    const data = action.payload;
    const menuItemConfig = buildMenuItemConfig(data);
    const leafMenuIds = getLeafNodeKeys(menuItemConfig);
    const menuIdToPathMap = {};
    const menuPathToIdMap = {};
    leafMenuIds.forEach((menuId) => {
      const menu = data.find((item) => item.menuId === menuId);
      if (menu) {
        menuIdToPathMap[menuId] = menu.menuUrl;
        menuPathToIdMap[menu.menuUrl] = menuId;
      }
    });
    return {
      flatMenuData: data,
      menuItemConfig,
      leafMenuIds,
      menuIdToPathMap,
      menuPathToIdMap,
      status: LOADING_STATUS.SUCCESS
    };
  }
  if (action.type === "LOADING_FAIL") {
    return {
      status: LOADING_STATUS.FAILED
    };
  }
  return state;
}
const MenuFunc = (props) => {
  const { activeRoleId } = useUserRoles();
  const [state, dispatch] = reactExports.useReducer(menuFuncReducer, {
    status: LOADING_STATUS.LOADING
  });
  reactExports.useEffect(() => {
    if (!activeRoleId) return;
    let isMounted = true;
    async function fetchMenuAndFunc() {
      var _a, _b, _c;
      try {
        if (isMounted) {
          dispatch({
            type: "LOADING_BEGIN"
          });
        }
        const resData = await getMenuByRole({
          pageId: 1,
          pageSize: 1e3
        });
        if (resData.code !== 0 || ((_b = (_a = resData == null ? void 0 : resData.data) == null ? void 0 : _a.resultList) == null ? void 0 : _b.length) === 0) {
          throw new Error("Failed to fetch menu and function");
        }
        if (isMounted) {
          dispatch({
            type: "LOADING_SUCCESS",
            payload: (_c = resData == null ? void 0 : resData.data) == null ? void 0 : _c.resultList
          });
        }
      } catch (error) {
        console.error("获取菜单权限失败:", error);
        if (isMounted) {
          dispatch({
            type: "LOADING_FAIL"
          });
          setTimeout(() => {
            staticMethods.error("菜单权限获取异常");
          }, 0);
        }
      }
    }
    fetchMenuAndFunc();
    return () => {
      isMounted = false;
    };
  }, [activeRoleId]);
  if (state.status === LOADING_STATUS.LOADING) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen w-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spin, { size: "large", tip: "加载菜单权限中..." }) });
  }
  if (state.status === LOADING_STATUS.FAILED) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen w-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-500 text-lg mb-2", children: "菜单权限加载失败" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-600", children: "菜单权限获取异常" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuFuncContext.Provider, { value: lodashExports.omit(state, "status"), children: props.children });
};
export {
  MenuFunc as default
};
