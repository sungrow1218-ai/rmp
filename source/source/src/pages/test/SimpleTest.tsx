import React, { useState } from 'react';
import { Button, Card, Descriptions, message, Spin } from 'antd';

const SimpleTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🧪 运行简单测试');

      // 模拟 queryRuleTemplate 接口返回的数据（从txt文件）
      const mockTemplateResponse = {
        errorId: 0,
        errorMessage: "success",
        data: {
          errorId: 0,
          errorMessage: null,
          pageId: 1,
          pageSize: 1000,
          totalSize: 1,
          resultList: [
            {
              ruleTemplateId: 2,
              ruleType: "Z01201",
              securityGroupList: [
                {
                  securityGroupId: 6,
                  securityGroupName: "上交所-风险警示股、上证50成分股",
                  securityControlType: 4,
                  securitySummaryType: 0,
                  securitySummaryCondition: null,
                  securityList: null,
                  secuSetIdList: [
                    10001,
                    10002
                  ],
                  secuFilterClassList: null,
                  excludeSecurityList: null,
                  marketId: [
                    2
                  ],
                  thresholdList: [
                    {
                      thresholdId: 33,
                      warnLevel: 3,
                      compareDirection: 1,
                      value: 4,
                      unit: 3,
                      factorType: 16,
                      setType: 3,
                      effectiveFlag: 1
                    },
                    {
                      thresholdId: 33,
                      warnLevel: 1,
                      compareDirection: 1,
                      value: 5,
                      unit: 3,
                      factorType: 16,
                      setType: null,
                      effectiveFlag: null
                    },
                    {
                      thresholdId: 33,
                      warnLevel: 2,
                      compareDirection: 1,
                      value: 6,
                      unit: 3,
                      factorType: 16,
                      setType: null,
                      effectiveFlag: null
                    },
                    {
                      thresholdId: 34,
                      warnLevel: 3,
                      compareDirection: 1,
                      value: 4.00,
                      unit: 4,
                      factorType: 17,
                      setType: 3,
                      effectiveFlag: 1
                    },
                    {
                      thresholdId: 34,
                      warnLevel: 1,
                      compareDirection: 1,
                      value: 5.00,
                      unit: 4,
                      factorType: 17,
                      setType: null,
                      effectiveFlag: null
                    },
                    {
                      thresholdId: 34,
                      warnLevel: 2,
                      compareDirection: 1,
                      value: 8.00,
                      unit: 4,
                      factorType: 17,
                      setType: null,
                      effectiveFlag: null
                    },
                    {
                      thresholdId: 35,
                      warnLevel: 3,
                      compareDirection: 1,
                      value: 4.00,
                      unit: 4,
                      factorType: 18,
                      setType: 3,
                      effectiveFlag: 1
                    },
                    {
                      thresholdId: 35,
                      warnLevel: 1,
                      compareDirection: 1,
                      value: 5.00,
                      unit: 4,
                      factorType: 18,
                      setType: null,
                      effectiveFlag: null
                    },
                    {
                      thresholdId: 35,
                      warnLevel: 2,
                      compareDirection: 1,
                      value: 6.00,
                      unit: 4,
                      factorType: 18,
                      setType: null,
                      effectiveFlag: null
                    },
                    {
                      thresholdId: 36,
                      warnLevel: 3,
                      compareDirection: 1,
                      value: 4,
                      unit: 2,
                      factorType: 15,
                      setType: 3,
                      effectiveFlag: 1
                    },
                    {
                      thresholdId: 36,
                      warnLevel: 1,
                      compareDirection: 1,
                      value: 5,
                      unit: 2,
                      factorType: 15,
                      setType: null,
                      effectiveFlag: null
                    },
                    {
                      thresholdId: 36,
                      warnLevel: 2,
                      compareDirection: 1,
                      value: 6,
                      unit: 2,
                      factorType: 15,
                      setType: null,
                      effectiveFlag: null
                    }
                  ],
                  extraParameterList: null,
                  effectiveTimeList: [
                    {
                      beginTime: "093000",
                      endTime: "145700"
                    }
                  ]
                }
              ],
              workGroupId: 1,
              ruleTmplGroupId: 2,
              createRoleId: 2,
              createUserCode: "018566",
              updateUserCode: "018566",
              createTime: "20260423160244",
              lastUpdateTime: "20260423160309"
            }
          ]
        },
        success: true
      };

      console.log('📊 Mock 数据:', mockTemplateResponse);

      // 检查数据格式
      const templateItem = mockTemplateResponse.data.resultList[0];
      console.log('📊 模板项目:', templateItem);

      // 检查 securityGroupList
      console.log('📊 securityGroupList:', templateItem.securityGroupList);
      console.log('📊 securityGroupList 长度:', templateItem.securityGroupList.length);

      // 检查 thresholdList
      if (templateItem.securityGroupList[0].thresholdList) {
        console.log('📊 thresholdList 长度:', templateItem.securityGroupList[0].thresholdList.length);
        console.log('📊 thresholdList 前3项:', templateItem.securityGroupList[0].thresholdList.slice(0, 3));
      }

      setResult({
        mockTemplateResponse,
        templateItem,
        securityGroupListInfo: {
          length: templateItem.securityGroupList.length,
          firstItem: templateItem.securityGroupList[0]
        }
      });

      message.success('测试成功');
    } catch (err: any) {
      console.error('❌ 测试失败:', err);
      setError(err.message || '未知错误');
      message.error(`测试失败: ${err.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>简单数据测试</h1>
      <p>测试 queryRuleTemplate 接口返回的数据格式</p>

      <Button
        type="primary"
        onClick={runTest}
        style={{ marginBottom: '20px' }}
      >
        运行测试
      </Button>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#fff0f0', border: '1px solid #ffccc7' }}>
          <strong>错误信息:</strong> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>正在运行测试...</p>
        </div>
      ) : result && (
        <>
          <Card title="Mock 数据概览" style={{ marginBottom: '20px' }}>
            <Descriptions column={2}>
              <Descriptions.Item label="errorId">{result.mockTemplateResponse.errorId}</Descriptions.Item>
              <Descriptions.Item label="errorMessage">{result.mockTemplateResponse.errorMessage}</Descriptions.Item>
              <Descriptions.Item label="totalSize">{result.mockTemplateResponse.data.totalSize}</Descriptions.Item>
              <Descriptions.Item label="resultList长度">{result.mockTemplateResponse.data.resultList.length}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="模板项目详情" style={{ marginBottom: '20px' }}>
            <Descriptions column={2}>
              <Descriptions.Item label="ruleTemplateId">{result.templateItem.ruleTemplateId}</Descriptions.Item>
              <Descriptions.Item label="ruleType">{result.templateItem.ruleType}</Descriptions.Item>
              <Descriptions.Item label="securityGroupList长度">{result.templateItem.securityGroupList.length}</Descriptions.Item>
              <Descriptions.Item label="workGroupId">{result.templateItem.workGroupId}</Descriptions.Item>
              <Descriptions.Item label="ruleTmplGroupId">{result.templateItem.ruleTmplGroupId}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="第一个SecurityGroup详情" style={{ marginBottom: '20px' }}>
            <Descriptions column={2}>
              <Descriptions.Item label="securityGroupId">{result.securityGroupListInfo.firstItem.securityGroupId}</Descriptions.Item>
              <Descriptions.Item label="securityGroupName">{result.securityGroupListInfo.firstItem.securityGroupName}</Descriptions.Item>
              <Descriptions.Item label="marketId">
                {Array.isArray(result.securityGroupListInfo.firstItem.marketId)
                  ? result.securityGroupListInfo.firstItem.marketId.join(', ')
                  : result.securityGroupListInfo.firstItem.marketId}
              </Descriptions.Item>
              <Descriptions.Item label="thresholdList长度">{result.securityGroupListInfo.firstItem.thresholdList?.length || 0}</Descriptions.Item>
            </Descriptions>

            {result.securityGroupListInfo.firstItem.thresholdList && (
              <div style={{ marginTop: '20px' }}>
                <h4>阈值列表 (前5个):</h4>
                <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '300px', overflow: 'auto' }}>
                  {JSON.stringify(result.securityGroupListInfo.firstItem.thresholdList.slice(0, 5), null, 2)}
                </pre>
              </div>
            )}
          </Card>

          <Card title="完整响应数据">
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '500px', overflow: 'auto' }}>
              {JSON.stringify(result.mockTemplateResponse, null, 2)}
            </pre>
          </Card>
        </>
      )}
    </div>
  );
};

export default SimpleTest;