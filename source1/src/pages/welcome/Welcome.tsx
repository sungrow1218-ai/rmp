import React from 'react';
import { Card, Typography, Space } from 'antd';

const { Title, Paragraph } = Typography;

const Welcome: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2}>欢迎使用风险管控平台</Title>
          <Paragraph>
            欢迎登录风险管控平台。本系统提供全面的风险管理和监控功能，帮助您有效管理交易风险。
          </Paragraph>
          <Paragraph>
            请使用左侧菜单导航到各个功能模块。
          </Paragraph>
          <div style={{ marginTop: 24 }}>
            <Title level={4}>主要功能模块：</Title>
            <ul>
              <li>规则设置 - 配置和管理风险控制规则</li>
              <li>账户组管理 - 管理账户分组和权限</li>
              <li>证券组管理 - 管理证券池和投资组合</li>
              <li>告警查询 - 查看和监控风险触警事件</li>
              <li>流程管理 - 处理规则审批和豁免申请</li>
            </ul>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Welcome;