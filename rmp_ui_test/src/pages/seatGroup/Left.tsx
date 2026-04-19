// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Tree,
  Popconfirm,
  Empty,
  Spin,
  Form,
  Input,
  Select,
  message,
  Divider,
} from '@ht/sprite-ui';
import type { TreeNodeProps } from 'rc-tree/lib/TreeNode';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { transformTree } from '@/utils/transformFiles';

import { useUserRoles } from '@/hooks';
import styles from './style.less';
import EditPoolLevelModal from './components/EditPoolLevelModal';
import { converToTreeData } from './contants/contants';
import { isArray, isEmpty } from 'lodash';
import { SeatGroupParams, SeatGroupState } from './contants/tyeping';
import { FormProps } from 'rc-field-form/es/Form';
import {
  MenuAuthListParamType,
  WorkGroupAuthList,
} from '../roleManage/contant/typing';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import useEIP from '@/directives/useEIP';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';
import { alterSeatGroup, querySeatGroup } from '@/services/seatGroup';

interface CustomTreeNodeProps extends TreeNodeProps {
  level?: number;
  id?: number;
  record: SeatGroupState;
}
const CustomTreeNode: React.FC<CustomTreeNodeProps> = Tree.TreeNode;

interface SeatLeftProps {
  changeKey: (value: any) => void;
  menuAuth: Nullable<MenuAuthListParamType>;
  workGroupAuth: WorkGroupAuthList[];
}

