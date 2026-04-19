import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Input, InputProps, message, Popconfirm } from '@ht/sprite-ui';
// uuidv4：生成唯一标识符，用于标记选中角色的 key。
import { v4 as uuidv4 } from 'uuid';
import { ListContext } from '@/hooks/useListClick';
import styles from '../styles.less';

import EditApiModal from './EditApiFormModal';
import {
  BasicTable,
  BasicTableProps,
  TableAction,
  TableActionType,
} from '@/components/Table'; // 自定义表格组件
import { useSize } from 'ahooks';
import { debounce, isEmpty } from 'lodash';
import { alterRoleBaseInfo, queryRoleBaseInfo } from '@/services/roleManage';
import {
  ModalInfoState,
  RoleBaseInfoResState,
  RolePermissonProps,
} from '../contant/typing';
import useEIP from '@/directives/useEIP';
import { DeleteOutlined, EditOutlined } from '@ht-icons/sprite-ui-react';

const columnsRole: BasicTableProps['columns'] = [
  { title: '编号', dataIndex: 'roleId', width: '80px', align: 'center' },
  { title: '角色名称', dataIndex: 'roleName', align: 'left' },
];

const RoleList = () => {
  const { selectedItem, setSelectedItem, setRoleList } =
    useContext(ListContext);
  const [roleOpen, setRoleOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<ModalInfoState>({
    title: '',
    mode: 1,
  });
  const tableRef = useRef<TableActionType>(null); // 表格实例引用，用于调用 reload 方法刷新数据
  const [editRecord, setEditRecord] = useState<RolePermissonProps>({});
  const domRef = useRef(null); // domRef：表格容器引用，用于监听尺寸变化
  const sizes = useSize(domRef);

  const [_, eipRef] = useEIP();

  useEffect(() => {
    if (sizes?.height) {
      tableRef.current?.setProps({ scroll: { y: sizes.height - 96 } });
    }
  }, [sizes]);

  const handleClick = (item: Recordable) => {
    if (setSelectedItem) {
      setSelectedItem({ ...item, key: uuidv4() } as RoleBaseInfoResState & {
        key: string;
      });
    }
  };

  const handleSearch: InputProps['onChange'] = (e) => {
    const { value } = e.target;
    if (tableRef.current) {
      // 输入搜索内容时，调用表格的 reload 方法，更新搜索条件（queryRoleName）并重新加载数据
      tableRef.current.reload({
        pagination: { current: 1, pageSize: 5000 },
        searchInfo: {
          filterCondition: { queryRoleName: value || null },
        },
      });
    }
  };

  // 取消弹窗
  const onCancelRole = () => {
    setEditRecord({});
    setRoleOpen(false);
  };

  // 确认弹窗：关闭弹窗并刷新表格数据。
  const onConfirmRole = () => {
    onCancelRole();
    tableRef.current?.reload({
      pagination: { current: 1, pageSize: 5000 },
    });
  };

  // 设置弹窗为编辑模式，填充当前角色数据并打开弹窗
  const editRoleList = (item: any) => {
    setEditRecord(item);
    setModalInfo({
      title: '编辑角色',
      mode: 2,
    });
    setRoleOpen(true);
  };

  // 调用 alterRoleBaseInfo 接口删除角色，若失败则提示错误，成功后刷新表格
  const delRoleList = async (
    item: any,
    e?: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    const delRes = await alterRoleBaseInfo({
      alterType: 3,
      alterRoleId: item?.roleId,
    });
    if (delRes.code !== 0) {
      // message.error(delRes.message);
    } else {
      tableRef.current?.reload({
        pagination: { current: 1, pageSize: 5000 },
      });
      if (selectedItem && selectedItem.roleId === item.roleId) {
        setSelectedItem(undefined);
      }
    }
  };

  // 设置弹窗为新增模式，清空编辑数据并打开弹窗
  const addRoles = () => {
    setModalInfo({
      title: '新增角色',
      mode: 1,
    });
    setEditRecord({});
    setRoleOpen(true);
  };

  // 监听表格数据源变化，同步到 ListContext 的 roleList 中，供其他组件访问
  useEffect(() => {
    const dataSource = tableRef.current?.getDataSource();
    setRoleList(dataSource);
  }, [tableRef.current?.getDataSource()]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={domRef}>
      <div className={styles.searchInput}>
        <Input
          allowClear={true}
          onChange={debounce(handleSearch, 500)}
          placeholder="请输入角色名称"
        />
        <Button
          type="primary"
          style={{ marginLeft: '24px' }}
          onClick={addRoles}
          ref={eipRef}
        >
          新增
        </Button>
      </div>
      <BasicTable
        ref={tableRef}
        columns={columnsRole}
        style={{ height: '100%' }}
        pagination={false}
        rowKey={'roleId'}
        size="middle"
        onRowClick={handleClick}
        rowClassName={(record: any) => {
          if (!isEmpty(record) && record.roleId === selectedItem?.roleId) {
            return `${styles.rowStyle} ${styles.rowActive}`;
          } else {
            return styles.rowStyle;
          }
        }}
        actionColumn={{
          width: 100,
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: false,
          render: (value: any, record: any) => (
            <TableAction
              stopButtonPropagation={true}
              actions={[
                {
                  label: (
                    <EditOutlined
                      ref={eipRef}
                      onClick={() => editRoleList(record)}
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
                      onConfirm={(e) => delRoleList(record, e)}
                    >
                      <DeleteOutlined ref={eipRef} />
                    </Popconfirm>
                  ),
                  divider: false,
                },
              ]}
            />
          ),
        }}
        fetchSetting={{ listField: 'data.resultList' }}
        searchInfo={{ pageId: 1, pageSize: 5000 }}
        api={queryRoleBaseInfo}
        immediate={true}
        showIndexColumn={false}
      />
      <EditApiModal
        title={modalInfo.title}
        open={roleOpen}
        onConfirm={onConfirmRole}
        onCancel={onCancelRole}
        apiServe={alterRoleBaseInfo}
        initialValues={editRecord}
        formItems={[
          {
            name: 'roleId',
            label: '角色序号',
            disabled: true,
            placeholder: '自动生成',
          },
          {
            name: 'roleName',
            label: '角色名称',
            placeholder: '请输入角色名称',
            rules: [{ required: true, message: '请输入角色' }],
          },
          {
            name: 'roleDescrip',
            placeholder: '角色描述',
            label: '角色描述',
          },
        ]}
        // 新增模式（mode: 1）：alterType: 1。编辑模式（mode: 2）：alterType: 2。
        requsetParams={
          modalInfo.mode === 1
            ? {
                alterType: 1,
                alterRoleId: 0,
              }
            : {
                alterType: 2,
                alterRoleId: editRecord?.roleId,
              }
        }
      />
    </div>
  );
};

export default RoleList;
