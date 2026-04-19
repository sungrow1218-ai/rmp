/**
 * 基础登录页面 - 使用纯HTML和React，避免任何Ant Design动画组件
 * 确保能够调用真实的登录API
 */

import React, { useState, useRef, useEffect } from 'react';
import { userLogin } from '@/services/auth/index';
import { setAccessToken, redirectToEntry } from '@/utils/utils';
import styles from './style.less';

const BasicLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const addDebugInfo = (msg: string) => {
    console.log(`🔍 ${msg}`);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  // 自动聚焦到用户名输入框
  useEffect(() => {
    if (userNameRef.current) {
      userNameRef.current.focus();
      addDebugInfo('登录页面加载完成');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userNameRef.current || !passwordRef.current) {
      addDebugInfo('输入框引用未初始化');
      return;
    }

    const userName = userNameRef.current.value.trim();
    const password = passwordRef.current.value;

    // 基本验证
    if (!userName) {
      setError('请输入用户名');
      userNameRef.current.focus();
      return;
    }
    if (!password) {
      setError('请输入密码');
      passwordRef.current.focus();
      return;
    }
    if (userName.length < 3) {
      setError('用户名至少3个字符');
      userNameRef.current.focus();
      return;
    }
    if (password.length < 6) {
      setError('密码至少6个字符');
      passwordRef.current.focus();
      return;
    }

    setLoading(true);
    setError('');
    addDebugInfo(`开始登录，用户名: ${userName}`);

    try {
      addDebugInfo('调用 userLogin API...');
      const result = await userLogin({ userName, password });
      addDebugInfo(`API响应: code=${result.code}, message=${result.message}`);

      if (result.code !== 0) {
        setError(`登录失败: ${result.message || '用户名或密码错误'}`);
        return;
      }

      const { token = '' } = result?.data || {};
      if (!token) {
        setError('登录失败: 未获取到认证令牌');
        return;
      }

      // 保存token
      setAccessToken(token);
      addDebugInfo('Token保存成功，准备重定向');

      // 直接重定向
      setTimeout(() => {
        redirectToEntry();
      }, 100);

    } catch (err: any) {
      console.error('登录异常详情:', err);
      addDebugInfo(`登录异常: ${err.message || '网络错误'}`);
      setError(`登录异常: ${err.message || '请检查网络连接'}`);
    } finally {
      setLoading(false);
      addDebugInfo('登录流程结束');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.centerPart}>
        <div className={styles.left}>
          <div className={styles.slogan}>基于统一平台全流程管控</div>
          <div className={styles.slogan}>提供泛交易条线的运营、运维能力</div>
        </div>
        <div className={styles.right}>
          <div className={styles.logo}>
            <img
              className={styles.logoLeft}
              src={require('../../assets/login/logoLeft.png').default}
              alt="华泰证券"
            />
            <img
              className={styles.logoRight}
              src={require('../../assets/login/logoRight.png').default}
              alt="风险管控平台"
            />
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={styles.loginForm}
            style={{ marginTop: '72px' }}
            noValidate
          >
            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="userName"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '16px',
                  color: '#000000d9'
                }}
              >
                用户名
              </label>
              <input
                ref={userNameRef}
                id="userName"
                type="text"
                placeholder="请输入用户名/工号"
                required
                minLength={3}
                maxLength={20}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '16px',
                  border: 'none',
                  borderBottom: '1px solid #c6c8ca',
                  outline: 'none',
                  background: 'transparent',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '16px',
                  color: '#000000d9'
                }}
              >
                密码
              </label>
              <input
                ref={passwordRef}
                id="password"
                type="password"
                placeholder="请输入密码"
                required
                minLength={6}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '16px',
                  border: 'none',
                  borderBottom: '1px solid #c6c8ca',
                  outline: 'none',
                  background: 'transparent',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  color: '#ff4d4f',
                  marginBottom: '16px',
                  textAlign: 'center',
                  fontSize: '14px',
                  minHeight: '20px',
                  backgroundColor: '#fff2f0',
                  padding: '8px',
                  borderRadius: '2px',
                  border: '1px solid #ffccc7'
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: '16px',
                fontWeight: 400,
                backgroundColor: loading ? '#d9d9d9' : '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '64px',
                height: '40px',
                boxSizing: 'border-box'
              }}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div style={{
            marginTop: '16px',
            textAlign: 'center',
            color: '#999',
            fontSize: '12px'
          }}>
            提示：请使用公司分配的账号密码登录
          </div>

          {/* 调试信息面板 */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            right: '20px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '12px',
            maxHeight: '200px',
            overflowY: 'auto',
            maxWidth: '400px',
            zIndex: 1000,
            opacity: 0.9
          }}>
            <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
              调试信息:
            </div>
            {debugInfo.map((info, index) => (
              <div key={index} style={{ marginBottom: '2px', fontSize: '10px' }}>
                {info}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicLogin;