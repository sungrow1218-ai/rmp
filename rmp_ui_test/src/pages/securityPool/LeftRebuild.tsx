// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Tree, message, Popconfirm, Empty, Spin, Divider } from 'antd';
import type { TreeNodeProps } from 'rc-tree/lib/TreeNode';
import { DictFeKeyEnumType, transformDictCodeToNameHelper } from '@/utils/dict';
import { PlusOutlined } from '@ant-design/icons';

import PoolFormEdit from '@/pages/securityPool/components/EditPoolLevelModal/PoolForm';

import { useUserRoles } from '@/hooks';
import styles from './style.less';
import EditPoolLevelModal from './components/EditPoolLevelModal';
import {
  ControlRangeListProps,
  LeftProps,
  QuerySecuPoolRspDto,
  SecurityPoolResponseDTO,
} from './contants/tyeping';
import {
  messageInfo,
  messageTopInfo,
} from './components/EditPoolLevelModal/PoolForm/message';
import { isProgress } from '../../components/IsProscess/InProcess';

import { usePoolAuthHook } from './contants/useAuthPool';
import useEIP from '@/directives/useEIP';
import { DeleteOutlined, EditOutlined } from '@ht-icons/sprite-ui-react';
import { isEip } from '@/utils/utils';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import {
  DeleteConfirm,
  IAction as DeleteConfirmAction,
} from '@/components/DeleteConfirm';
import { BasicColumn } from '@/components/Table';
import { useMemoizedFn, useSize } from 'ahooks';
import { DataKeyType, transformDataKey } from './contants/until';
import {
  alterSecurityPool,
  alterSecurityPoolLayer,
  querySecurityPool,
  querySecurityPoolLayer,
} from '@/services/securityPool/index';
import { WorkGroupList } from '@/services/account';

interface CustomTreeNodeProps extends TreeNodeProps {
  level?: number;
  id?: number;
  createRoleId: number;
}
export interface ParseDataType {
  workGroupId: number;
  workGroupName?: string;
  secuPoolLayerId?: number;
  secuPoolLayerName?: string;
  controlType?: number;
  acctLevel?: number;
  controlRangeList?: ControlRangeListProps[];
  createUserNo?: string;
  updateUserNo?: string;
  createDateTime?: number;
  lastUpdateTime?: number;
  createRoleId?: number;
  secuPoolId?: number;
  secuPoolName?: string;
  secuPoolType?: number;
  secuPoolCreateUserNo?: string;
  secuPoolUpdateUserNo?: string;
  secuPoolCreateDateTime?: number;
  secuPoolLastUpdateTime?: number;
  secuPoolCreateRoleId?: number;
}

interface TreeData {
  key: string;
  title: React.ReactNode;
  workGroupId?: number;
  workGroupName?: string;
  selectable?: boolean;
  isLeaf?: boolean;
  secuPoolLayerId?: number;
  secuPoolLayerName?: string;
  controlType?: number;
  acctLevel?: number;
  controlRangeList?: ControlRangeListProps[];
  createUserNo?: string;
  updateUserNo?: string;
  createDateTime?: number;
  lastUpdateTime?: number;
  createRoleId?: number;
  secuPoolId?: number;
  secuPoolName?: string;
  secuPoolType?: number;
  level: number;
  secuPoolCreateUserNo?: string;
  secuPoolUpdateUserNo?: string;
  secuPoolCreateDateTime?: number;
  secuPoolLastUpdateTime?: number;
  secuPoolCreateRoleId?: number;
  children?: TreeData[];
}

