import React from 'react';
import { Card, Alert, List } from 'antd';
import { getRuleTemplateConfig, getMarketName, getSecurityGroupName } from '@/pages/ruleSetting/RuleTemplateGroup/components/configMonitor/utils';

const TestTemplateConfig: React.FC = () => {
  // 测试获取模板配置
  const z01102Config = getRuleTemplateConfig('Z01102');
  const z01201Config = getRuleTemplateConfig('Z01201');
  const z01202Config = getRuleTemplateConfig('Z01202');

  // 测试市场名称
  const market1Name = getMarketName(1);
  const market2Name = getMarketName(2);

  // 测试证券组名称
  const group1Name = getSecurityGroupName(1);
  const group2Name = getSecurityGroupName(2);
  const group101Name = getSecurityGroupName(101);

  return (
    <div style={{ padding: '20px' }}>
      <h1>模板配置工具函数测试</h1>

      <Card title="模板配置测试" style={{ marginBottom: '20px' }}>
        <Alert
          message="Z01102 模板配置"
          description={`配置项数量: ${z01102Config.length}`}
          type="info"
          showIcon
          style={{ marginBottom: '10px' }}
        />

        <Alert
          message="Z01201 模板配置"
          description={`配置项数量: ${z01201Config.length}`}
          type="warning"
          showIcon
          style={{ marginBottom: '10px' }}
        />

        <Alert
          message="Z01202 模板配置"
          description={`配置项数量: ${z01202Config.length}`}
          type="success"
          showIcon
        />
      </Card>

      <Card title="工具函数测试" style={{ marginBottom: '20px' }}>
        <List
          header={<div>函数测试结果</div>}
          bordered
          dataSource={[
            `getMarketName(1): ${market1Name}`,
            `getMarketName(2): ${market2Name}`,
            `getSecurityGroupName(1): ${group1Name}`,
            `getSecurityGroupName(2): ${group2Name}`,
            `getSecurityGroupName(101): ${group101Name}`,
          ]}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </Card>

      <Card title="模板配置详情">
        <h3>Z01102 模板配置详情：</h3>
        <List
          bordered
          dataSource={z01102Config}
          renderItem={(item, index) => (
            <List.Item>
              <div>
                <strong>条件 {index + 1}:</strong> {item.template}
                {item.$15 && <div style={{ marginLeft: '20px' }}>$15: {item.$15.componentProps.suffix}</div>}
                {item.$16 && <div style={{ marginLeft: '20px' }}>$16: {item.$16.componentProps.suffix}</div>}
                {item.$17 && <div style={{ marginLeft: '20px' }}>$17: {item.$17.componentProps.suffix}</div>}
                {item.$18 && <div style={{ marginLeft: '20px' }}>$18: {item.$18.componentProps.suffix}</div>}
                {item.$19 && <div style={{ marginLeft: '20px' }}>$19: {item.$19.componentProps.suffix}</div>}
                {item.$20 && <div style={{ marginLeft: '20px' }}>$20: {item.$20.componentProps.suffix}</div>}
                {item.$21 && <div style={{ marginLeft: '20px' }}>$21: {item.$21.componentProps.suffix}</div>}
                {item.$22 && <div style={{ marginLeft: '20px' }}>$22: {item.$22.componentProps.suffix}</div>}
                {item.$35 && <div style={{ marginLeft: '20px' }}>$35: {item.$35.componentProps.suffix}</div>}
                {item.$36 && <div style={{ marginLeft: '20px' }}>$36: {item.$36.componentProps.suffix}</div>}
                {item.$38 && <div style={{ marginLeft: '20px' }}>$38: {item.$38.componentProps.suffix}</div>}
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default TestTemplateConfig;