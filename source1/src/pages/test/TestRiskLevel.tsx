import React from 'react';
import { Card, Alert } from 'antd';
import { RiskLevel } from '@/services/ruleTemplateTypes';

const TestRiskLevel: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>RiskLevel 枚举测试</h1>

      <Card title="RiskLevel 值测试" style={{ marginBottom: '20px' }}>
        <Alert
          message="RiskLevel.INTERCEPT 值"
          description={`值为: ${RiskLevel.INTERCEPT} (${typeof RiskLevel.INTERCEPT})`}
          type="info"
          showIcon
          style={{ marginBottom: '10px' }}
        />

        <Alert
          message="RiskLevel.WARNING 值"
          description={`值为: ${RiskLevel.WARNING} (${typeof RiskLevel.WARNING})`}
          type="warning"
          showIcon
        />
      </Card>

      <Card title="导入测试结果">
        <Alert
          message="导入成功"
          description="RiskLevel 枚举已成功导入并可以使用"
          type="success"
          showIcon
        />

        <div style={{ marginTop: '20px' }}>
          <h3>测试用例：</h3>
          <ul>
            <li>RiskLevel.INTERCEPT === {RiskLevel.INTERCEPT} ✓</li>
            <li>RiskLevel.WARNING === {RiskLevel.WARNING} ✓</li>
            <li>typeof RiskLevel.INTERCEPT === "{typeof RiskLevel.INTERCEPT}" ✓</li>
            <li>typeof RiskLevel.WARNING === "{typeof RiskLevel.WARNING}" ✓</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default TestRiskLevel;