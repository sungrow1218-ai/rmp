/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    "/rmp/api": {
      // 使用goapi 进行接口数据定义mock
      // http://goapi.htsc/goapi/web/#/home/project/api?projectId=10002065&moduleid=129331
      // target: 'http://10.102.80.87:1080', // 机构SIT
      //  target: "http://168.61.91.207:1080", // 机构DEV
      // target: 'http://168.61.70.177:1080', // LOCAL
      // target: "http://168.61.114.45:1080",
      // target: "http://10.102.76.147:1080", // 自营DEV
      //  target: "http://10.102.81.174:1080", // 自营SIT
      // target: "http://10.102.83.121:1080", // 机构UAT
      // target: "http://10.102.83.157:1080", // 自营UAT
      target: "http://10.102.82.119:1080", // 监控SIT
      pathRewrite: {
        "^/rmp/api": "",
      },
      changeOrigin: true,
    },
    "/rmp/aegis/api": {
      // target: "http://10.102.79.60:11084", // 自营DEV
      // target: "http://10.102.78.60:11084", // 机构DEV
      // target: "http://168.61.70.177:11084", // 本地
      target: "http://10.102.82.119:11084", // 监控SIT
      pathRewrite: {
        "^/rmp/aegis/api": "",
      },
      changeOrigin: true,
    },
  },
};
