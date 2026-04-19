// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
} from '@ht/sprite-ui';
import styles from './styles.less';
import { BasicColumn, BasicTable, TableActionType } from '@/components/Table';
import { isArray } from 'lodash';
import {
  alterRoleUsers,
  queryRoleBaseInfo,
  queryRoleUsers,
} from '@/services/roleManage';
import {
  GroupedUserData,
  RoleBaseInfoResState,
  RoleUserListType,
  RoleUsersState,
} from '../roleManage/contant/typing';
import { v4 as uuidv4 } from 'uuid';
import useEIP from '@/directives/useEIP';
import AuthorizationModal from './AuthorizationModal';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import { useHeightResize } from '@/hooks';
import UserModal, { IAction } from './Modal';

const { confirm } = Modal;

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [isAuthorizationModalVisible, setIsAuthorizationModalVisible] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<GroupedUserData | null>(
    null
  );
  const tableRef = useRef<TableActionType>(null);
  const [roleUserData, setRoleUserData] = useState<RoleUsersState[]>([]);
  const [roleData, setRoleData] = useState<RoleBaseInfoResState[]>([]);

  const modalRef = useRef<IAction>(null);
  const [form] = Form.useForm();

  const [_, eipRef] = useEIP();

  // 获取用户
  const fetchUser = async (opt?: Recordable) => {
    setLoading(true);
    try {
      const res = await queryRoleUsers({
        pageId: 1,
        pageSize: 5000,
        filterCondition: opt,
      });
      if (res.code !== 0) {
        message.error('获取用户角色信息失败');
        throw new Error(res.message);
      }
      if (res.data.resultList) {
        setRoleUserData(res.data.resultList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 获取角色
  const fetchRole = async () => {
    try {
      const res = await queryRoleBaseInfo({
        pageId: 1,
        pageSize: 5000,
      });
      if (res.code !== 0) {
        message.error('获取角色信息失败');
        throw new Error(res.message);
      }
      if (res.data.resultList) {
        setRoleData(res.data.resultList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRole();
    fetchUser();
  }, []);

  const getTableData = useMemo(() => {
    const groupedMap = new Map<
      string,
      { roles: string[]; lastUpdateTime?: string }
    >();
    roleUserData.forEach((item) => {
      const { userCode } = item;
      if (!groupedMap.has(userCode)) {
        groupedMap.set(userCode, {
          roles: [],
          lastUpdateTime: item.lastUpdateTime,
        });
      }
      const userGroup = groupedMap.get(userCode)!;
      userGroup.roles.push(item.roleName);
    });
    const parseData: GroupedUserData[] = Array.from(groupedMap.entries()).map(
      ([userCode, groupData]) => {
        return {
          userCode,
          roles: groupData.roles.join(', '),
          key: uuidv4(),
        };
      }
    );
    return parseData;
  }, [roleUserData]);

  // 搜索
  const handleSearch = () => {
    const params = form.getFieldsValue();
    fetchUser(params);
  };

  const getRoleOption = useMemo(
    () => roleData.map((i) => ({ label: i.roleName, value: i.roleId })),
    [roleData]
  );

  // 新建用户
  const doConfirm = async (values: { [x: string]: any; roleId: any[] }) => {
    let roleUserList: any[] = [];
    if (isArray(values.roleId)) {
      roleUserList = values.roleId.map((p: any) => {
        return {
          alterRoleId: p,
          userCodeList: [values?.userCode],
        };
      });
    }
    try {
      const result = await alterRoleUsers({
        alterType: 1,
        roleUserList,
      });
      if (result.code !== 0) {
        message.error(result.message || '操作失败');
        throw Error(result.message);
      }
      handleSearch();
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleAuthorize = (record: GroupedUserData) => {
    setSelectedUser(record);
    setIsAuthorizationModalVisible(true);
  };

  // 注销
  const handleRevoke = (record: GroupedUserData) => {
    confirm({
      title: '确认注销',
      content: `确定要注销用户 ${record.userCode} 的所有角色吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const userRoles = roleUserData.filter(
          (item) => item.userCode === record.userCode
        );
        const roleUserListReq: RoleUserListType[] = userRoles.map((item) => ({
          alterRoleId: item.roleId,
          userCodeList: [item.userCode],
        }));
        if (roleUserListReq.length === 0) {
          message.warning('该用户没有可注销的角色');
          return;
        }
        try {
          const result = await alterRoleUsers({
            alterType: 3,
            roleUserList: roleUserListReq,
          });
          if (result.code !== 0) {
            message.error(result.message || '操作失败');
            throw Error(result.message);
          }
          handleSearch();
        } catch (error: any) {
          console.error(error);
        }
      },
    });
  };

  const getAssignedRoles = (userCode: string): string[] => {
    return roleUserData
      .filter((item) => item.userCode === userCode)
      .map((item) => `${item.roleId!}`);
  };

  const columns: BasicColumn[] = [
    {
      title: '用户编码',
      dataIndex: 'userCode',
      width: 200,
    },
    {
      title: '授权角色',
      dataIndex: 'roles',
      align: 'left',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (_, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            onClick={() => handleAuthorize(record)}
          >
            授权
          </Button>
          <Button
            type="link"
            size="small"
            danger={true}
            onClick={() => handleRevoke(record)}
          >
            注销
          </Button>
        </Space>
      ),
    },
  ];

  const ref = useRef(null);

  const size = useHeightResize(ref);

  return (
    <div className={styles.userManage} ref={ref}>
      <div className={styles.title}>
        <img src={TitleImgSrc} style={{ width: '24px', height: '24px' }} />
        <span>用户管理</span>
      </div>
      <div className={styles.userList}>
        <div className={styles.actionBar}>
          <Form layout="inline" form={form} onValuesChange={handleSearch}>
            <Form.Item label="用户编码" name={'userCode'}>
              <Input
                allowClear={true}
                placeholder="请输入用户编码"
                style={{ width: '300px' }}
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item label="角色名称" name={'queryRoleId'}>
              <Select
                style={{ width: '300px' }}
                placeholder="请选择角色"
                options={getRoleOption}
                allowClear={true}
              />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  form.resetFields();
                  handleSearch();
                }}
                htmlType="reset"
              >
                重置
              </Button>
            </Form.Item>
          </Form>
          <Button
            type="primary"
            style={{ marginLeft: '24px' }}
            onClick={() => modalRef.current?.open()}
            ref={eipRef}
          >
            新增
          </Button>
        </div>
        <div style={{ height: 'calc(100% - 64px)' }}>
          <BasicTable
            ref={tableRef}
            columns={columns}
            pagination={false}
            rowKey={'key'}
            dataSource={getTableData}
            scroll={{ y: size ? size - 200 : undefined }}
            loading={loading}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
      <UserModal ref={modalRef} roleData={roleData} onConfirm={doConfirm} />
      <AuthorizationModal
        visible={isAuthorizationModalVisible}
        onCancel={() => setIsAuthorizationModalVisible(false)}
        onAuthorize={() => handleSearch()}
        userCode={selectedUser?.userCode || ''}
        assignedRoles={getAssignedRoles(selectedUser?.userCode || '')}
        allRoles={roleData.map((i) => ({
          roleId: `${i.roleId}`,
          roleName: i.roleName,
        }))}
      />
    </div>
  );
};

export default UserList;
