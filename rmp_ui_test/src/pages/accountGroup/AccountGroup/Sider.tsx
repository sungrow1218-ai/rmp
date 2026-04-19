import { Empty, Spin, Tooltip, Tree } from '@ht/sprite-ui';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ResponseAccountGroupItem } from '@/services/accountGroup';
import {
  DeleteOutlined,
  FolderOpenOutlined,
  PlusOutlined,
} from '@ht-icons/sprite-ui-react';
import styles from './styles.less';
import { SelectedItem, TreeData } from './data';
import { MenuAuthListParamType } from '@/pages/roleManage/contant/typing';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import { useUserRoles } from '@/hooks';
import useEIP from '@/directives/useEIP';
import { WorkGroupList } from '@/services/account';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import { useLocation } from '@oula/oula';
import { getUrlParams } from '@/pages/processManage/contant/contants';

interface Props {
  accountGroups: ResponseAccountGroupItem[];
  selected?: SelectedItem;
  onSelect: (acctGroupId: number) => void;
  onAdd: (workGroupItem: TreeData) => void;
  onDelete: (selected: TreeData) => void;
  menuAuth: Nullable<MenuAuthListParamType>;
  loading: boolean;
  filterWorkGroupId?: number;
  workGroupList: WorkGroupList[];
}

const Sider: FC<Props> = ({
  accountGroups,
  selected,
  onSelect,
  onAdd,
  onDelete,
  menuAuth,
  loading,
  filterWorkGroupId,
  workGroupList,
}) => {
  const { activeRoleId } = useUserRoles();

  const [_, eipRef] = useEIP();

  const firstLoad = useRef<boolean>(false);

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

  // 权限-数据
  const dataPermission = (data: Recordable & { createRoleId: number }) =>
    data.createRoleId === activeRoleId;

  const convertToTree = (
    arr: ResponseAccountGroupItem[],
    workGroupNameMap: { [key: number]: Recordable }
  ) => {
    const tree: TreeData[] = [];
    for (const item of workGroupList) {
      // 工作台
      const workGroupItem = {
        key: String(item.workGroupId),
        workGroupId: item.workGroupId,
        workGroupName: item.workGroupName,
        sobId: item.sobId,
        isLeaf: false,
        title: (
          <div
            className={`${styles.item} ${
              selected && selected.workGroupId === item.workGroupId
                ? 'workgroupActive'
                : ''
            }`}
          >
            <div>{item.workGroupName}</div>
            {operatePermission ? (
              <PlusOutlined
                ref={eipRef}
                className={'sideIcon'}
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(workGroupItem);
                }}
              />
            ) : null}
          </div>
        ),
        selectable: false,
        children: [],
      };
      tree.push(workGroupItem);
    }
    for (const item of arr) {
      const exist = tree.find((i) => i.workGroupId === item.workGroupId);
      if (workGroupNameMap[item.workGroupId]) {
        const workGroupName =
          workGroupNameMap[item.workGroupId].name || '未知工作台';
        const { sobId } = workGroupNameMap[item.workGroupId];
        // 账户组
        const acctGroupItem: TreeData = {
          key: `${item.workGroupId}|${item.acctGroupId}`,
          workGroupId: item.workGroupId,
          workGroupName,
          sobId,
          acctGroupId: item.acctGroupId,
          acctGroupName: item.acctGroupName,
          acctGroupRemark: item.acctGroupRemark,
          createUserCode: item.createUserCode,
          createDateTime: item.createDateTime,
          lastUpdateTime: item.lastUpdateTime,
          dynamicFlag: item.dynamicFlag,
          bookType: item.bookType,
          bookLevel: item.bookLevel,
          createRoleId: item.createRoleId,
          isLeaf: true,
          selectable: true,
          title: (
            <div className={styles.item}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: 'calc(100% - 12px)',
                }}
              >
                <FolderOpenOutlined style={{ marginRight: '8px' }} />
                <Tooltip title={item.acctGroupName}>
                  <div className="acctGroupName">{item.acctGroupName}</div>
                </Tooltip>
              </div>
              {operatePermission && dataPermission(item) ? (
                <DeleteOutlined
                  ref={eipRef}
                  className={'sideIcon'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(acctGroupItem);
                  }}
                />
              ) : null}
            </div>
          ),
        };
        if (exist) {
          exist.children!.push(acctGroupItem);
        }
      }
    }
    if (filterWorkGroupId) {
      return tree.filter((i) => i.workGroupId === filterWorkGroupId);
    }
    return tree;
  };

  const getTreeData = useMemo(() => {
    if (accountGroups && workGroupList) {
      return convertToTree(
        accountGroups,
        workGroupList.reduce(
          (prev, cur) => ({
            ...prev,
            [cur.workGroupId]: { name: cur.workGroupName, sobId: cur.sobId },
          }),
          {}
        )
      );
    }
    return [];
  }, [accountGroups, workGroupList, selected]);

  const location = useLocation();

  const jumpSelectId = useMemo(() => {
    const url = window.location.href;
    const { accountGroupId } = getUrlParams(url);
    if (accountGroupId) {
      return Number(accountGroupId);
    }
    return undefined;
  }, [location]);

  useEffect(() => {
    if (getTreeData && !firstLoad.current) {
      let firstLeaf: TreeData | undefined;
      for (const { children } of getTreeData) {
        if (children && children.length > 0) {
          firstLeaf = children[0];
          break;
        }
      }
      if (firstLeaf) {
        if (jumpSelectId) {
          onSelect(jumpSelectId);
        } else {
          onSelect(firstLeaf.acctGroupId!);
        }
        firstLoad.current = true;
      }
    }
  }, [getTreeData]);

  useEffect(() => {
    if (jumpSelectId) {
      onSelect(jumpSelectId);
    }
  }, [jumpSelectId]);

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    setExpandedKeys(getTreeData.map((i) => i.key));
  }, [getTreeData]);

  return (
    <div className={styles.siderBlock}>
      {getTreeData.length > 0 ? (
        <Tree
          treeData={getTreeData}
          selectedKeys={
            selected ? [`${selected.workGroupId}|${selected.acctGroupId}`] : []
          }
          onSelect={(_, e) => {
            if (e.selected) {
              onSelect(e.node.acctGroupId!);
            }
          }}
          defaultExpandAll={true}
          expandedKeys={expandedKeys}
          onExpand={(keys) => setExpandedKeys(keys as string[])}
        />
      ) : (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Empty image={NoDataSimpleSvg} description={'暂无数据'} />
          {loading ? (
            <Spin
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Sider;
