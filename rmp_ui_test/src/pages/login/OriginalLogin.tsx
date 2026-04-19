/**
 * 原始登录页面 - 完全按照风险管控平台文档实现
 * 与rmp_ui_test项目保持一致
 */

import React, { useCallback } from 'react';
import { ConfigProvider, Form, Button, Input, message } from '@ht/sprite-ui';
import zhCN from '@ht/sprite-ui/lib/locale/zh_CN';
import { userLogin } from '@/services/auth/index';
import { setAccessToken, redirectToEntry } from '@/utils/utils';
import BaseSettings from '../../../config/BaseSettings';
import LogoLeftImg from '../../assets/login/logoLeft.png';
import LogoRightImg from '../../assets/login/logoRight.png';
import styles from './style.less';

const OriginalLogin = () => {
  // onFinish 是 Form 提交时触发的函数，使用了 useCallback 来优化性能，避免每次组件重新渲染都创建新的函数
  const onFinish = useCallback(
    async (formParam: { password: string; userName: string }) => {
      console.log('开始登录流程，参数:', formParam);
      try {
        const result = await userLogin(formParam); // src\services\auth.ts  userLogin向后端发送请求
        console.log('登录API响应:', result);

        if (result.code !== 0) {
          message.error({
            content: `登录失败: ${result.message || '用户名或密码错误'}`,
          });
          return;
        }
        const { token = '' } = result?.data || {};
        if (!token) {
          message.error({
            content: `登录失败: 未获取到 Token`,
          });
          return;
        }
        console.log('获取到token，准备保存:', token.substring(0, 20) + '...');
        setAccessToken(token); // 保存token
        console.log('token已保存，准备重定向');
        redirectToEntry(); // 页面重新加载至入口地址
      } catch (error: any) {
        console.error('登录异常:', error);
        message.error({
          content: `登录异常: ${error.message || '请检查网络连接'}`
        });
      }
    },
    []
  );
  return (
    <ConfigProvider prefixCls={BaseSettings.appName} locale={zhCN}>
      <div className={styles.container}>
        <div className={styles.centerPart}>
          <div className={styles.left}>
            <div className={styles.slogan}>基于统一平台全流程管控</div>
            <div className={styles.slogan}>提供泛交易条线的运营、运维能力</div>
          </div>
          <div className={styles.right}>
            <div className={styles.logo}>
              <img className={styles.logoLeft} src={LogoLeftImg} />
              <img className={styles.logoRight} src={LogoRightImg} />
            </div>
            <Form
              name="normal_login"
              layout="vertical"
              className={styles.loginForm}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                name="userName"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  size="large"
                  placeholder="请输入用户名"
                  className={styles.loginInput}
                  bordered={false}
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  size="large"
                  className={styles.loginInput}
                  bordered={false}
                  placeholder="请输入密码"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.loginButton}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default OriginalLogin;