// 组合数据进行扁平化
const parseData = (
  data1: QuerySecuPoolRspDto[],
  data2: SecurityPoolResponseDTO[],
  workGroupList: WorkGroupList[]
) => {
  const result: any[] = [];
  for (const itemPool of data2) {
    let isOver = true;
    for (const item of data1) {
      if (item.secuPoolLayerId === itemPool.secuPoolLayerId) {
        result.push({
          workGroupId: item.workGroupId,
          workGroupName:
            workGroupList?.find((p) => p.workGroupId === item.workGroupId)
              ?.workGroupName ?? '',
          secuPoolLayerId: item.secuPoolLayerId,
          secuPoolLayerName: itemPool.secuPoolLayerName,
          controlType: itemPool.controlType,
          acctLevel: itemPool.acctLevel,
          controlRangeList: itemPool.controlRangeList,
          createUserNo: itemPool.createUserNo,
          updateUserNo: itemPool.updateUserNo,
          createDateTime: itemPool.createDateTime,
          lastUpdateTime: itemPool.lastUpdateTime,
          createRoleId: itemPool.createRoleId,
          secuPoolId: item.secuPoolId,
          secuPoolName: item.secuPoolName,
          secuPoolType: item.secuPoolType,
          secuPoolCreateUserNo: item.createUserNo,
          secuPoolUpdateUserNo: item.updateUserNo,
          secuPoolCreateDateTime: item.createDateTime,
          secuPoolLastUpdateTime: item.lastUpdateTime,
          secuPoolCreateRoleId: item.createRoleId,
        });
        isOver = false;
      }
    }
    if (isOver) {
      result.push({
        workGroupId: itemPool.workGroupId,
        workGroupName:
          workGroupList?.find((p) => p.workGroupId === itemPool.workGroupId)
            ?.workGroupName ?? '',
        secuPoolLayerId: itemPool.secuPoolLayerId,
        secuPoolLayerName: itemPool.secuPoolLayerName,
        controlType: itemPool.controlType,
        acctLevel: itemPool.acctLevel,
        controlRangeList: itemPool.controlRangeList,
        createUserNo: itemPool.createUserNo,
        updateUserNo: itemPool.updateUserNo,
        createDateTime: itemPool.createDateTime,
        lastUpdateTime: itemPool.lastUpdateTime,
        createRoleId: itemPool.createRoleId,
      });
    }
  }
  if (workGroupList) {
    const _workGroup = workGroupList.filter(
      (p) => !result?.find((q) => q.workGroupId === p.workGroupId)
    );
    _workGroup.forEach((item) => {
      result.push({
        workGroupId: item.workGroupId,
        workGroupName: item.workGroupName,
      });
    });
  }
  const data = result.filter((p) =>
    workGroupList.find((q) => q.workGroupId === p.workGroupId)
  );
  return data;
};

