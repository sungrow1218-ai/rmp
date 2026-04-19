import React from 'react';
import LayoutLogoImg from '@/assets/layout/logo.png';
import { AppstoreFilled } from '@ant-design/icons';

const NavLogo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 280 }}>
      <div style={{
        width: 32,
        height: 32,
        backgroundColor: '#1890ff',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)'
      }}>
        <AppstoreFilled style={{ color: '#ffffff', fontSize: 18 }} />
      </div>
      <span style={{
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: '0.5px'
      }}>
        交易合规监控系统
      </span>
    </div>
  );
};

export default NavLogo;
