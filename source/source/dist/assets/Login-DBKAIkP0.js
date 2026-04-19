import { r as reactExports, j as jsxRuntimeExports, C as ConfigProvider, z as zhCN } from "./index-CUErrqgd.js";
import { u as userLogin, s as setAccessToken, d as redirectToEntry } from "./utils-BVQ22sob.js";
import { s as staticMethods } from "./index-CCOmhxaD.js";
import { F as Form } from "./index-CYeT6-j6.js";
import { I as Input } from "./index-HqjRjDrR.js";
import { B as Button } from "./button-DMDTHtWf.js";
import "./render-uL5zGIDv.js";
import "./asyncToGenerator-Bn7YJjF8.js";
import "./context-CN2GVsG0.js";
import "./useZIndex-BReSjmbj.js";
import "./ExclamationCircleFilled-CXyczA-G.js";
import "./InfoCircleFilled-6TjWreYB.js";
import "./LoadingOutlined-s4PR_g90.js";
import "./index-BKheaG9T.js";
import "./compact-item-T75FitAV.js";
import "./reactNode-TfIvHo6t.js";
import "./TextArea-Cw6hnbxh.js";
import "./responsiveObserver-ChKXsNUO.js";
import "./row-B49boWar.js";
const LogoLeftImg = "/assets/logoLeft-CXGxtppd.png";
const LogoRightImg = "/assets/logoRight-0Ed6ko7m.png";
const Login = () => {
  const onFinish = reactExports.useCallback(
    async (formParam) => {
      console.log("🔍 开始登录，参数:", formParam);
      console.log("🔍 登录按钮点击事件触发");
      try {
        console.log("🔍 调用userLogin函数");
        const result = await userLogin(formParam);
        console.log("📥 登录API响应:", result);
        const errorCode = result.errorId ?? result.code;
        if (errorCode !== 0) {
          const errorMessage = result.errorMessage || result.message || "用户名或密码错误";
          staticMethods.error({
            content: `登录失败: ${errorMessage}`
          });
          return;
        }
        const { token = "" } = (result == null ? void 0 : result.data) || {};
        if (!token) {
          staticMethods.error({
            content: `登录失败: 未获取到 Token`
          });
          return;
        }
        console.log("✅ 获取到Token，准备保存");
        setAccessToken(token);
        console.log("🔄 Token已保存，准备重定向");
        redirectToEntry();
      } catch (error) {
        console.error("❌ 登录异常:", error);
        console.error("❌ 错误详情:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
          response: error.response
        });
        staticMethods.error({
          content: `登录异常: ${error.message || "请检查网络连接"}`
        });
      }
    },
    []
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ConfigProvider, { locale: zhCN, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "login-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-centerPart", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "login-slogan", children: "基于统一平台全流程管控" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "login-slogan", children: "提供泛交易条线的运营、运维能力" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-logo", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "logoLeft", src: LogoLeftImg, alt: "Logo Left" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "logoRight", src: LogoRightImg, alt: "Logo Right" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Form,
        {
          name: "normal_login",
          layout: "vertical",
          className: "login-form",
          initialValues: { remember: true },
          onFinish,
          requiredMark: false,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Form.Item,
              {
                name: "userName",
                label: "用户名",
                rules: [{ required: true, message: "请输入用户名" }],
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    size: "large",
                    placeholder: "请输入用户名",
                    className: "login-input",
                    bordered: false
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Form.Item,
              {
                name: "password",
                label: "密码",
                rules: [{ required: true, message: "请输入密码" }],
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input.Password,
                  {
                    size: "large",
                    className: "login-input",
                    bordered: false,
                    placeholder: "请输入密码"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Form.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "primary",
                htmlType: "submit",
                className: "login-button",
                children: "登录"
              }
            ) })
          ]
        }
      )
    ] })
  ] }) }) });
};
export {
  Login as default
};
