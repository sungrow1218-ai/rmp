// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Input,
  InputProps,
  message,
  Popconfirm,
  Table,
  Modal,
  Form,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { DeleteOutlined, EditOutlined } from '@ht-icons/sprite-ui-react';
import { debounce } from 'lodash';
import { TableAction } from '@/components/Table';
import { useMemoizedFn } from 'ahooks';
import {
  FutureGroupParams,
  FutureGroupSetting,
  GroupList,
  queryEditGroup,
  queryFutureOptionLimitGroup,
} from '@/services/FutureOption';
import styles from '../style.less';
import { FunAuthType } from './auth';
import { useUserRoles } from '@/hooks';
import useEIP from '@/directives/useEIP';

interface Props {
  groupKey: number;
  handleChangeGroupKey: (value: number, isAuth: boolean) => void;
  menuFunAuth: FunAuthType;
  size: number;
}
const GroupListContain = ({
  groupKey,
  handleChangeGroupKey,
  menuFunAuth,
  size,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<GroupList[]>([]);
  const [form] = Form.useForm();
  const [value, setValue] = useState('');
  const [type, setType] = useState('1'); // 1新增 2改 3删除
  const [selectItem, setSelectItem] = useState<GroupList | null>(null);

  const isAddNewGroup = useRef(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const onChange: InputProps['onChange'] = (e) => {
    const _value = e.target?.value.trim() ?? '';
    setValue(_value);
    queryGroup(_value);
  };
  const { activeRoleId } = useUserRoles();
  const [_, eipRef] = useEIP();
  const confirmKey = (data: GroupList[]) => {
    if (isAddNewGroup.current) {
      for (const item of data) {
        const oldObj = tableData.find((p) => p.groupId === item.groupId);
        if (!oldObj) {
          handleChangeGroupKey(
            item?.groupId ?? false,
            activeRoleId === item?.createRoleId
          );
        }
        if (tableContainerRef.current) {
          // 找到 Table 的内置滚动容器（ant-table-body）
          const scrollBody = tableContainerRef.current.querySelector(
            '.riskControlPlatformAntd-table-body'
          );
          if (scrollBody) {
            (scrollBody as HTMLElement).scrollTop = 0;
          }
        }
      }
      isAddNewGroup.current = false;
    } else if (groupKey) {
      const isExist = data.find((item) => item.groupId === groupKey);
      if (!isExist) {
        handleChangeGroupKey(
          data[0]?.groupId ?? 0,
          activeRoleId === data[0]?.createRoleId
        );
      }
    } else {
      handleChangeGroupKey(
        data[0]?.groupId ?? 0,
        activeRoleId === data[0]?.createRoleId
      );
    }
  };
  const queryGroup = useMemoizedFn(async (_value) => {
    try {
      if (!menuFunAuth.queryAuth) {
        setTableData([]);
        return;
      }
      setTableLoading(true);
      const quleQueryParams: FutureGroupParams = {
        pageId: 1,
        pageSize: 5000,
        // filterCondition: {},
      };
      if (_value) {
        quleQueryParams.filterCondition = {
          groupName: _value,
        };
      }
      const result = await queryFutureOptionLimitGroup(quleQueryParams);
      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message}`,
        // });
        return;
      }
      if (result.data?.resultList && result.data?.resultList.length > 0) {
        setTableData(result.data?.resultList);
        confirmKey(result.data?.resultList);
      } else {
        setTableData([]);
        handleChangeGroupKey(0, false);
      }
    } catch (error) {
      // message.error({ content: `${JSON.stringify(error)}` });
    } finally {
      setTableLoading(false);
    }
  });

  const onRefetch = () => {
    queryGroup(value);
  };

  useEffect(() => {
    queryGroup('');
  }, [menuFunAuth?.queryAuth]);
  const columns: ColumnsType<GroupList> = [
    {
      title: '序号',
      align: 'center',
      width: 80,
      dataIndex: 'groupId',
    },
    {
      title: '分组名称',
      dataIndex: 'groupName',
      ellipsis: true,
      render: (_value) => {
        return <div className={styles.groupName}>{_value}</div>;
      },
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'groupId',
      width: 100,
      render: (_, record) => (
        <TableAction
          stopButtonPropagation={true}
          className={styles.actionStyle}
          actions={
            menuFunAuth.editAuth && record.createRoleId === activeRoleId
              ? [
                  {
                    label: (
                      <EditOutlined
                        ref={eipRef}
                        onClick={() => {
                          editGroup('2', record);
                        }}
                      />
                    ),
                    divider: true,
                  },
                  {
                    label: (
                      <Popconfirm
                        title="是否确认删除?"
                        okText="是"
                        cancelText="否"
                        onConfirm={(e) => editGroupData(3, record)}
                      >
                        <DeleteOutlined ref={eipRef} />
                      </Popconfirm>
                    ),
                    divider: false,
                  },
                ]
              : undefined
          }
        />
      ),
    },
  ];
  const editGroup = (_type: string, record: GroupList | null) => {
    if (_type === '2') {
      setType('2');
      form.setFieldValue('groupId', record?.groupId);
      form.setFieldValue('groupName', record?.groupName);
    }
    if (_type === '1') {
      setType('1');
      form.setFieldValue('groupId', '');
    }
    setSelectItem(record);
    setOpen(true);
  };

  const editGroupData = useMemoizedFn(
    async (alterType: number, record: GroupList | null) => {
      try {
        setTableLoading(true);
        const queryParams: FutureGroupSetting = {
          alterType,
          groupId: record?.groupId ?? 0,
        };

        if (alterType !== 3) {
          const formData = await form.validateFields();
          queryParams.groupName = formData.groupName?.trim() as string;
        }
        const result = await queryEditGroup(queryParams);
        if (result.code !== 0) {
          // message.error({
          //   content: `${result.message}`,
          // });
          return;
        }
        setOpen(false);
        message.success('操作成功');
        if (alterType === 1) {
          isAddNewGroup.current = true;
        }
        onRefetch();
      } catch (error) {
        // message.error({ content: `${JSON.stringify(error)}` });
      } finally {
        setTableLoading(false);
      }
    }
  );
  return (
    <div className={styles.leftGroup} ref={tableContainerRef}>
      <div className={styles.searchInput}>
        <Input
          allowClear={true}
          onChange={debounce(onChange, 500)}
          placeholder="请输入分组名称"
        />
        {menuFunAuth.editAuth ? (
          <Button
            ref={eipRef}
            type="primary"
            style={{ marginLeft: '24px' }}
            onClick={() => {
              editGroup('1', null);
              form.resetFields();
            }}
          >
            新增分组
          </Button>
        ) : null}
      </div>
      <Table
        rowKey={'groupId'}
        pagination={false}
        loading={tableLoading}
        dataSource={tableData}
        size="small"
        scroll={{ y: size ? size - 184 : undefined }}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => {
              handleChangeGroupKey(
                record.groupId,
                record.createRoleId === activeRoleId
              );
            },
          };
        }}
        rowClassName={(record) => {
          if (record?.groupId === groupKey) {
            return `${styles.rowHover} ${styles.rowActive}`;
          } else {
            return styles.rowHovert;
          }
        }}
      />
      <Modal
        width={420}
        open={open}
        centered={true}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          editGroupData(Number(type), selectItem);
        }}
        title={type === '1' ? '新增限仓分组' : '修改限仓分组'}
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ flex: 1 }}>
          <Form.Item label="分组序号" name="groupId">
            <Input placeholder="自动生成" disabled={true} />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true },
              { max: 64, message: '名称长度不超过64个字符' },
              {
                validator: (_, _value: string) => {
                  if (_value && _value.trim() === '') {
                    return Promise.reject('请输入分组名称');
                  }
                  return Promise.resolve();
                },
              },
            ]}
            label="分组名称"
            name="groupName"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default GroupListContain;
