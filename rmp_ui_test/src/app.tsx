// 运行时代码。使用 antd prefix 时，对于 notification, message 需要手动设置 prefixCls; 如果希望全局设置，可以放在这里
import { notification, message, ConfigProvider } from '@ht/sprite-ui';
import BaseSettings from '@config/BaseSettings';
import Cookies from 'js-cookie';
import { setAccessToken } from './utils/utils';
import './global.less';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(localeData);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.locale('zh-cn');

// 配置notification和message 的样式前缀
notification.config({
  prefixCls: `${BaseSettings.appName}-notification`,
});

message.config({
  prefixCls: `${BaseSettings.appName}-message`,
});

ConfigProvider.config({
  prefixCls: `${BaseSettings.appName}`, // 4.13.0+
});

// 检查外部auth
if (Cookies.get('auth')) {
  setAccessToken(Cookies.get('auth') as string); // 将auth cookie的值设置为访问令牌
}

// 检查Matic token
// 是否存在 riskAuth 和 auth 两个 Cookie
if (Cookies.get('riskAuth') && Cookies.get('auth')) {
  setAccessToken(Cookies.get('riskAuth') as string);
  Cookies.set('user-token', Cookies.get('auth') as string);
}
