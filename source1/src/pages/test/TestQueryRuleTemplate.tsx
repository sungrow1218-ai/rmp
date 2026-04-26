import React, { useState } from 'react';
import { Button, message, Spin, Table, Card, Descriptions, Tag } from 'antd';
import { queryRuleTemplate } from '@/services/api';

const TestQueryRuleTemplate: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🧪 开始测试 queryRuleTemplate 接口');

      const params = {
        pageId: 1,
        pageSize: 1000,
        authorityFlag: 0,
        filterCondition: [{ ruleTmplGroupId: 2 }], // 使用已知的ruleTmplGroupId
      };

      console.log('📤 请求参数:', params);

      const res = await queryRuleTemplate(params);

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
        message.success(`获取数据成功，共 ${res.data?.totalSize || 0} 条记录`);
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
      title: 'ruleTemplateId',
      dataIndex: 'ruleTemplateId',
      key: 'ruleTemplateId',
    },
    {
      title: 'ruleType',
      dataIndex: 'ruleType',
      key: 'ruleType',
    },
    {
      title: 'securityGroupList长度',
      key: 'securityGroupListLength',
      render: (text: any, record: any) => record.securityGroupList?.length || 0,
    },
    {
      title: '阈值总数',
      key: 'thresholdCount',
      render: (text: any, record: any) => {
        const count = record.securityGroupList?.reduce((total: number, sg: any) => {
          return total + (sg.thresholdList?.length || 0);
        }, 0) || 0;
        return count;
      },
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>queryRuleTemplate 接口测试</h1>
      <p>测试 queryRuleTemplate 接口是否正常工作，使用 ruleTmplGroupId=2</p>

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
                <Tag color={data.errorId === 0 ? 'success' : 'error'}>
                  {data.errorId}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="errorMessage">
                {data.errorMessage || 'success'}
              </Descriptions.Item>
              <Descriptions.Item label="pageId">
                {data.data?.pageId}
              </Descriptions.Item>
              <Descriptions.Item label="pageSize">
                {data.data?.pageSize}
              </Descriptions.Item>
              <Descriptions.Item label="totalSize">
                {data.data?.totalSize}
              </Descriptions.Item>
              <Descriptions.Item label="resultList长度">
                {data.data?.resultList?.length || 0}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {data.data?.resultList && data.data.resultList.length > 0 && (
            <>
              <h3>规则模板数据 ({data.data.resultList.length} 条)</h3>
              <Table
                dataSource={data.data.resultList}
                columns={columns}
                rowKey="ruleTemplateId"
                pagination={false}
                size="small"
                expandable={{
                  expandedRowRender: (record) => (
                    <div style={{ margin: 0 }}>
                      <h4>securityGroupList 详情:</h4>
                      {record.securityGroupList?.map((sg: any, index: number) => (
                        <Card key={index} size="small" style={{ marginBottom: '10px' }}>
                          <Descriptions column={3} size="small">
                            <Descriptions.Item label="securityGroupId">
                              {sg.securityGroupId}
                            </Descriptions.Item>
                            <Descriptions.Item label="securityGroupName">
                              {sg.securityGroupName}
                            </Descriptions.Item>
                            <Descriptions.Item label="marketId">
                              {sg.marketId}
                            </Descriptions.Item>
                            <Descriptions.Item label="阈值数量" span={3}>
                              {sg.thresholdList?.length || 0}
                            </Descriptions.Item>
                          </Descriptions>

                          {sg.thresholdList && sg.thresholdList.length > 0 && (
                            <div style={{ marginTop: '10px' }}>
                              <h5>阈值列表:</h5>
                              <Table
                                dataSource={sg.thresholdList}
                                columns={[
                                  { title: 'thresholdId', dataIndex: 'thresholdId' },
                                  { title: 'warnLevel', dataIndex: 'warnLevel' },
                                  { title: 'compareDirection', dataIndex: 'compareDirection' },
                                  { title: 'value', dataIndex: 'value' },
                                  { title: 'unit', dataIndex: 'unit' },
                                  { title: 'factorType', dataIndex: 'factorType' },
                                  { title: 'setType', dataIndex: 'setType' },
                                  { title: 'effectiveFlag', dataIndex: 'effectiveFlag' },
                                ]}
                                rowKey={(record) => `${record.thresholdId}-${record.warnLevel}`}
                                pagination={false}
                                size="small"
                              />
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  ),
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TestQueryRuleTemplate;