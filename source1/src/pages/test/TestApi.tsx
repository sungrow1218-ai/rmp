import React, { useState, useEffect } from 'react';
import { Button, message, Spin, Table } from 'antd';
import { queryRuleTemplateGroup, RuleTemplateGroupIDTO } from '@/services/api';
import useWorkGroup from '@/hooks/useWorkGroup';

const TestApi: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RuleTemplateGroupIDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 获取工作台信息
  const { activeWorkGroup, loading: workGroupLoading } = useWorkGroup();

  const testQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🧪 开始测试 queryRuleTemplateGroup 接口');

      // 构建 filterCondition，包含工作台ID
      const filterCondition: any[] = [];
      const filterParams: any = {};

      if (activeWorkGroup?.workGroupId) {
        filterParams.workGroupId = activeWorkGroup.workGroupId;
      }

      // 如果有任何参数，添加到 filterCondition
      if (Object.keys(filterParams).length > 0) {
        filterCondition.push(filterParams);
      }

      const params = {
        pageId: 1,
        pageSize: 5000, // 根据需求，查询5000条数据
        filterCondition: filterCondition.length > 0 ? filterCondition : undefined,
      };

      console.log('📤 请求参数:', params);

      const res = await queryRuleTemplateGroup(params);

      console.log('📥 响应数据:', res);

      if (res && res.errorId === 0) {
        setData(res.data?.resultList || []);
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

  useEffect(() => {
    // 组件加载时自动测试，但需要等待工作台加载完成
    if (!workGroupLoading && activeWorkGroup) {
      testQuery();
    }
  }, [workGroupLoading, activeWorkGroup]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ruleTmplGroupId',
      key: 'ruleTmplGroupId',
    },
    {
      title: '名称',
      dataIndex: 'ruleTmplGroupName',
      key: 'ruleTmplGroupName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => status === 1 ? '已启用' : '已停用',
    },
    {
      title: '创建人',
      dataIndex: 'createUserCode',
      key: 'createUserCode',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>API 接口测试</h1>
      <p>测试 queryRuleTemplateGroup 接口是否正常工作</p>

      <Button
        type="primary"
        onClick={testQuery}
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
          <p>正在测试接口...</p>
        </div>
      ) : (
        <>
          <h3>测试结果 ({data.length} 条数据)</h3>
          <Table
            dataSource={data}
            columns={columns}
            rowKey="ruleTmplGroupId"
            pagination={false}
            size="small"
          />
        </>
      )}
    </div>
  );
};

export default TestApi;