const LeftSide: React.FC<SeatLeftProps> = ({
  changeKey,
  menuAuth,
  workGroupAuth,
}) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const { activeRoleId } = useUserRoles();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectRecord, setSelectRecord] = useState({});
  const [formBasic] = Form.useForm();
  const [mode, setMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [levelType, setLevelType] = useState<'PoolLevelForm'>('PoolLevelForm');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

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

  const getInitData = async (form?: SeatGroupParams) => {
    try {
      setLoading(true);
      const seatResult = await querySeatGroup({
        pageId: 1,
        pageSize: 5000,
        filterCondition: isEmpty(form) ? undefined : form,
      });
      if (seatResult.code === 0) {
        if (seatResult.data && isArray(seatResult.data.resultList)) {
          const tree = transformTree(
            workGroupAuth,
            seatResult.data.resultList, // 增加子集按照secuPoolId数字大小顺序排序
            {
              parentKey: 'workGroupId',
            }
          );
          const _list = converToTreeData(
            JSON.parse(JSON.stringify(tree, null, 2))
          ).filter((r: { level: number }) => !!r.level);
          setTreeData(_list);
        } else {
          setTreeData([]);
        }
      } else {
        // console.error({
        //   content: `${seatResult.message}`,
        // });
      }
    } catch (error) {
      console.error({ content: `${JSON.stringify(error)}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    changeKey({ key: undefined, level: 0 });
    setSelectedKeys([]);
    if (queryPermission) {
      getInitData();
    }
  }, [activeRoleId, queryPermission]);

  const editName = (
    data: any,
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setMode('EDIT');
    setVisible(true);
    setLevelType('PoolLevelForm');
    setSelectRecord(data);
  };

  const delPool = async (
    data: any,
    event: React.MouseEvent<HTMLSpanElement, MouseEvent> | undefined
  ) => {
    if (event) {
      event.stopPropagation();
    }
    const res = await alterSeatGroup({
      modifyType: 3,
      workGroupId: data.workGroupId,
      seatGroupId: data.seatGroupId,
      seatGroupName: data.seatGroupName,
      marketId: data.marketId,
      remark: data.remark,
    });
    if (res.code === 0) {
      changeKey({ key: undefined, level: 0 });
      setSelectedKeys([]);
      if (queryPermission) {
        getInitData();
      }
    } else {
      // message.error(`操作失败：${res.message}`);
    }
  };

  const renderTreeNode = (data: any) => (
    <CustomTreeNode
      title={
        <div className={styles.customIcon}>
          {data.level === 1 ? (
            <>
              <div className={styles.wrap}>
                <div className={styles.name}>{data.workGroupName ?? ''}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  width: '100px',
                  paddingRight: '16px',
                }}
              >
                {showAddBtn ? (
                  <PlusOutlined
                    style={{ color: '#bb744a' }}
                    ref={eipRef}
                    onClick={() => {
                      setMode('ADD');
                      setVisible(true);
                      setLevelType('PoolLevelForm');
                      setSelectRecord({ workGroupId: data.workGroupId });
                    }}
                  />
                ) : null}
              </div>
            </>
          ) : (
            <>
              <div className={styles.wrap}>
                <div className={styles.name}>{data.seatGroupName ?? ''}</div>
                {data.marketId ? (
                  <div className={styles.marketId}>
                    {transformDictCodeToNameHelper(
                      String(data.marketId),
                      TRADING_MARKETS
                    )}
                  </div>
                ) : null}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  width: '100px',
                  paddingRight: '16px',
                }}
              >
                {data.seatGroupId &&
                operatePermission &&
                dataPermission(data) ? (
                  <>
                    <EditOutlined
                      style={{ color: '#bb744a' }}
                      ref={eipRef}
                      onClick={(e) => editName(data, e)}
                    />
                    <Divider type="vertical" />
                    <Popconfirm
                      title="是否确认删除?"
                      onConfirm={(
                        e: React.MouseEvent<HTMLElement> | undefined
                      ) => delPool(data, e)}
                      okText="是"
                      cancelText="否"
                    >
                      <DeleteOutlined
                        style={{ color: '#bb744a' }}
                        ref={eipRef}
                      />
                    </Popconfirm>
                  </>
                ) : null}
              </div>
            </>
          )}
        </div>
      }
      key={`${data.level}-${data.key}`}
      level={data.level}
      id={data.key}
      selectable={data.level === 2}
      record={data}
    >
      {data.children.map((child: any) => renderTreeNode(child))}
    </CustomTreeNode>
  );

  const handleValChange: FormProps['onValuesChange'] = (_, allValues) => {
    if (queryPermission) {
      getInitData(allValues);
    }
  };

  const showAddBtn = useMemo(
    () => workGroupAuth.length > 0 && operatePermission,
    [workGroupAuth, operatePermission]
  );

  return (
    <>
      <div className={styles.searchInput}>
        <Form
          name="basic"
          autoComplete="off"
          onValuesChange={handleValChange}
          layout="inline"
          form={formBasic}
        >
          <Form.Item label="" name="seatGroupName">
            <Input
              prefix={<SearchOutlined />}
              placeholder="输入席位组名称"
              allowClear={true}
              style={{ width: '240px' }}
            />
          </Form.Item>
          <Form.Item label="" name="marketId" style={{ marginRight: '0px' }}>
            <Select
              options={transformDictToSelectOptionsNumber(
                TRADING_MARKETS.filter((tm) => ['1', '2'].includes(tm.code))
              )}
              placeholder="选择交易所"
              allowClear={true}
              style={{ width: '145px' }}
            />
          </Form.Item>
        </Form>
      </div>
      <div className={styles.searchTable}>
        {loading ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin />
          </div>
        ) : (
          <>
            {treeData.length > 0 ? (
              <Tree
                defaultExpandAll={true}
                onSelect={(keys, info) => {
                  if (keys.length > 0) {
                    changeKey({
                      key: (info.node as any).id,
                      record: (info.node as any).record,
                    });
                    setSelectedKeys(keys as string[]);
                  }
                }}
                autoExpandParent={true}
                selectedKeys={selectedKeys}
              >
                {treeData.map((node) => renderTreeNode(node))}
              </Tree>
            ) : (
              <Empty
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                image={NoDataSimpleSvg}
                description={'暂无数据'}
              />
            )}
          </>
        )}
      </div>
      {visible && (
        <EditPoolLevelModal
          mode={mode}
          onClose={() => {
            setVisible(false);
            setSelectRecord({});
          }}
          reFresh={(p?: any) => {
            if (p !== 'PoolDetailForm') {
              formBasic.resetFields();
              changeKey({ key: undefined, level: 0 });
              setSelectedKeys([]);
              if (queryPermission) {
                getInitData();
              }
            }
          }}
          levelType={levelType}
          selectRecord={selectRecord}
        />
      )}
    </>
  );
};

export default LeftSide;
