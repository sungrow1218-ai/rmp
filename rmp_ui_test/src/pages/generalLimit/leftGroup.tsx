// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { DeleteOutlined, EditOutlined } from '@ht-icons/sprite-ui-react';
import { debounce } from 'lodash';
import { TableAction } from '@/components/Table';
import { useMemoizedFn } from 'ahooks';
import styles from './styles.less';
import {
  alterGeneralLimitGroup,
  GeneralLimitGroupParams,
  GeneralLimitGroupSetting,
  queryGeneralLimitGroup,
  GeneralLimitGroupList,
} from '@/services/generalLimit';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import { MenuAuthListParamType } from '../roleManage/contant/typing';
import { useUserRoles } from '@/hooks';
import useEIP from '@/directives/useEIP';
import { ColumnsType } from 'antd/es/table';

interface Props {
  groupKey: number | undefined;
  handleChangeGroupKey: (value: number | undefined, dataAuth: boolean) => void;
  size: number;
  menuAuth: Nullable<MenuAuthListParamType>;
}

const GroupListContain = ({
  groupKey,
  handleChangeGroupKey,
  menuAuth,
  size,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<GeneralLimitGroupList[]>([]);
  const [form] = Form.useForm();
  const [value, setValue] = useState('');
  const [type, setType] = useState('1'); // 1新增 2改 3删除
  const [selectItem, setSelectItem] = useState<GeneralLimitGroupList | null>(
    null
  );

  const [_, eipRef] = useEIP();

  const { activeRoleId } = useUserRoles();
  const isAddNewGroup = useRef(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 权限-读写
  const operatePermission = useMemo(() => {
    if (menuAuth) {
      const auth =
        menuAuth.functionAuthList?.find(
          (item) => item.functionId === FUNC_TYPE.OPERATE
        )?.useAuth === USE_AUTH.USED;
      return !!auth;
    }
    return false;
  }, [menuAuth]);

  // 权限-查询
  const queryPermission = useMemo(() => {
    if (menuAuth) {
      const auth =
        menuAuth.functionAuthList?.find(
          (item) => item.functionId === FUNC_TYPE.QUERY
        )?.useAuth === USE_AUTH.USED;
      return !!auth;
    }
    return false;
  }, [menuAuth]);

  // 权限-数据
  const dataPermission = (data: Recordable & { createRoleId: number }) =>
    data.createRoleId === activeRoleId;

  const onChange: InputProps['onChange'] = (e) => {
    const _value = e.target?.value.trim() ?? '';
    setValue(_value);
    if (queryPermission) {
      queryGroup(_value);
    }
  };

  const confirmKey = (data: GeneralLimitGroupList[]) => {
    if (isAddNewGroup.current) {
      for (const item of data) {
        const oldObj = tableData.find((p) => p.groupId === item.groupId);
        if (!oldObj) {
          handleChangeGroupKey(
            item?.groupId ?? undefined,
            dataPermission(item) ?? false
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
          data[0]?.groupId ?? undefined,
          dataPermission(data[0]) ?? false
        );
      }
    } else {
      handleChangeGroupKey(
        data[0]?.groupId ?? undefined,
        dataPermission(data[0]) ?? false
      );
    }
  };

  const queryGroup = useMemoizedFn(async (_value) => {
    try {
      setTableLoading(true);
      const quleQueryParams: GeneralLimitGroupParams = {
        pageId: 1,
        pageSize: 5000,
        // filterCondition: {},
      };
      if (_value) {
        quleQueryParams.filterCondition = {
          groupName: _value,
        };
      }
      const result = await queryGeneralLimitGroup(quleQueryParams);
      if (result.code !== 0) {
        return;
      }
      if (result.data?.resultList && result.data?.resultList.length > 0) {
        setTableData(result.data?.resultList);
        confirmKey(result.data?.resultList);
        setTableData(result.data?.resultList);
      } else {
        setTableData([]);
        handleChangeGroupKey(undefined, false);
      }
    } catch (error) {
      //  message.error({ content: `${JSON.stringify(error)}` });
    } finally {
      setTableLoading(false);
    }
  });

  const onRefetch = () => {
    if (queryPermission) {
      queryGroup(value);
    }
  };

  useEffect(() => {
    if (queryPermission) {
      queryGroup('');
    }
  }, [queryPermission]);

  const editGroup = (_type: string, record: GeneralLimitGroupList | null) => {
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
    async (alterType: number, record: GeneralLimitGroupList | null) => {
      try {
        setTableLoading(true);
        const queryParams: GeneralLimitGroupSetting = {
          alterType,
          groupId: record?.groupId ?? 0,
        };

        if (alterType !== 3) {
          const formData = await form.validateFields();
          queryParams.groupName = formData.groupName?.trim() as string;
        }
        const result = await alterGeneralLimitGroup(queryParams);
        if (result.code !== 0) {
          return;
        }
        setOpen(false);
        if (alterType === 1) {
          isAddNewGroup.current = true;
        }
        message.success('操作成功');
        onRefetch();
      } catch (error) {
        // message.error({ content: `${JSON.stringify(error)}` });
      } finally {
        setTableLoading(false);
      }
    }
  );

  const columns: ColumnsType<GeneralLimitGroupList> = [
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
            operatePermission && dataPermission(record)
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

  return (
    <div className={styles.leftGroup} ref={tableContainerRef}>
      <div className={styles.searchInput}>
        <Input
          className={styles.inputBox}
          allowClear={true}
          onChange={debounce(onChange, 500)}
          placeholder="请输入分组名称"
        />
        {operatePermission ? (
          <Button
            type="primary"
            style={{ marginLeft: '24px' }}
            ref={eipRef}
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
        columns={columns}
        scroll={{ y: size ? size - 188 : undefined }}
        onRow={(record) => {
          return {
            onClick: () => {
              if (queryPermission) {
                handleChangeGroupKey(record.groupId, dataPermission(record));
              }
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
              {
                validator: (_, _value: string) => {
                  if (_value && _value.trim() === '') {
                    return Promise.reject('请输入分组名称');
                  }
                  if (_value && _value.toString().length > 64) {
                    return Promise.reject('名称长度不超过64个字符');
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