const LeftClassify: React.FC<LeftProps> = ({
  changeKey,
  setRiskAuth,
  searchObj,
  workGroupList,
  setSelectInfo,
}) => {
  const { activeRoleId } = useUserRoles();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectRecord, setSelectRecord] = useState({});

  const { editAuth, queryAuth } = usePoolAuthHook();

  const [mode, setMode] = useState<DictFeKeyEnumType['OPERATION_TYPES']>('ADD');
  const [levelType, setLevelType] =
    useState<keyof typeof PoolFormEdit>('PoolLevelForm');
  const [_, eipRef] = useEIP();
  const [selectedKey, setSelectedKey] = useState<string[]>(['-1']);

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const [authLayerList, setAuthLayerList] = useState<SecurityPoolResponseDTO[]>(
    []
  );
  const [deleteLayerData, setDeleteLayerData] = useState<
    ParseDataType | undefined
  >();
  const [parsePoolData, setParsePoolData] = useState<ParseDataType[]>([]);
  const [treeData, setTreeData] = useState<TreeData[]>([]);

  // 两组数据合并保存  判断新增了哪个数据，然后组合key 给数据选中效果
  const [allData, setAllData] = useState<DataKeyType[]>([]);

  console.log('====================================');
  console.log(parsePoolData);
  console.log('====================================');

  const queryTreeData = async (p?: any) => {
    try {
      if (!queryAuth && workGroupList) {
        return;
      }
      setLoading(true);
      const result = await querySecurityPoolLayer({
        pageId: 1,
        pageSize: 5000,
      });
      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message || '未知错误'}`,
        // });
        return;
      } else {
        const authList = result.data?.resultList?.filter(
          (i) => i.createRoleId === activeRoleId
        );
        setAuthLayerList(authList);
        const poolResult = await querySecurityPool({
          pageId: 1,
          pageSize: 5000,
        });
        if (poolResult.code === 0) {
          // 数据扁平化
          const list = parseData(
            poolResult.data?.resultList ?? [],
            result.data?.resultList ?? [],
            workGroupList
          );
          // 添加两组数据到all种
          const keyList = transformDataKey(
            result.data?.resultList,
            poolResult.data?.resultList
            // workGroupList,
          );
          // 添加之前判断是否新增了数据
          confirmAddKey(keyList);
          // 添加新的key
          setAllData([...keyList]);

          setParsePoolData(list);
        } else {
          // message.error({
          //   content: `${poolResult.message || '未知错误'}`,
          // });
          return;
        }
      }
    } catch (error) {
      console.error({ content: `${JSON.stringify(error)}` });
    } finally {
      setLoading(false);
    }
  };
  const deletdListRef = useRef<DeleteConfirmAction>(null);
  const filterArry = useMemo(() => {
    if (searchObj) {
      const list1 = parsePoolData?.filter((i) => {
        if (searchObj.secuPoolLayerName) {
          if (i.secuPoolLayerName) {
            return i.secuPoolLayerName.includes(searchObj.secuPoolLayerName);
          } else {
            return false;
          }
        } else {
          return i;
        }
      });
      const list2 = list1?.filter((i) => {
        if (searchObj.secuPoolName) {
          if (i.secuPoolName && i.secuPoolId) {
            return i.secuPoolName.includes(searchObj.secuPoolName);
          } else {
            return false;
          }
        } else {
          return i;
        }
      });
      const list3 = list2?.filter((i) => {
        if (searchObj.workGroupId) {
          return i.workGroupId === Number(searchObj.workGroupId);
        } else {
          return i;
        }
      });
      const list4 = list3?.filter((i) => {
        if (searchObj.creater) {
          if (i.createUserNo) {
            return i.createUserNo.includes(searchObj.creater);
          } else if (i.secuPoolCreateUserNo) {
            return i.secuPoolCreateUserNo.includes(searchObj.creater);
          } else {
            return false;
          }
        } else {
          return i;
        }
      });
      return list4;
    } else {
      return parsePoolData;
    }
  }, [searchObj, parsePoolData]);

  // 自动选中新增
  const addNewDataRef = useRef(false);
  const afterAddSubmit = () => {
    addNewDataRef.current = true;
  };
  const confirmAddKey = (data: DataKeyType[]) => {
    if (addNewDataRef.current) {
      // 遍历新数据和旧数据对比,找到新增数据
      for (const p of data) {
        const newKey = allData.find((i) => i.key === p.key);
        if (!newKey) {
          setSelectedKey([`${p.key}`]);
          if (p.level === 2) {
            changeKey(p.key);
            if (p.createRoleId === activeRoleId) {
              setRiskAuth(true);
              // 设置选中的信息，给右边信息卡片值
              setSelectInfo(p as any);
            } else {
              setRiskAuth(false);
              setSelectInfo(undefined);
            }
          }
          return;
        }
      }

      addNewDataRef.current = false;
    }
  };

  useEffect(() => {
    changeKey(undefined);
    if (queryAuth && workGroupList && workGroupList.length > 0) {
      queryTreeData();
    }
  }, [queryAuth, workGroupList]);

  useEffect(() => {
    const tree: TreeData[] = [];
    const workGourpMap = new Map();
    const expanded: string[] = [];
    for (const item of filterArry) {
      const {
        workGroupId,
        secuPoolLayerId,
        secuPoolLayerName,
        workGroupName,
        controlRangeList,
        createRoleId,
        secuPoolId,
        secuPoolName,
        secuPoolType,
        secuPoolCreateRoleId,
      } = item;
      const workGourpKey = `${workGroupId}-workGroup`;
      expanded.push(workGourpKey);
      if (!workGourpMap.has(workGourpKey)) {
        const workNode = {
          key: `${workGourpKey}`,
          selectable: false,
          title: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{workGroupName}</span>
              {editAuth && (
                <span
                  ref={eipRef}
                  style={{ color: '#bb744a', cursor: 'pointer' }}
                  onClick={() => {
                    setMode('ADD');
                    setVisible(true);
                    setLevelType('PoolLevelForm');
                    setSelectRecord(item);
                  }}
                >
                  <PlusOutlined />
                </span>
              )}
            </div>
          ),
          level: 0,
          children: [],
        };
        workGourpMap.set(workGourpKey, workNode);
        tree.push(workNode);
      }
      const workNode = workGourpMap.get(workGourpKey);
      if (!secuPoolLayerId) {
        continue;
      }
      const layerPoolKey = `${workGroupId}-${secuPoolLayerId}`;
      expanded.push(layerPoolKey);
      let layerPoolNode = workNode.children.find(
        (n: any) => n.key === layerPoolKey
      );
      if (!layerPoolNode) {
        layerPoolNode = {
          key: `${workGroupId}-${secuPoolLayerId}`,
          secuPoolLayerName,
          controlRangeList,
          secuPoolLayerId,
          workGroupName,
          workGroupId,
          secuPoolType,
          level: 1,
          selectable: true,
          children: null,
          createRoleId,
          title: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span className={styles.singleLine}>{secuPoolLayerName}</span>
              {editAuth && createRoleId === activeRoleId && (
                <span>
                  <span
                    ref={eipRef}
                    style={{
                      color: '#bb744a',
                      cursor: 'pointer',
                      paddingRight: '10px',
                    }}
                    onClick={() => {
                      setMode('ADD');
                      setVisible(true);
                      setLevelType('PoolForm');
                      setSelectRecord(item);
                    }}
                  >
                    <PlusOutlined />
                  </span>
                  <EditOutlined
                    style={{ color: '#bb744a', paddingRight: '10px' }}
                    onClick={(e) => editName({ ...item, level: 1 }, e)}
                  />

                  <Popconfirm
                    title="是否确认删除?"
                    onConfirm={(e) => {
                      delPool({ ...item, level: 1 }, e);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <DeleteOutlined style={{ color: '#bb744a' }} />
                  </Popconfirm>
                </span>
              )}
            </div>
          ),
        };
        workNode.children.push(layerPoolNode);
      }

      if (secuPoolId && secuPoolName) {
        const secuPoolKey = `${secuPoolId}`;
        expanded.push(secuPoolKey);
        if (layerPoolNode.children === null) {
          layerPoolNode.children = [];
        }
        layerPoolNode.children.push({
          key: secuPoolKey,
          secuPoolLayerName,
          controlRangeList,
          secuPoolLayerId,
          secuPoolName,
          workGroupName,
          workGroupId,
          secuPoolId,
          secuPoolType,
          level: 2,
          selectable: true,
          isLeaf: true,
          createRoleId,
          secuPoolCreateRoleId,
          children: [],
          title: (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span className={styles.singleLine}>{`${String(
                secuPoolId
              )}  ${secuPoolName}`}</span>
              {editAuth && secuPoolCreateRoleId === activeRoleId && (
                <span>
                  <EditOutlined
                    style={{ color: '#bb744a', paddingRight: '10px' }}
                    onClick={(e) => editName({ ...item, level: 2 }, e)}
                  />

                  <Popconfirm
                    title="是否确认删除?"
                    onConfirm={(e) => {
                      delPool({ ...item, level: 2 }, e);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <DeleteOutlined style={{ color: '#bb744a' }} />
                  </Popconfirm>
                </span>
              )}
            </div>
          ),
        });
      }
    }
    setExpandedKeys([...new Set(expanded)]);
    setTreeData(tree);
  }, [activeRoleId, editAuth, filterArry, workGroupList]);

  const editName = async (
    data: any,
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    if (isEip()) {
      message.warning(
        '该页面无权限，请前往堡垒机或者业务云操作，操作地址为http://eipnew.htsc.com.cn/aegis'
      );
      return;
    }

    const changeItemId =
      data.level === 1 ? data.secuPoolLayerId : data.secuPoolId;
    if (data.level === 1) {
      const list = await isProgress(201, changeItemId);
      if (list && list.length) {
        message.warning(messageInfo(4));
        return;
      }
    }
    setMode('EDIT');
    setVisible(true);
    setLevelType(data.level === 1 ? 'PoolLevelForm' : 'PoolForm');
    setSelectRecord(data);
  };

  const delPool = async (
    data: any,
    event: React.MouseEvent<HTMLSpanElement, MouseEvent> | undefined
  ) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const changeModule = data.level === 1 ? 201 : 202;
    const changeItemId =
      data.level === 1 ? data.secuPoolLayerId : data.secuPoolId;
    const list = await isProgress(changeModule, changeItemId);
    if (list && list.length) {
      message.warning(messageInfo(4));
      return;
    }
    if (isEip()) {
      message.warning(
        '该页面无权限，请前往堡垒机或者业务云操作，操作地址为http://eipnew.htsc.com.cn/aegis'
      );
      return;
    }
    if (data.level === 1) {
      setDeleteLayerData(data);
      const delelist = parsePoolData
        .filter(
          (p) => p.secuPoolLayerId === data.secuPoolLayerId && p.secuPoolId
        )
        ?.map((q) => ({ ...q, key: q.secuPoolId }));

      deletdListRef.current?.open(delelist);
    } else {
      const res = await alterSecurityPool({
        modifyType: 3,
        secuPoolLayerId: data.secuPoolLayerId,
        secuPoolName: data.secuPoolName,
        secuPoolId: data.secuPoolId,
        secuPoolType: data.secuPoolType,
        workGroupId: data.workGroupId,
      });
      if (res.code === 0) {
        changeKey(undefined);
        queryTreeData();
        setSelectedKey([]);
        setSelectInfo(undefined);
      } else if (res.code === 145003) {
        message.success({ content: messageTopInfo(3) });
        queryTreeData();
      } else {
        // message.error(`操作失败：${res.message || '未知错误'}`);
      }
    }
  };

  const deleteGroup = useMemoizedFn(async () => {
    const res = await alterSecurityPoolLayer({
      modifyType: 3,
      secuPoolLayerId: deleteLayerData?.secuPoolLayerId,
      workGroupId: deleteLayerData?.workGroupId,
      secuPoolLayerName: deleteLayerData?.secuPoolLayerName,
      controlType: deleteLayerData?.controlType,
      acctLevel:
        deleteLayerData?.controlType === 2
          ? deleteLayerData.acctLevel
          : undefined,
      controlRangeList: deleteLayerData?.controlRangeList,
    });
    if (res.code === 0) {
      changeKey(undefined);
      setSelectedKey([]);
    } else if (res.code === 145003) {
      message.success({ content: messageInfo(3) });
    } else {
      // message.error(`操作失败：${res.message || '未知错误'}`);
    }
    queryTreeData();
  });

  const onSelect = (y: any, info: Recordable) => {
    setSelectedKey([info.node.key]);
    if (info.node.level === 2) {
      changeKey(info.node.secuPoolId);

      if (info.node.secuPoolCreateRoleId === activeRoleId) {
        setRiskAuth(true);
        const secuInfo = parsePoolData.find(
          (p) => p.secuPoolId === info.node.secuPoolId
        );
        setSelectInfo(secuInfo);
      } else {
        setRiskAuth(false);
        setSelectInfo(undefined);
      }
    }
  };

  useEffect(() => {
    const fetchPropess = async () => {
      let progessFlag = false;

      if (parsePoolData && parsePoolData.length > 0) {
        progessFlag =
          parsePoolData.find((p) => p.secuPoolId === Number(selectedKey[0]))
            ?.secuPoolCreateRoleId === activeRoleId;
      }
      if (!progessFlag) {
        return;
      }
      const _list = await isProgress(203, Number(selectedKey));
      if (_list && _list.length) {
        message.warning(messageInfo(5));
      }
    };
    if (selectedKey && selectedKey.length > 0 && parsePoolData) {
      fetchPropess();
    }
  }, [authLayerList, selectedKey]);

  const deleteColomms = [
    {
      title: '证券池ID',
      dataIndex: 'secuPoolId',
    },
    {
      title: '证券池名称',
      dataIndex: 'secuPoolName',
    },
  ];
  const treeBoxRef = useRef(null);
  const size = useSize(treeBoxRef);

  return (
    <div className={styles.leftSecuPool}>
      {loading ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            overflowY: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spin />
        </div>
      ) : (
        <div
          ref={treeBoxRef}
          style={{
            height: '100%',
          }}
        >
          {treeData.length > 0 ? (
            <Tree
              defaultExpandAll={true}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKey}
              onSelect={onSelect}
              treeData={treeData}
              height={size?.height}
              blockNode={true}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
            />
          ) : (
            <Empty
              style={{
                height: 'calc(100%-110px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              image={NoDataSimpleSvg}
              description={'暂无数据'}
            />
          )}
        </div>
      )}
      {visible && (
        <EditPoolLevelModal
          mode={mode}
          afterAddSubmit={afterAddSubmit}
          authLayerList={authLayerList}
          workGroupList={workGroupList}
          onClose={() => {
            setVisible(false);
            setSelectRecord({});
          }}
          // reFresh={() => {}}
          reFresh={(p?: any) => {
            if (p !== 'PoolDetailForm') {
              queryTreeData();
            }
          }}
          levelType={levelType}
          selectRecord={selectRecord}
        />
      )}
      <DeleteConfirm
        alertMessage={
          <div>删除券池分组前，请先删除分组下的证券池，否则无法删除</div>
        }
        width={800}
        ref={deletdListRef}
        columns={deleteColomms as BasicColumn[]}
        api={deleteGroup}
        title="删除券池分组"
      />
    </div>
  );
};

export default LeftClassify;
