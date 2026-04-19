import { j as jsxRuntimeExports, C as ConfigProvider, z as zhCN, D as DataProvider } from "./index-CUErrqgd.js";
const BlankLayout = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ConfigProvider,
    {
      locale: zhCN,
      theme: {
        token: {
          colorPrimary: "#1890ff",
          colorInfo: "#1890ff",
          borderRadius: 4
        },
        components: {
          Table: {
            headerBg: "#fafafa",
            headerColor: "#333"
          },
          Tabs: {
            itemColor: "#666",
            itemSelectedColor: "#1890ff",
            inkBarColor: "#1890ff"
          }
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(DataProvider, { children })
    }
  );
};
export {
  BlankLayout as default
};
