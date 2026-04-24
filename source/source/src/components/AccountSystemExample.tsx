import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Typography,
  message,
  Spin,
  Row,
  Col,
  Tag,
} from 'antd';
import {
  querySobIdByWorkGroupId,
  querySetOfBook,
  querySetOfBookbySobId,
  queryExternSystem,
  type SobInfo,
  type ExtSysItem,
  type WorkGroupItem,
} from '@/services/ops';

const { Title, Text } = Typography;
const { Option } = Select;

const AccountSystemExample: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [workGroupId, setWorkGroupId] = useState<string>('123');
  const [sobId, setSobId] = useState<string>('');
  const [workGroupInfo, setWorkGroupInfo] = useState<WorkGroupItem | null>(null);
  const [sobInfo, setSobInfo] = useState<SobInfo | null>(null);
  const [externSystems, setExternSystems] = useState<ExtSysItem[]>([]);
  const [allSobInfos, setAllSobInfos] = useState<SobInfo[]>([]);

  // 1. 通过workGroupId查询sobId
  const handleQuerySobId = async () => {
    if (!workGroupId) {
      message.warning('请输入工作台ID');
      return;
    }

    setLoading(true);
    try {
      const result = await querySobIdByWorkGroupId(Number(workGroupId));

      if (result.code === 0 && result.data?.resultList?.length > 0) {
        const workGroupItem = result.data.resultList[0];
        setWorkGroupInfo(workGroupItem);
        setSobId(workGroupItem.sobId.toString());
        message.success('查询成功');
      } else {
        message.error(result.message || '查询失败');
      }
    } catch (error) {
      message.error('查询异常');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 2. 查询所有账套
  const handleQueryAllSetOfBook = async () => {
    setLoading(true);
    try {
      const result = await querySetOfBook({
        pageId: 1,
        pageSize: 10,
      });

      if (result.code === 0) {
        setAllSobInfos(result.data?.resultList || []);
        message.success(`查询到 ${result.data?.resultList?.length || 0} 个账套`);
      } else {
        message.error(result.message || '查询失败');
      }
    } catch (error) {
      message.error('查询异常');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 3. 通过sobId获取账户体系详情
  const handleQuerySetOfBookBySobId = async (id?: string) => {
    const targetSobId = id || sobId;
    if (!targetSobId) {
      message.warning('请先获取sobId');
      return;
    }

    setLoading(true);
    try {
      const result = await querySetOfBookbySobId(Number(targetSobId));

      if (result.code === 0 && result.data?.resultList?.length > 0) {
        const sobInfoItem = result.data.resultList[0];
        setSobInfo(sobInfoItem);
        message.success('账套详情查询成功');
      } else {
        message.error(result.message || '查询失败');
      }
    } catch (error) {
      message.error('查询异常');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 4. 查询外部交易系统
  const handleQueryExternSystem = async () => {
    if (!sobId) {
      message.warning('请先获取sobId');
      return;
    }

    setLoading(true);
    try {
      const result = await queryExternSystem({
        pageId: 1,
        pageSize: 100,
        filterCondition: { sobId: Number(sobId) },
      });

      if (result.code === 0) {
        setExternSystems(result.data?.resultList || []);
        message.success(`查询到 ${result.data?.resultList?.length || 0} 个交易系统`);
      } else {
        message.error(result.message || '查询失败');
      }
    } catch (error) {
      message.error('查询异常');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    handleQueryAllSetOfBook();
  }, []);

  // 账套表格列定义
  const sobColumns = [
    {
      title: '账套ID',
      dataIndex: 'sobId',
      key: 'sobId',
    },
    {
      title: '账套名称',
      dataIndex: 'sobName',
      key: 'sobName',
    },
    {
      title: '工作台ID',
      dataIndex: 'workGroupId',
      key: 'workGroupId',
      render: (workGroupId: number) => workGroupId || '-',
    },
    {
      title: '账户类型数量',
      dataIndex: 'bookList',
      key: 'bookList',
      render: (bookList: any[]) => bookList?.length || 0,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SobInfo) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => {
              setSobId(record.sobId.toString());
              handleQuerySetOfBookBySobId(record.sobId.toString());
            }}
          >
            查看详情
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setSobId(record.sobId.toString());
              setWorkGroupId(record.workGroupId?.toString() || '');
            }}
          >
            设为当前
          </Button>
        </Space>
      ),
    },
  ];

  // 交易系统表格列定义
  const systemColumns = [
    {
      title: '系统ID',
      dataIndex: 'extSysId',
      key: 'extSysId',
    },
    {
      title: '系统名称',
      dataIndex: 'extSysName',
      key: 'extSysName',
    },
    {
      title: '账套ID',
      dataIndex: 'sobId',
      key: 'sobId',
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>账户系统接口示例</Title>
      <Text type="secondary">展示如何调用账户系统相关接口</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* 左侧：接口调用区域 */}
        <Col span={12}>
          <Card title="接口调用" bordered={false}>
            <Spin spinning={loading}>
              {/* 接口1: querySobIdByWorkGroupId */}
              <Card size="small" title="1. 通过workGroupId查询sobId" style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <Input
                      placeholder="请输入工作台ID"
                      value={workGroupId}
                      onChange={(e) => setWorkGroupId(e.target.value)}
                      style={{ width: 200 }}
                    />
                    <Button type="primary" onClick={handleQuerySobId}>
                      查询
                    </Button>
                  </Space>
                  {workGroupInfo && (
                    <div>
                      <Text strong>查询结果:</Text>
                      <div>工作台ID: {workGroupInfo.workGroupId}</div>
                      <div>工作台名称: {workGroupInfo.workGroupName}</div>
                      <div>账套ID: {workGroupInfo.sobId}</div>
                    </div>
                  )}
                </Space>
              </Card>

              {/* 接口2/3: querySetOfBook */}
              <Card size="small" title="2. 查询账户体系（账套）" style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button onClick={handleQueryAllSetOfBook}>查询所有账套</Button>
                  <div>
                    <Text strong>当前账套总数: {allSobInfos.length}</Text>
                  </div>
                </Space>
              </Card>

              {/* 接口3: querySetOfBookbySobId */}
              <Card size="small" title="3. 通过sobId获取账户体系详情" style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <Input
                      placeholder="请输入账套ID"
                      value={sobId}
                      onChange={(e) => setSobId(e.target.value)}
                      style={{ width: 200 }}
                    />
                    <Button
                      type="primary"
                      onClick={() => handleQuerySetOfBookBySobId()}
                      disabled={!sobId}
                    >
                      查询详情
                    </Button>
                  </Space>
                </Space>
              </Card>

              {/* 接口4: queryExternSystem */}
              <Card size="small" title="4. 查询外部交易系统">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    onClick={handleQueryExternSystem}
                    disabled={!sobId}
                  >
                    查询当前账套的交易系统
                  </Button>
                  <div>
                    <Text strong>查询到的交易系统数: {externSystems.length}</Text>
                  </div>
                </Space>
              </Card>
            </Spin>
          </Card>
        </Col>

        {/* 右侧：结果显示区域 */}
        <Col span={12}>
          <Card title="当前账套详情" bordered={false} style={{ marginBottom: 16 }}>
            {sobInfo ? (
              <div>
                <div>
                  <Text strong>账套ID: </Text>
                  <Tag color="blue">{sobInfo.sobId}</Tag>
                </div>
                <div>
                  <Text strong>账套名称: </Text>
                  <Tag color="green">{sobInfo.sobName}</Tag>
                </div>
                <div>
                  <Text strong>工作台ID: </Text>
                  {sobInfo.workGroupId ? (
                    <Tag color="orange">{sobInfo.workGroupId}</Tag>
                  ) : (
                    <Text type="secondary">未关联</Text>
                  )}
                </div>
                <div style={{ marginTop: 16 }}>
                  <Text strong>账户类型:</Text>
                  {sobInfo.bookList.map((book, index) => (
                    <div key={index} style={{ marginLeft: 16, marginTop: 8 }}>
                      <div>
                        <Text type="secondary">类型{index + 1}: </Text>
                        类型代码: {book.bookType}, 深度: {book.bookDepth}
                      </div>
                      <div style={{ marginLeft: 16 }}>
                        <Text type="secondary">层级列表:</Text>
                        {book.bookLevelList.map((level, levelIndex) => (
                          <Tag key={levelIndex} style={{ margin: '4px' }}>
                            {level.bookLevel}: {level.bookLevelName}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Text type="secondary">暂无账套详情，请先查询</Text>
            )}
          </Card>

          <Card title="交易系统列表" bordered={false}>
            <Table
              columns={systemColumns}
              dataSource={externSystems}
              rowKey="extSysId"
              size="small"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 账套列表 */}
      <Card title="账套列表" bordered={false} style={{ marginTop: 24 }}>
        <Table
          columns={sobColumns}
          dataSource={allSobInfos}
          rowKey="sobId"
          size="small"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default AccountSystemExample;