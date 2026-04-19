import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { message, Modal, Button, Input, Table, Empty } from '@ht/sprite-ui';
import { alterFun } from '../roleManage/contant/contants';
import { AlterRoleUsersParams } from '../roleManage/contant/typing';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';

const { Column } = Table;

interface Role {
  roleId: string;
  roleName: string;
}

interface AuthorizationModalProps {
  visible: boolean;
  onCancel: () => void;
  onAuthorize: (assignedRoles: string[]) => void;
  userCode: string;
  assignedRoles: string[];
  allRoles: Role[];
}

const AuthorizationModal: React.FC<AuthorizationModalProps> = ({
  visible,
  onCancel,
  onAuthorize,
  userCode,
  assignedRoles,
  allRoles,
}) => {
  const [searchText, setSearchText] = useState('');
  const [localAvailableRoles, setLocalAvailableRoles] = useState<Role[]>(
    allRoles.filter((role) => !assignedRoles.includes(role.roleId))
  );
  const [localAssignedRoles, setLocalAssignedRoles] =
    useState<string[]>(assignedRoles);
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<string[]>([]);
  const [toBeAssignedRoles, setToBeAssignedRoles] = useState<string[]>([]);
  const [toBeRemovedRoles, setToBeRemovedRoles] = useState<string[]>([]);
  const [leftPageSize, setLeftPageSize] = useState(5);
  const [rightPageSize, setRightPageSize] = useState(5);

  // 初始化本地状态
  useEffect(() => {
    const available = allRoles.filter(
      (role) => !assignedRoles.includes(role.roleId)
    );
    setLocalAvailableRoles(available);
    setLocalAssignedRoles(assignedRoles);
  }, [allRoles, assignedRoles]);

  useEffect(() => {
    setSelectedAvailable([]);
    setSelectedAssigned([]);
    setToBeAssignedRoles([]);
    setToBeRemovedRoles([]);
    setLeftPageSize(5);
    setRightPageSize(5);
  }, [visible]);

  // 重置处理
  const handleReset = () => {
    const available = allRoles.filter(
      (role) => !assignedRoles.includes(role.roleId)
    );
    setLocalAvailableRoles(available);
    setLocalAssignedRoles(assignedRoles);
    setSelectedAvailable([]);
    setSelectedAssigned([]);
    setToBeAssignedRoles([]);
    setToBeRemovedRoles([]);
  };

  // 搜索处理
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // 过滤未分配角色
  const filteredAvailableRoles = localAvailableRoles.filter(
    (role) =>
      role.roleName.includes(searchText) || role.roleId.includes(searchText)
  );

  // 过滤已分配角色
  const filteredAssignedRoles = localAssignedRoles
    .map((roleId) => allRoles.find((r) => r.roleId === roleId)!)
    .filter(
      (role) =>
        role.roleName.includes(searchText) || role.roleId.includes(searchText)
    );

  // 右移
  // 右移 - 分配角色
  const moveRight = () => {
    if (selectedAvailable.length === 0) return;

    // 新增绑定的角色
    const newAssigned = [...localAssignedRoles, ...selectedAvailable];
    setLocalAssignedRoles(newAssigned);

    // 从未分配列表中移除
    const newAvailable = localAvailableRoles.filter(
      (r) => !selectedAvailable.includes(r.roleId)
    );
    setLocalAvailableRoles(newAvailable);

    // 记录待绑定
    setToBeAssignedRoles((prev) => {
      const result = [...new Set([...prev, ...selectedAvailable])];
      return result.filter((i) => !assignedRoles.includes(i));
    });
    setToBeRemovedRoles((prev) =>
      prev.filter((id) => !selectedAvailable.includes(id))
    );

    setSelectedAvailable([]);
  };

  // 左移 - 解绑角色
  const moveLeft = () => {
    if (selectedAssigned.length === 0) return;

    // 从已分配中移除
    const newAssigned = localAssignedRoles.filter(
      (id) => !selectedAssigned.includes(id)
    );
    setLocalAssignedRoles(newAssigned);

    // 还原到未分配列表
    const newAvailable = [
      ...localAvailableRoles,
      ...selectedAssigned.map((id) => allRoles.find((r) => r.roleId === id)!),
    ];
    setLocalAvailableRoles(newAvailable);

    // 记录待解绑
    setToBeRemovedRoles((prev) => {
      const result = [...new Set([...prev, ...selectedAssigned])];
      const available = allRoles
        .filter((role) => !assignedRoles.includes(role.roleId))
        .map((i) => i.roleId);
      return result.filter((i) => !available.includes(i));
    });
    setToBeAssignedRoles((prev) =>
      prev.filter((id) => !selectedAssigned.includes(id))
    );

    setSelectedAssigned([]);
  };

  // useEffect(() => {
  //   console.log(toBeAssignedRoles, toBeRemovedRoles);
  // }, [toBeAssignedRoles, toBeRemovedRoles]);

  // 全选右移
  //   const moveAllRight = () => {
  //     // 获取所有未分配角色的 ID
  //     const availableRoleIds = localAvailableRoles.map((r) => r.roleId);

  //     // 更新已分配角色列表（去重）
  //     const newAssigned = [
  //       ...new Set([...localAssignedRoles, ...availableRoleIds]),
  //     ];
  //     setLocalAssignedRoles(newAssigned);

  //     // 清空未分配列表
  //     setLocalAvailableRoles([]);

  //     // 添加到“待绑定”列表（新增的角色）
  //     setToBeAssignedRoles((prev) => [
  //       ...new Set([...prev, ...availableRoleIds]),
  //     ]);

  //     // 注意：如果某个角色之前被解绑过，现在又分配，应从 toBeRemovedRoles 中移除
  //     setToBeRemovedRoles((prev) =>
  //       prev.filter((id) => !availableRoleIds.includes(id))
  //     );
  //   };

  //   // 全选左移
  //   const moveAllLeft = () => {
  //     // 获取所有已分配角色 ID
  //     const assignedRoleIds = localAssignedRoles;

  //     // 清空已分配列表
  //     setLocalAssignedRoles([]);

  //     // 将所有已分配角色还原到“未分配”列表（需从 allRoles 中查找完整信息）
  //     const newAvailable = assignedRoleIds.map(
  //       (id) => allRoles.find((r) => r.roleId === id)!
  //     );
  //     setLocalAvailableRoles(newAvailable);

  //     // 添加到“待解绑”列表
  //     setToBeRemovedRoles((prev) => [...new Set([...prev, ...assignedRoleIds])]);

  //     // 注意：如果某个角色之前被绑定过，现在又解绑，应从 toBeAssignedRoles 中移除
  //     setToBeAssignedRoles((prev) =>
  //       prev.filter((id) => !assignedRoleIds.includes(id))
  //     );
  //   };

  // 提交绑定
  const handleSave = async () => {
    // 1. 构建需要分配的角色列表（alterType = 1）
    const assignRoleUserList = toBeAssignedRoles.map((roleId) => ({
      alterRoleId: Number(roleId),
      userCodeList: [userCode],
    }));

    // 2. 构建需要解绑的角色列表（alterType = 3）
    const removeRoleUserList = toBeRemovedRoles.map((roleId) => ({
      alterRoleId: Number(roleId),
      userCodeList: [userCode],
    }));

    // 3. 准备两个符合 AlterRoleUsersParams 的请求体
    const requests: AlterRoleUsersParams[] = [];

    if (assignRoleUserList.length > 0) {
      requests.push({
        alterType: 1, // 分配
        roleUserList: assignRoleUserList,
      });
    }

    if (removeRoleUserList.length > 0) {
      requests.push({
        alterType: 3, // 解绑
        roleUserList: removeRoleUserList,
      });
    }

    // 4. 如果没有操作，直接关闭
    if (requests.length === 0) {
      message.info('没有需要操作的角色');
      onCancel();
      return;
    }

    console.log('提交的批量请求:', requests);

    try {
      // 5. 依次发送请求
      for (const request of requests) {
        const success = await alterFun(request);

        if (!success) {
          console.log('操作失败，终止后续操作');
          return;
        }
      }

      // 6. 所有操作成功后，更新状态并关闭弹窗
      onAuthorize([...localAssignedRoles]); // 更新父组件状态
      onCancel();
    } catch (error) {
      console.error('调用 alterFun 出错:', error);
      //  message.error('系统异常，请联系管理员');
    }
  };

  return (
    <Modal
      title={`为用户 ${userCode} 分配角色`}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="reset" onClick={handleReset}>
          重置
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          提交
        </Button>,
      ]}
      width={1000}
      destroyOnClose={true}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* 未分配角色区域 */}
        <div style={{ flex: 1, marginRight: 16, marginBottom: '-16px' }}>
          <div
            style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}
          >
            <Input
              placeholder="搜索角色"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              allowClear={true}
              style={{ width: 200 }}
            />
          </div>
          <Table
            dataSource={filteredAvailableRoles}
            rowKey="roleId"
            rowSelection={{
              selectedRowKeys: selectedAvailable,
              onChange: (keys: React.Key[]) =>
                setSelectedAvailable(keys as string[]),
            }}
            pagination={{
              pageSize: leftPageSize,
              showTotal: (total) => `总数：${total}`,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => setLeftPageSize(size),
            }}
            size="small"
            locale={{
              emptyText: (
                <Empty
                  style={{ minHeight: '162px' }}
                  image={NoDataSimpleSvg}
                  description={'暂无数据'}
                />
              ),
            }}
          >
            <Column
              title="角色编号"
              dataIndex="roleId"
              key="roleId"
              align="center"
              width={100}
            />
            <Column title="角色名称" dataIndex="roleName" key="roleName" />
          </Table>
        </div>
        {/* 移动按钮区域 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* <Button onClick={moveAllRight} style={{ margin: 4 }}>
            &gt;&gt;
          </Button> */}
          <Button onClick={moveRight} style={{ margin: 4 }}>
            &gt;
          </Button>
          <Button onClick={moveLeft} style={{ margin: 4 }}>
            &lt;
          </Button>
          {/* <Button onClick={moveAllLeft} style={{ margin: 4 }}>
            &lt;&lt;
          </Button> */}
        </div>
        {/* 已分配角色区域 */}
        <div style={{ flex: 1, marginLeft: 16, marginBottom: '-16px' }}>
          <div style={{ marginBottom: 16, lineHeight: '32px' }}>
            已分配角色 ({localAssignedRoles.length})
          </div>
          <Table
            dataSource={filteredAssignedRoles}
            rowKey="roleId"
            rowSelection={{
              selectedRowKeys: selectedAssigned,
              onChange: (keys: React.Key[]) =>
                setSelectedAssigned(keys as string[]),
            }}
            pagination={{
              pageSize: rightPageSize,
              showTotal: (total) => `总数：${total}`,
              showSizeChanger: true,
              onShowSizeChange: (_, size) => setRightPageSize(size),
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            size="small"
            locale={{
              emptyText: (
                <Empty
                  style={{ minHeight: '162px' }}
                  image={NoDataSimpleSvg}
                  description={'暂无数据'}
                />
              ),
            }}
          >
            <Column
              title="角色编号"
              dataIndex="roleId"
              key="roleId"
              align="center"
              width={100}
            />
            <Column title="角色名称" dataIndex="roleName" key="roleName" />
          </Table>
        </div>
      </div>
    </Modal>
  );
};

export default AuthorizationModal;
