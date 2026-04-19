// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ListContext } from '@/hooks/useListClick';
import { Button, message, Table } from '@ht/sprite-ui';
import styles from '@/pages/roleManage/styles.less';
import { cloneDeep } from 'lodash';
import { useSize } from 'ahooks';
import { MenuInfoResType } from '@/pages/roleManage/contant/typing';
import {
  alterRoleFunctionAuthority,
  queryMenuInfo,
} from '@/services/roleManage';
import {
  AuthType,
  CheckEventFunction,
  DataType,
  getColumns,
  MenuAuth,
} from './data';
import {
  convertToTree,
  getAllChildrenNodes,
  getCancelParentMenuAuths,
  getCancelParentMenuAuthsByFunction,
  getParentMenuAuths,
} from './util';
import {
  CaretDownOutlined,
  CaretRightOutlined,
} from '@ht-icons/sprite-ui-react';
import useEIP from '@/directives/useEIP';
import useAuthState from '@/hooks/useAuthState';

const FunctionPermission = () => {
  const { selectedItem, authState, refreshAuthState } = useContext(ListContext);
  const [loading, setLoading] = useState(false);
  const [resetLoaing, setResetLoaing] = useState(false);
  const [submitLoaing, setSubmitLoaing] = useState(false);
  const domRef = useRef(null);
  const sizes = useSize(domRef);
  const [menuData, setMenuData] = useState<MenuInfoResType[]>([]);
  const [menuAuthData, setMenuAuthData] = useState<MenuAuth[]>([]);
  const [expandRowKeys, setExpandRowKeys] = useState<number[]>([]);

  const [authData, _] = useAuthState();

  // 提交操作
  const handleSubmit = async () => {
    try {
      setSubmitLoaing(true);
      const params = {
        alterType: 2,
        alterRoleId: selectedItem?.roleId,
        menuAuthList: menuAuthData.map((i) => ({
          menuId: i.menuId,
          useAuth: i.useAuth as number,
          empowerAuth: i.empowerAuth as number,
          functionAuthList: i.functionAuthList.map((func) => ({
            functionId: func.functionId,
            useAuth: func.useAuth as number,
          })),
        })),
      };
      const res = await alterRoleFunctionAuthority(params);
      if (res.code !== 0) {
        throw Error(res.message);
      }
      message.success('提交成功');
      refreshAuthState();
    } catch (error) {
      console.error(error);
      // message.error((error as any).message);
    } finally {
      setSubmitLoaing(false);
    }
  };

  // 重置操作
  const handleReset = () => {
    try {
      setResetLoaing(true);
      refreshAuthState();
    } catch (error) {
      console.error(error);
    } finally {
      setResetLoaing(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        // menudata获取状态根据菜单改造功能抉择
        setLoading(true);
        const res = await queryMenuInfo({
          pageId: 1,
          pageSize: 5000,
        });
        if (res.code !== 0) {
          throw Error('查询菜单功能失败');
        }
        setMenuData(res.data.resultList || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedItem) {
      fetch();
    }
  }, [selectedItem]);

  useEffect(() => {
    setExpandRowKeys(menuData.map((i) => i.menuId));
  }, [menuData]);

  // 权限改变
  useEffect(() => {
    if (authState && authState.menuAuthList) {
      const result: MenuAuth[] = [];
      for (const item of menuData) {
        const authMenu = authState.menuAuthList.find(
          (i) => i.menuId === item.menuId
        );
        const menuAuth: MenuAuth = {
          menuId: item.menuId,
          menuName: item.menuName,
          parentMenuId: item.parentMenuId,
          empowerAuth: authMenu?.empowerAuth ?? AuthType.NONE,
          useAuth: authMenu?.useAuth ?? AuthType.NONE,
          functionAuthList: [],
        };
        // 菜单-功能
        if (item.functionList) {
          for (const funcItem of item.functionList) {
            const authFunc = authMenu?.functionAuthList.find(
              (i) => i.functionId === funcItem.functionId
            );
            menuAuth.functionAuthList.push({
              functionId: funcItem.functionId,
              functionName: funcItem.functionName,
              useAuth: authFunc
                ? (authFunc.useAuth as AuthType)
                : AuthType.NONE,
            });
          }
        }
        result.push(menuAuth);
      }
      // 最外层菜单权限处理
      for (const item of result) {
        if (item.parentMenuId === -1) {
          item.empowerAuth = result.some(
            (i) =>
              i.parentMenuId === item.menuId &&
              i.empowerAuth === AuthType.CHECKED
          )
            ? AuthType.CHECKED
            : AuthType.NONE;
          item.useAuth = result.some(
            (i) =>
              i.parentMenuId === item.menuId && i.useAuth === AuthType.CHECKED
          )
            ? AuthType.CHECKED
            : AuthType.NONE;
        }
      }
      setMenuAuthData(result);
    }
  }, [menuData, authState?.menuAuthList]);

  // 转换树形结构
  const getTreeData = useMemo(() => {
    const treeData: DataType[] = convertToTree(menuAuthData);
    return treeData;
  }, [menuAuthData]);

  const [isEIP, eipRef] = useEIP();

  // 授权权限
  const handleCheck: CheckEventFunction = (node, key, checked) => {
    const clone = cloneDeep(menuAuthData);
    if (checked) {
      // 子节点
      const childNodes = getAllChildrenNodes(node);
      for (const item of childNodes) {
        const menuAuth = (authData?.menuAuthList || []).find(
          (i) => i.menuId === item.menuId
        );
        // 不可操作则跳过
        if (isEIP || !menuAuth || menuAuth.empowerAuth === AuthType.NONE)
          continue;
        if (item.functionId) {
          const target = clone
            .find((i) => i.menuId === item.menuId)!
            .functionAuthList.find((i) => i.functionId === item.functionId);
          target![key as 'useAuth'] = AuthType.CHECKED;
        } else {
          const target = clone.find((i) => i.menuId === item.menuId);
          target![key] = AuthType.CHECKED;
        }
      }
      // 当前节点
      if (node.functionId) {
        const target = clone
          .find((i) => i.menuId === node.menuId)!
          .functionAuthList.find((i) => i.functionId === node.functionId);
        target![key as 'useAuth'] = AuthType.CHECKED;
      } else {
        const target = clone.find((i) => i.menuId === node.menuId);
        target![key] = AuthType.CHECKED;
      }
      const target = clone.find((i) => i.menuId === node.menuId);
      target![key] = AuthType.CHECKED;
      // 父节点
      const parentNodes = getParentMenuAuths(node.parentMenuId, clone);
      parentNodes.forEach((i) => (i[key] = AuthType.CHECKED));
      setMenuAuthData(clone);
    } else {
      // 子节点
      const childNodes = getAllChildrenNodes(node);
      // 子节点存在选中并且无权限的则终止操作
      for (const item of childNodes) {
        const menuAuth = (authData?.menuAuthList || []).find(
          (i) => i.menuId === item.menuId
        );
        if (
          menuAuth &&
          menuAuth.empowerAuth === AuthType.NONE &&
          item[key] === AuthType.CHECKED
        )
          return;
      }
      for (const item of childNodes) {
        if (item.functionId) {
          const target = clone
            .find((i) => i.menuId === item.menuId)!
            .functionAuthList.find((i) => i.functionId === item.functionId);
          target![key as 'useAuth'] = AuthType.NONE;
        } else {
          const target = clone.find((i) => i.menuId === item.menuId);
          target![key] = AuthType.NONE;
        }
      }
      // 当前节点
      if (node.functionId) {
        const target = clone
          .find((i) => i.menuId === node.menuId)!
          .functionAuthList.find((i) => i.functionId === node.functionId);
        target![key as 'useAuth'] = AuthType.NONE;
      } else {
        const target = clone.find((i) => i.menuId === node.menuId);
        target![key] = AuthType.NONE;
      }
      // 需要取消的父节点
      if (node.functionId) {
        const cancelParents = getCancelParentMenuAuthsByFunction(
          node,
          key,
          clone
        );
        cancelParents.forEach((i) => (i[key] = AuthType.NONE));
      } else {
        const cancelParents = getCancelParentMenuAuths(
          clone.find((i) => i.menuId === node.menuId)!,
          key,
          clone
        );
        cancelParents.forEach((i) => (i[key] = AuthType.NONE));
      }
      setMenuAuthData(clone);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.content} ref={domRef}>
        <Table
          columns={getColumns(handleCheck, authData?.menuAuthList || [], isEIP)}
          dataSource={getTreeData}
          loading={loading}
          pagination={false}
          style={{ width: '100%', height: '100%' }}
          size={'middle'}
          scroll={{
            y: sizes ? sizes.height - 70 : undefined,
            x: undefined,
          }}
          expandable={{
            defaultExpandAllRows: true,
            expandedRowKeys: expandRowKeys,
            onExpandedRowsChange: (expandedRows) => {
              setExpandRowKeys(expandedRows as number[]);
            },
            expandIcon: ({ expanded, onExpand, record }) => {
              if (!record.children) return null;
              if (expanded) {
                return (
                  <CaretDownOutlined
                    style={{ color: '#6c6f76', marginRight: '10px' }}
                    onClick={(e) => onExpand(record, e)}
                  />
                );
              } else {
                return (
                  <CaretRightOutlined
                    style={{ color: '#6c6f76', marginRight: '10px' }}
                    onClick={(e) => onExpand(record, e)}
                  />
                );
              }
            },
          }}
        />
      </div>
      <div className={styles.btns}>
        <Button
          loading={resetLoaing}
          onClick={handleReset}
          disabled={loading}
          ref={eipRef}
        >
          重置
        </Button>
        <Button
          type="primary"
          loading={submitLoaing}
          onClick={handleSubmit}
          disabled={loading}
          ref={eipRef}
        >
          确定
        </Button>
      </div>
    </div>
  );
};
export default FunctionPermission;
