// https://umijs.org/config/
import path from "path";
import { defineConfig } from "@oula/oula";
import proxy from "./proxy";
import routes from "./routes";
import theme from "./theme";
import BaseSettings from "./BaseSettings";

const { appName } = BaseSettings;
const { REACT_APP_ENV, NODE_ENV } = process.env;

function resolve(dir: string) {
  console.log(path.join(__dirname, "..", dir));
  return path.join(__dirname, "..", dir);
}

function getSourceMapConfig(env: string | undefined) {
  let sourceMapConfig: string | boolean = "";
  switch (env) {
    case "production":
      sourceMapConfig = false;
      break;
    case "development":
      sourceMapConfig = "cheap-module-source-map";
      break;
    default:
      // TODO 前端 Paas CI 环境似乎没有 NODE_ENV
      sourceMapConfig = "source-map";
      break;
  }
  return sourceMapConfig;
}

const sourceMapMode = getSourceMapConfig(NODE_ENV);

export default defineConfig({
  bundlerConfig: {
    output: {
      filenameHash: true,
      sourceMap: {
        js: sourceMapMode,
        css: sourceMapMode,
      },
      assetPrefix: "/rmp/",
      //生产环境下publicPath
      // assetPrefix: `/${BaseSettings.appName}/`
    },
    dev: {
      assetPrefix: "/rmp/",
      //测试环境下publicPath
      // assetPrefix: `/${BaseSettings.appName}/`
    },
    tools: {
      less: {
        lessOptions: {
          modifyVars: theme,
        },
      },
    },
    source: {
      alias: {
        "@config": resolve("config"),
      },
      transformImport: [
        {
          libraryName: "@ht/sprite-ui",
          libraryDirectory: "es",
          style: true,
        },
      ],
    },
    html: {
      title: "投资交易风控合规管理平台",
      tags: [
        { tag: 'meta', attrs: { charset: 'UTF-8' } },
      ],
    },
    performance: {
      removeMomentLocale: true,
    },
    server: {
      proxy: proxy[REACT_APP_ENV || "dev"],
    },
  },
  dva: {
    hmr: true,
  },
  history: {
    type: "hash",
  },
  locale: {
    default: "zh-CN",
    antd: false,
  },
  dynamicImport: {
    loading: "@/components/PageLoading/index",
  },
  // 为 hash 路由添加统一前缀，最终格式为 `${hashPrefix}${route.path}`
  // plugins: ['@ht/umi-plugin-hashprefix'],
  // hashPrefix: `/${appName}`,
  routes,
  // 埋点配置，需先在数据中台接入项目，获取 productName 和 productId
  xlog: {
    appName: "riskManagePlatformWeb", // 添加对应应用名称，方便定位
    logPv: true,
    externalXlog: true,
    initOption: {
      // xlog的初始化参数
      submitType: "myTrack",
      from: "main", // 添加对应应用名称，方便定位
      types: [
        "consoleMehods",
        "windowError",
        "sourceError",
        "unhandledrejection",
        "performance",
        "xhr",
        "fetch",
      ], // 'performance' 性能监控
      routeConfig: {
        routeType: "hash", // 路由类型'hash' | 'history'，默认为hash
        dynamicRoutes: [], // 动态路由集合，例：/home/:id/detail，当页面url匹配到该路由时，xlog上报的页面path将是动态路由('/home/:id/detail')
        redirectRoute: {}, // 重定向的路由配置，例：{ '/' : '/home/index' }代表首页'/'被重定向到'/home/index'，当页面url匹配到'/'，xlog上报的页面path将是'/home/index'
      },
      consoleMethods: ["error", "warn", "info"],
      reportProxyConfig: {
        via_nginx: "/rmp/xlogReport",
      },
      fetchProxyConfig: {
        via_nginx: "/rmp/xlogConfig",
      },
      myTrackConfig: {
        product_id: "518", // 数字中台申请
        product_name: "投资交易风险合规管理平台", // 数字中台申请
        channel_env: "via_nginx", // 通过nginx上报
      },
      beforeReport: (data: { type: string, content: { errorMessage: string } }) => {
        if (data?.type === 'windowError') {
          const errorMessage = data?.content?.errorMessage || '';
          if (
            errorMessage.includes('ResizeObserver loop completed with undelivered notifications') ||
            errorMessage.includes('ResizeObserver loop limit exceeded')
          ) {
            return false;
          }
        }
        return data;
      },
    },
  },
});
