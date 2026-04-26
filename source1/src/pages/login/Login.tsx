import React, { useCallback } from 'react';
import { ConfigProvider, Form, Button, Input, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { userLogin } from '@/services/auth/index';
import { setAccessToken, redirectToEntry } from '@/utils/utils';
import LogoLeftImg from '@/assets/login/logoLeft.png';
import LogoRightImg from '@/assets/login/logoRight.png';
import './style.css';

const Login = () => {
  // onFinish 是 Form 提交时触发的函数,使用了 useCallback 来优化性能，避免每次组件重新渲染都创建新的函数
  const onFinish = useCallback(
    async (formParam: { password: string; userName: string }) => {
      console.log('🔍 开始登录，参数:', formParam);
      console.log('🔍 登录按钮点击事件触发');

      try {
        console.log('🔍 调用userLogin函数');
        const result = await userLogin(formParam); // src\services\auth.ts  userLogin向后端发送请求
        console.log('📥 登录API响应:', result);

        // 检查错误码，支持Aegis格式（errorId）和普通格式（code）
        const errorCode = (result as any).errorId ?? result.code;
        if (errorCode !== 0) {
          const errorMessage = (result as any).errorMessage || result.message || '用户名或密码错误';
          message.error({
            content: `登录失败: ${errorMessage}`,
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

        console.log('✅ 获取到Token，准备保存');
        setAccessToken(token); // 保存token
        console.log('🔄 Token已保存，准备重定向');
        redirectToEntry(); // 页面重新加载至入口地址
      } catch (error: any) {
        console.error('❌ 登录异常:', error);
        console.error('❌ 错误详情:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          response: error.response
        });
        message.error({
          content: `登录异常: ${error.message || '请检查网络连接'}`
        });
      }
    },
    []
  );
  return (
    <ConfigProvider locale={zhCN}>
      <div className="login-container">
        <div className="login-centerPart">
          <div className="login-left">
            <div className="login-slogan">基于统一平台全流程管控</div>
            <div className="login-slogan">提供泛交易条线的运营、运维能力</div>
          </div>
          <div className="login-right">
            <div className="login-logo">
              <img className="logoLeft" src={LogoLeftImg} alt="Logo Left" />
              <img className="logoRight" src={LogoRightImg} alt="Logo Right" />
            </div>
            <Form
              name="normal_login"
              layout="vertical"
              className="login-form"
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
                  className="login-input"
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
                  className="login-input"
                  bordered={false}
                  placeholder="请输入密码"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-button"
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

export default Login;
