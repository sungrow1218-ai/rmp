import React from 'react';
import { UserInfoResponseDataType } from '@/services/auth/index';

interface DebugInfoProps {
  userInfo?: UserInfoResponseDataType;
  authData: any;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ userInfo, authData }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      maxHeight: '200px',
      overflow: 'auto'
    }}>
      <h4 style={{ margin: '0 0 8px 0' }}>调试信息</h4>
      <div><strong>用户信息:</strong> {userInfo ? JSON.stringify(userInfo) : '未获取'}</div>
      <div><strong>显示名称:</strong> {userInfo?.displayName || '空'}</div>
      <div><strong>权限数据:</strong> {authData ? '已加载' : '未加载'}</div>
      <div><strong>角色ID:</strong> {authData?.roleId || '未设置'}</div>
      <div><strong>时间:</strong> {new Date().toLocaleTimeString()}</div>
    </div>
  );
};

export default DebugInfo;