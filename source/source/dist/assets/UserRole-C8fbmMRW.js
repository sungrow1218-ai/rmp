import { r as reactExports, j as jsxRuntimeExports } from "./index-CUErrqgd.js";
import { e as extendOptions, b as getCurrentUserRoles } from "./utils-BVQ22sob.js";
import { U as UserRoleContext } from "./UserRoleContext-DMxWKclM.js";
import { S as Spin } from "./index-DpyJnIWD.js";
import "./render-uL5zGIDv.js";
import "./asyncToGenerator-Bn7YJjF8.js";
import "./context-CN2GVsG0.js";
import "./useZIndex-BReSjmbj.js";
import "./ExclamationCircleFilled-CXyczA-G.js";
import "./InfoCircleFilled-6TjWreYB.js";
import "./reactNode-TfIvHo6t.js";
const LOADING_STATUS = {
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  FAILED: "FAIL"
};
function userRoleReducer(state, action) {
  if (action.type === "CHANGE_ACTIVE_ROLE") {
    return {
      ...state,
      activeRoleId: action.payload
    };
  }
  if (action.type === "ROLE_LOADING_SUCCESS") {
    return {
      ...state,
      ...action.payload,
      status: LOADING_STATUS.SUCCESS
    };
  }
  if (action.type === "ROLE_LOADING_FAIL") {
    return {
      ...state,
      status: LOADING_STATUS.FAILED,
      failReason: action.payload || "未知错误"
    };
  }
  return state;
}
const UserRole = (props) => {
  const [state, dispatch] = reactExports.useReducer(userRoleReducer, {
    status: LOADING_STATUS.LOADING
  });
  const setActiveRoleId = reactExports.useCallback((roleId) => {
    if (state.status === LOADING_STATUS.SUCCESS && state.activeRoleId !== roleId) {
      requestAnimationFrame(() => {
        dispatch({ type: "CHANGE_ACTIVE_ROLE", payload: roleId });
        extendOptions({ headers: { "Role-Id": `${roleId}` } });
      });
    }
  }, [state.status, state.activeRoleId]);
  reactExports.useEffect(() => {
    async function fetchRoles() {
      var _a;
      try {
        const { code, data } = await getCurrentUserRoles({
          pageId: 1,
          pageSize: 100
        });
        if (code !== 0) {
          throw new Error("获取当前用户角色信息失败");
        }
        if (((_a = data == null ? void 0 : data.resultList) == null ? void 0 : _a.length) === 0) {
          throw new Error("当前登录用户在本系统中没有任何角色");
        }
        const availableRoles = data.resultList.map((role) => ({
          id: role.roleId,
          name: role.roleName
        }));
        const activeRoleId = availableRoles[0].id;
        dispatch({
          type: "ROLE_LOADING_SUCCESS",
          payload: { availableRoles, activeRoleId }
        });
        extendOptions({ headers: { "Role-Id": `${activeRoleId}` } });
      } catch (error) {
        console.error("获取用户角色失败:", error);
        dispatch({
          type: "ROLE_LOADING_FAIL",
          payload: error == null ? void 0 : error.message
        });
      }
    }
    fetchRoles();
  }, []);
  if (state.status === LOADING_STATUS.LOADING) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen w-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spin, { size: "large", tip: "加载用户角色中..." }) });
  }
  if (state.status === LOADING_STATUS.FAILED) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen w-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-500 text-lg mb-2", children: "角色权限加载失败" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-600", children: state.failReason })
    ] }) });
  }
  if (!state.activeRoleId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen w-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-500 text-lg mb-2", children: "无可用角色" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-600", children: "请选择一个角色以开始使用系统" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoleContext.Provider, { value: { ...state, setActiveRoleId }, children: props.children });
};
export {
  UserRole as default
};
