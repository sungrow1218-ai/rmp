import React, { useCallback, useState, useEffect } from 'react';
import { ConfigProvider, Form, Button, Input, message, Spin } from '@ht/sprite-ui';
import zhCN from '@ht/sprite-ui/lib/locale/zh_CN';
import { userLogin } from '@/services/auth/index';
import { setAccessToken, redirectToEntry } from '@/utils/utils';
import BaseSettings from '../../../config/BaseSettings';
import LogoLeftImg from '../../assets/login/logoLeft.png';
import LogoRightImg from '../../assets/login/logoRight.png';
import styles from './style.less';

const Login = () => {
  const [loading, setLoading] = useState(false);

  // 组件加载时清除URL中的hash部分，避免/login#/welcome这种情况
  useEffect(() => {
    if (window.location.hash && window.location.hash !== '#/login') {
      console.log('清除URL中的非登录hash:', window.location.hash);
      // 只保留路径，移除hash
      const newUrl = window.location.pathname + window.location.search;
      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  // onFinish 是 Form 提交时触发的函数,使用了 useCallback 来优化性能，避免每次组件重新渲染都创建新的函数
  const onFinish = useCallback(
    async (formParam: { password: string; userName: string }) => {
      setLoading(true);
      try {
        console.log('开始登录，参数:', formParam);
        console.log('当前URL:', window.location.href);
        console.log('调用userLogin API...');

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
            content: `登录失败: 未获取到认证令牌`,
          });
          return;
        }
        setAccessToken(token); // 保存token
        message.success({
          content: '登录成功',
          duration: 1,
        });
        console.log('登录成功，准备跳转...');
        console.log('当前URL before redirect:', window.location.href);
        // 短暂延迟后跳转，让用户看到成功消息
        setTimeout(() => {
          redirectToEntry(); // 页面重新加载至入口地址
        }, 500);
      } catch (error: any) {
        console.error('登录错误详情:', error);
        console.error('错误类型:', typeof error);
        console.error('错误堆栈:', error.stack);
        message.error({
          content: `登录失败: ${error.message || '网络连接异常'}`,
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );
  return (
    <ConfigProvider prefixCls={BaseSettings.appName} locale={zhCN}>
      <Spin spinning={loading} size="large">
        <div className={styles.container}>
          <div className={styles.centerPart}>
            <div className={styles.left}>
              <div className={styles.slogan}>基于统一平台全流程管控</div>
              <div className={styles.slogan}>提供泛交易条线的运营、运维能力</div>
            </div>
            <div className={styles.right}>
              <div className={styles.logo}>
                <img className={styles.logoLeft} src={LogoLeftImg} alt="华泰证券" />
                <img className={styles.logoRight} src={LogoRightImg} alt="风险管控平台" />
              </div>
              <Form
                name="normal_login"
                layout="vertical"
                className={styles.loginForm}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                requiredMark={false}
                disabled={loading}
              >
                <Form.Item
                  name="userName"
                  label="用户名"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' },
                    { max: 20, message: '用户名最多20个字符' }
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="请输入用户名/工号"
                    className={styles.loginInput}
                    bordered={false}
                    disabled={loading}
                    autoComplete="username"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6个字符' }
                  ]}
                >
                  <Input.Password
                    size="large"
                    className={styles.loginInput}
                    bordered={false}
                    placeholder="请输入密码"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.loginButton}
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? '登录中...' : '登录'}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </Spin>
    </ConfigProvider>
  );
};

export default Login;
