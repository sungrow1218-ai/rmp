import React, { useState } from 'react';
import { Button, Card, Descriptions, message, Spin, Table } from 'antd';
import { queryRuleTemplateDefaultConfiguration } from '@/services/api';

const TestDefaultConfig: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🧪 开始测试 queryRuleTemplateDefaultConfiguration 接口');

      const ruleTypes = ['Z01201', 'Z01101', 'Z01301'];
      console.log('📤 请求参数:', { ruleTypes });

      const res = await queryRuleTemplateDefaultConfiguration(ruleTypes);

      console.log('📥 响应数据:', res);
      console.log('📊 响应数据详情:', {
        errorId: res?.errorId,
        errorMessage: res?.errorMessage,
        hasData: !!res?.data,
        dataKeys: res?.data ? Object.keys(res.data) : [],
        resultListLength: res?.data?.resultList?.length || 0,
        resultList: res?.data?.resultList || []
      });

      if (res && res.errorId === 0) {
        setData(res);
        message.success(`获取数据成功，共 ${res.data?.resultList?.length || 0} 条记录`);

        // 尝试解析配置数据
        if (res.data?.resultList) {
          res.data.resultList.forEach((item: any, index: number) => {
            console.log(`🔍 解析第${index + 1}条记录: ruleType=${item.ruleType}`);
            try {
              const config = JSON.parse(item.configuration);
              console.log(`📊 解析成功:`, config);
              console.log(`📊 是否有market_list:`, !!config.market_list);
              console.log(`📊 market_list长度:`, config.market_list?.length || 0);

              if (config.market_list && config.market_list.length > 0) {
                config.market_list.forEach((market: any, mIndex: number) => {
                  console.log(`📊 市场 ${mIndex + 1}: ID=${market.market_id}`);
                  console.log(`📊 证券组数量:`, market.security_group_list?.length || 0);

                  if (market.security_group_list && market.security_group_list.length > 0) {
                    market.security_group_list.forEach((sg: any, sgIndex: number) => {
                      console.log(`📊 证券组 ${sgIndex + 1}: ID=${sg.security_group_id}, 名称=${sg.security_group_name}`);
                      console.log(`📊 禁止阈值数量:`, sg.forbid_threshold_list?.length || 0);
                    });
                  }
                });
              }
            } catch (parseError) {
              console.error(`❌ 解析失败:`, parseError);
              console.error(`❌ 原始配置字符串:`, item.configuration);
            }
          });
        }
      } else {
        setError(res?.errorMessage || res?.message || '请求失败');
        message.error(res?.errorMessage || res?.message || '请求失败');
      }
    } catch (err: any) {
      console.error('❌ 测试失败:', err);
      setError(err.message || '未知错误');
      message.error(`测试失败: ${err.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ruleType',
      dataIndex: 'ruleType',
      key: 'ruleType',
    },
    {
      title: '配置字符串长度',
      key: 'configLength',
      render: (text: any, record: any) => record.configuration?.length || 0,
    },
    {
      title: '配置是否可解析',
      key: 'isParsable',
      render: (text: any, record: any) => {
        try {
          JSON.parse(record.configuration);
          return <span style={{ color: 'green' }}>可解析</span>;
        } catch {
          return <span style={{ color: 'red' }}>不可解析</span>;
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Button
          size="small"
          onClick={() => {
            try {
              const config = JSON.parse(record.configuration);
              console.log('📊 详细配置:', config);
              alert(`规则类型: ${record.ruleType}\n配置已输出到控制台`);
            } catch (error) {
              alert(`解析失败: ${error}`);
            }
          }}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>queryRuleTemplateDefaultConfiguration 接口测试</h1>
      <p>测试默认配置接口是否返回有效数据</p>

      <Button
        type="primary"
        onClick={testQuery}
        style={{ marginBottom: '20px' }}
      >
        测试接口
      </Button>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#fff0f0', border: '1px solid #ffccc7' }}>
          <strong>错误信息:</strong> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>正在测试接口...</p>
        </div>
      ) : data && (
        <>
          <Card title="接口响应信息" style={{ marginBottom: '20px' }}>
            <Descriptions column={2}>
              <Descriptions.Item label="errorId">
                <span style={{ color: data.errorId === 0 ? 'green' : 'red' }}>
                  {data.errorId}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="errorMessage">
                {data.errorMessage || 'success'}
              </Descriptions.Item>
              <Descriptions.Item label="resultList长度">
                {data.data?.resultList?.length || 0}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {data.data?.resultList && data.data.resultList.length > 0 ? (
            <>
              <h3>默认配置数据 ({data.data.resultList.length} 条)</h3>
              <Table
                dataSource={data.data.resultList}
                columns={columns}
                rowKey="ruleType"
                pagination={false}
                size="small"
                expandable={{
                  expandedRowRender: (record) => (
                    <div style={{ margin: 0 }}>
                      <h4>配置内容:</h4>
                      <pre style={{
                        background: '#f5f5f5',
                        padding: '10px',
                        borderRadius: '4px',
                        maxHeight: '300px',
                        overflow: 'auto',
                        fontSize: '12px'
                      }}>
                        {record.configuration}
                      </pre>

                      <h4 style={{ marginTop: '20px' }}>解析结果:</h4>
                      <div style={{
                        background: '#f9f9f9',
                        padding: '10px',
                        borderRadius: '4px',
                        maxHeight: '300px',
                        overflow: 'auto',
                        fontSize: '12px'
                      }}>
                        {(() => {
                          try {
                            const config = JSON.parse(record.configuration);
                            return (
                              <pre>{JSON.stringify(config, null, 2)}</pre>
                            );
                          } catch (error: any) {
                            return (
                              <div style={{ color: 'red' }}>
                                解析失败: {error.message}
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  ),
                }}
              />
            </>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <p>没有获取到默认配置数据</p>
                <p>可能的原因：</p>
                <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                  <li>接口返回空数据</li>
                  <li>规则类型不存在</li>
                  <li>网络或代理问题</li>
                  <li>接口未实现</li>
                </ul>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default TestDefaultConfig;