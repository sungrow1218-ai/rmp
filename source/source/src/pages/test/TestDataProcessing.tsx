import React, { useState, useEffect } from 'react';
import { Button, Card, Descriptions, message, Spin, Table } from 'antd';
import { queryRuleTemplate, queryRuleTemplateDefaultConfiguration } from '@/services/api';
import { mergeDefaultParamAndValue } from '@/services/ruleTemplateTypes';

const TestDataProcessing: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [defaultConfig, setDefaultConfig] = useState<any>(null);
  const [templateData, setTemplateData] = useState<any>(null);
  const [mergedData, setMergedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testDataProcessing = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🧪 开始测试数据处理流程');

      // 1. 获取默认配置
      console.log('📤 查询默认配置...');
      const defaultRes = await queryRuleTemplateDefaultConfiguration(['Z01201']);
      console.log('📥 默认配置响应:', defaultRes);

      if (!defaultRes || defaultRes.errorId !== 0) {
        throw new Error(`获取默认配置失败: ${defaultRes?.errorMessage || '未知错误'}`);
      }

      const defaultItem = defaultRes.data?.resultList?.find((item: any) => item.ruleType === 'Z01201');
      if (!defaultItem) {
        throw new Error('未找到Z01201的默认配置');
      }

      let defaultData;
      try {
        defaultData = JSON.parse(defaultItem.configuration);
        console.log('📊 解析后的默认配置:', defaultData);
      } catch (parseError) {
        throw new Error(`解析默认配置失败: ${parseError}`);
      }

      setDefaultConfig(defaultData);

      // 2. 获取模板数据
      console.log('📤 查询模板数据...');
      const templateRes = await queryRuleTemplate({
        pageId: 1,
        pageSize: 1000,
        authorityFlag: 0,
        filterCondition: [{ ruleTmplGroupId: 2 }],
      });
      console.log('📥 模板数据响应:', templateRes);

      if (!templateRes || templateRes.errorId !== 0) {
        throw new Error(`获取模板数据失败: ${templateRes?.errorMessage || '未知错误'}`);
      }

      const templateItem = templateRes.data?.resultList?.find((item: any) => item.ruleType === 'Z01201');
      if (!templateItem) {
        throw new Error('未找到Z01201的模板数据');
      }

      console.log('📊 模板数据:', templateItem);
      setTemplateData(templateItem);

      // 3. 合并数据
      console.log('🔄 开始合并数据...');
      const merged = mergeDefaultParamAndValue(defaultData, templateItem);
      console.log('📊 合并后的数据:', merged);
      setMergedData(merged);

      message.success('数据处理测试成功');
    } catch (err: any) {
      console.error('❌ 测试失败:', err);
      setError(err.message || '未知错误');
      message.error(`测试失败: ${err.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 组件加载时自动测试
    testDataProcessing();
  }, []);

  const renderObject = (obj: any, title: string) => {
    if (!obj) return null;

    return (
      <Card title={title} style={{ marginBottom: '20px' }}>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '400px', overflow: 'auto' }}>
          {JSON.stringify(obj, null, 2)}
        </pre>
      </Card>
    );
  };

  const renderMergedDataDetails = () => {
    if (!mergedData) return null;

    return (
      <Card title="合并数据详情" style={{ marginBottom: '20px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="ruleType">{mergedData.ruleType}</Descriptions.Item>
          <Descriptions.Item label="ruleTemplateId">{mergedData.ruleTemplateId}</Descriptions.Item>
          <Descriptions.Item label="可选市场数量">{mergedData.optionalMarketList?.length || 0}</Descriptions.Item>
          <Descriptions.Item label="默认市场数量">{mergedData.defaultMarket?.length || 0}</Descriptions.Item>
          <Descriptions.Item label="市场列表数量">{mergedData.marketList?.length || 0}</Descriptions.Item>
        </Descriptions>

        {mergedData.marketList && mergedData.marketList.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4>市场列表:</h4>
            {mergedData.marketList.map((market: any, index: number) => (
              <Card key={index} size="small" style={{ marginBottom: '10px' }}>
                <Descriptions column={3} size="small">
                  <Descriptions.Item label="marketId">{market.marketId}</Descriptions.Item>
                  <Descriptions.Item label="marketName">{market.marketName}</Descriptions.Item>
                  <Descriptions.Item label="证券组数量">{market.securityGroupList?.length || 0}</Descriptions.Item>
                </Descriptions>

                {market.securityGroupList && market.securityGroupList.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <h5>证券组:</h5>
                    {market.securityGroupList.map((sg: any, sgIndex: number) => (
                      <div key={sgIndex} style={{ marginBottom: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                        <Descriptions column={3} size="small">
                          <Descriptions.Item label="securityGroupId">{sg.securityGroupId}</Descriptions.Item>
                          <Descriptions.Item label="securityGroupName">{sg.securityGroupName}</Descriptions.Item>
                          <Descriptions.Item label="阈值数量">{sg.thresholdList?.length || 0}</Descriptions.Item>
                        </Descriptions>

                        {sg.thresholdList && sg.thresholdList.length > 0 && (
                          <Table
                            dataSource={sg.thresholdList}
                            columns={[
                              { title: 'factorType', dataIndex: 'factorType' },
                              { title: 'value', dataIndex: 'value', render: (val) => JSON.stringify(val) },
                              { title: 'defaultValue', dataIndex: 'defaultValue', render: (val) => JSON.stringify(val) },
                              { title: 'unit', dataIndex: 'unit' },
                              { title: 'setType', dataIndex: 'setType' },
                            ]}
                            rowKey={(record, index) => `${record.factorType}-${index}`}
                            pagination={false}
                            size="small"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>数据处理流程测试</h1>
      <p>测试 mergeDefaultParamAndValue 函数是否正确处理数据</p>

      <Button
        type="primary"
        onClick={testDataProcessing}
        style={{ marginBottom: '20px' }}
      >
        重新测试
      </Button>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#fff0f0', border: '1px solid #ffccc7' }}>
          <strong>错误信息:</strong> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>正在测试数据处理...</p>
        </div>
      ) : (
        <>
          {renderObject(defaultConfig, '默认配置 (defaultData)')}
          {renderObject(templateData, '模板数据 (templateData)')}
          {renderMergedDataDetails()}
        </>
      )}
    </div>
  );
};

export default TestDataProcessing;