import React from 'react';
import { Card, Typography, Alert, Space } from 'antd';
import AccountSystemExample from '@/components/AccountSystemExample';

const { Title, Text, Paragraph } = Typography;

const AccountSystemExamplePage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>账户系统接口示例页面</Title>
      <Paragraph>
        本页面展示了如何使用 <Text code>ops.ts</Text> 服务中的接口。
        这些接口包括：
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="接口说明"
          description={
            <div>
              <p>1. <Text strong>querySobIdByWorkGroupId</Text> - 通过workGroupId查询sobId</p>
              <p>2. <Text strong>querySetOfBook</Text> - 查询账户体系（账套）</p>
              <p>3. <Text strong>querySetOfBookbySobId</Text> - 通过sobId获取账户体系</p>
              <p>4. <Text strong>queryExternSystem</Text> - 查询外部交易系统</p>
            </div>
          }
          type="info"
          showIcon
        />

        <Card title="接口调用示例">
          <AccountSystemExample />
        </Card>

        <Card title="代码示例">
          <Text strong>1. 导入服务:</Text>
          <pre>
{`import {
  querySobIdByWorkGroupId,
  querySetOfBook,
  querySetOfBookbySobId,
  queryExternSystem,
} from '@/services/ops';`}
          </pre>

          <Text strong>2. 调用接口:</Text>
          <pre>
{`// 示例1: 通过workGroupId查询sobId
const handleQuerySobId = async () => {
  const result = await querySobIdByWorkGroupId(123);
  if (result.code === 0) {
    const workGroupItem = result.data.resultList[0];
    console.log('查询成功:', workGroupItem);
  }
};

// 示例2: 查询所有账套
const handleQueryAllSetOfBook = async () => {
  const result = await querySetOfBook({
    pageId: 1,
    pageSize: 10,
  });
  console.log('账套列表:', result.data?.resultList);
};`}
          </pre>

          <Text strong>3. 在组件中使用:</Text>
          <pre>
{`import React, { useState, useEffect } from 'react';
import { querySobIdByWorkGroupId } from '@/services/ops';

const MyComponent: React.FC = () => {
  const [workGroupInfo, setWorkGroupInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await querySobIdByWorkGroupId(123);
      if (result.code === 0) {
        setWorkGroupInfo(result.data.resultList[0]);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {workGroupInfo && (
        <div>
          <p>工作台ID: {workGroupInfo.workGroupId}</p>
          <p>账套ID: {workGroupInfo.sobId}</p>
        </div>
      )}
    </div>
  );
};`}
          </pre>
        </Card>

        <Card title="接口返回格式">
          <Text strong>成功响应:</Text>
          <pre>
{`{
  "code": 0,
  "message": "success",
  "data": {
    "resultList": [
      {
        "workGroupId": 123,
        "workGroupName": "测试工作台",
        "sobId": 456
      }
    ],
    "pageId": 1,
    "pageSize": 1,
    "totalSize": 1
  }
}`}
          </pre>

          <Text strong>错误响应:</Text>
          <pre>
{`{
  "code": 1001,
  "message": "工作台不存在",
  "data": null
}`}
          </pre>
        </Card>
      </Space>
    </div>
  );
};

export default AccountSystemExamplePage;