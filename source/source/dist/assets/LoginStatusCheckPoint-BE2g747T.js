import { r as reactExports, j as jsxRuntimeExports } from "./index-CUErrqgd.js";
import { g as getAccessToken, i as isEip, r as redirectToLogin, v as validateToken, a as removeAccessToken } from "./utils-BVQ22sob.js";
import { s as staticMethods } from "./index-CCOmhxaD.js";
import "./render-uL5zGIDv.js";
import "./asyncToGenerator-Bn7YJjF8.js";
import "./context-CN2GVsG0.js";
import "./useZIndex-BReSjmbj.js";
import "./ExclamationCircleFilled-CXyczA-G.js";
import "./InfoCircleFilled-6TjWreYB.js";
import "./LoadingOutlined-s4PR_g90.js";
const ValidateStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAIL: "FAIL"
};
const LoginStatusCheckPoint = ({ children }) => {
  const [validateStatus, setValidateStatus] = reactExports.useState(ValidateStatus.PENDING);
  const token = getAccessToken();
  reactExports.useEffect(() => {
    console.log("🔍 LoginStatusCheckPoint: useEffect执行，token:", token);
    console.log("🔍 当前URL:", window.location.href);
    async function checkTokenValidity() {
      console.log("🔍 开始验证Token...");
      try {
        const result = await validateToken();
        console.log("🔍 Token验证结果:", result);
        const errorCode = result.errorId ?? result.code;
        if (errorCode === 0) {
          console.log("🔍 Token验证成功");
          setValidateStatus(ValidateStatus.SUCCESS);
        } else {
          const errorMessage = result.errorMessage || result.message || "Token验证失败";
          console.error("🔍 Token验证失败:", errorCode, errorMessage);
          staticMethods.warning({ content: "当前登录 token 已失效，请重新登录" });
          setValidateStatus(ValidateStatus.FAIL);
          removeAccessToken();
          redirectToLogin();
        }
      } catch (error) {
        console.error("🔍 Token验证异常:", error);
        staticMethods.warning({ content: "Token 验证失败，请重新登录" });
        setValidateStatus(ValidateStatus.FAIL);
        removeAccessToken();
        redirectToLogin();
      }
    }
    if (token) {
      checkTokenValidity();
    } else {
      console.log("🔍 没有token，重定向到登录页");
      if (!isEip()) {
        redirectToLogin();
      }
    }
  }, [token]);
  const isLoginPage = window.location.hash === "#/login" || window.location.pathname.includes("/login");
  if (!isEip() && !getAccessToken() && !isLoginPage) {
    redirectToLogin();
    return null;
  }
  if (!isEip() && validateStatus !== ValidateStatus.SUCCESS) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen w-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-blue-500 text-lg mb-2", children: "验证登录状态中..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-600", children: "请稍候" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
};
export {
  LoginStatusCheckPoint as default
};
