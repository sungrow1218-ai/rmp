import {
  Button,
  Collapse,
  Divider,
  Empty,
  Input,
  InputProps,
  message,
  Popconfirm,
  Tooltip,
} from '@ht/sprite-ui';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './style.less';
import EditModal from './EditModal';
import { useModal } from '@/components/Modal';
import { debounce } from 'lodash';
import { DeleteOutlined, EditOutlined } from '@ht-icons/sprite-ui-react';
import { AlterType, DynamicDim, DynamicDimType } from './const';
import { MenuAuthListParamType } from '../roleManage/contant/typing';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import { useUserRoles } from '@/hooks';
import useEIP from '@/directives/useEIP';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import {
  alterDynamicDimension,
  queryDynamicDimension,
} from '@/services/dynamicDimension/index';

const { Panel } = Collapse;

const Search: React.FC<{
  onSelect: (record: Recordable | null) => void;
  menuAuth: Nullable<MenuAuthListParamType>;
}> = ({ onSelect, menuAuth }) => {
  const domRef = useRef(null);

  const [registerEdit, editMethods] = useModal();

  const [activeKey, setActiveKey] = useState<number | null>(null);

  const [dynamicList, setDynamicList] = useState<DynamicDim[]>([]);

  const { activeRoleId } = useUserRoles();

  const [_, eipRef] = useEIP();

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

  useEffect(() => {
    if (queryPermission) {
      getDynamicDimensionList();
    }
  }, [queryPermission]);

  // 获取动态维度列表
  const getDynamicDimensionList = async (params: Recordable = {}) => {
    try {
      const { code, data } = await queryDynamicDimension({
        pageId: 1,
        pageSize: 5000,
        ...params,
      });
      if (code !== 0) {
        message.error('查询动态维度列表失败');
        return;
      }
      setDynamicList(data.resultList || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getSystemDynamicList = useMemo(
    () => dynamicList.filter((i) => i.systemFlag === DynamicDimType.SYSTEM),
    [dynamicList]
  );

  const getCustomDynamicList = useMemo(
    () => dynamicList.filter((i) => i.systemFlag === DynamicDimType.CUSTOM),
    [dynamicList]
  );

  // 搜索处理
  const handleSearch: InputProps['onChange'] = (e) => {
    const { value } = e.target;
    if (queryPermission) {
      getDynamicDimensionList({
        filterCondition: { dyndimName: value || null },
      });
    }
  };

  // 单击处理-选中维度
  const handleClick = (record: DynamicDim) => {
    setActiveKey(record.dyndimId);
    onSelect(record);
  };

  // 双击处理-显示详情
  const handleDBClick = (record: DynamicDim) => {
    editMethods.openModal(true, {
      alterType: AlterType.VIEW,
      ...record,
    });
  };

  return (
    <>
      <div className={styles.searchInput}>
        <Input
          allowClear={true}
          onChange={debounce(handleSearch, 500)}
          placeholder="请填写维度名称"
        />
        {operatePermission ? (
          <Button
            type="primary"
            style={{ marginLeft: '24px' }}
            ref={eipRef}
            onClick={() =>
              editMethods.openModal(true, { alterType: AlterType.ADD })
            }
          >
            新建
          </Button>
        ) : null}
      </div>
      <div ref={domRef} className={styles.searchTable}>
        <Collapse
          ghost={true}
          style={{ padding: '0' }}
          defaultActiveKey={['system', 'custom']}
        >
          <Panel key={'system'} header="系统维度">
            {getSystemDynamicList.map((i) => (
              <div
                className={
                  i.dyndimId === activeKey
                    ? `${styles.listItem} ${styles.rowActive}`
                    : styles.listItem
                }
                key={i.dyndimId}
                onClick={() => handleClick(i)}
                onDoubleClick={() => handleDBClick(i)}
              >
                <div className={styles.index}>{i.dyndimId}</div>
                <Tooltip title={i.dyndimName}>
                  <div
                    className={styles.name}
                    style={{ width: 'calc(100% - 70px)' }}
                  >
                    {i.dyndimName || '--'}
                  </div>
                </Tooltip>
              </div>
            ))}
            {getSystemDynamicList.length === 0 && (
              <Empty image={NoDataSimpleSvg} description={'暂无数据'} />
            )}
          </Panel>
          <Panel key={'custom'} header="用户维度">
            {getCustomDynamicList.map((i) => (
              <div
                className={
                  i.dyndimId === activeKey
                    ? `${styles.listItem} ${styles.rowActive}`
                    : styles.listItem
                }
                key={i.dyndimId}
                onClick={() => handleClick(i)}
                onDoubleClick={() => handleDBClick(i)}
              >
                <div className={styles.index}>{i.dyndimId}</div>
                <Tooltip title={i.dyndimName}>
                  <div className={styles.name}>{i.dyndimName || '--'}</div>
                </Tooltip>
                {operatePermission && dataPermission(i) ? (
                  <div className={styles.action}>
                    <div
                      className={styles.actionItem}
                      ref={eipRef as any}
                      onClick={() =>
                        editMethods.openModal(true, {
                          alterType: AlterType.EDIT,
                          ...i,
                        })
                      }
                    >
                      <EditOutlined style={{ color: '#bb744a' }} />
                    </div>
                    <Divider type="vertical" />
                    <div
                      ref={eipRef as any}
                      className={styles.actionItem}
                      onClick={() => {}}
                    >
                      <Popconfirm
                        title="你确定要删除吗？"
                        onConfirm={async () => {
                          try {
                            const response = await alterDynamicDimension({
                              modifyType: AlterType.DELETE,
                              dyndimId: i.dyndimId,
                            });
                            if (response.code !== 0) {
                              // message.error(response.message);
                              return;
                            }
                            message.success('操作成功');
                            // 如果选中则取消
                            if (i.dyndimId === activeKey) {
                              onSelect(null);
                            }
                            if (queryPermission) {
                              getDynamicDimensionList();
                            }
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      >
                        <DeleteOutlined style={{ color: '#bb744a' }} />
                      </Popconfirm>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
            {getCustomDynamicList.length === 0 && (
              <Empty image={NoDataSimpleSvg} description={'暂无数据'} />
            )}
          </Panel>
        </Collapse>
      </div>
      <EditModal
        onRegister={registerEdit}
        onRefresh={() => {
          if (queryPermission) {
            getDynamicDimensionList();
          }
          setActiveKey(null);
          onSelect(null);
        }}
      />
    </>
  );
};

export default Search;
