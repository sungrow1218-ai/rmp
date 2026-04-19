// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import {
  modifyRuleTemplateGroup,
  queryRuleTemplateGroup,
} from '@/services/ruleSetting';
import { RuleTemplateGroupIDTO } from '@/services/ruleSetting/idto';
import { Button, message, Modal, Pagination, Popconfirm, Table } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { Status } from '../type';
import type { PaginationProps } from 'antd';
import { useGetState } from 'ahooks';
import { useUserRoles } from '@/hooks';
import styles from './styles.less';
import { useAuthHook } from '@/hooks/useAuthhook';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import useEIP from '@/directives/useEIP';

const ResizableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0} // 垂直方向不进行拖拽
      onResize={onResize}
      axis="x"
      draggableOpts={{ enableUserSelectHack: false }}
      handle={<div className="resizable-handler"></div>}
    >
      <th {...restProps} />
    </Resizable>
  );
};

interface IParams {
  ruleTmplGroupId?: number;
  ruleTmplGroupName?: string;
  status?: Status;
  createUserCode?: string;
  pageId?: number;
  pageSize?: number;
}

export interface IProps {
  workGroupId?: number;
  inputColumns: Recordable[];
  domHeight: number;
  onView: (groupInfo: RuleTemplateGroupIDTO) => void;
  onEdit: (groupInfo: RuleTemplateGroupIDTO) => void;
  onClone: (groupInfo: RuleTemplateGroupIDTO) => void;
  onBind: (groupInfo: RuleTemplateGroupIDTO) => void;
  onDelete: () => void;
}

export interface IAction {
  reload: (params?: IParams) => void;
}

const TemplateGroupList = forwardRef<IAction, IProps>(
  (
    {
      workGroupId,
      inputColumns,
      domHeight,
      onView,
      onEdit,
      onClone,
      onBind,
      onDelete,
    },
    ref
  ) => {
    const [tmplList, setTmplList] = useState<RuleTemplateGroupIDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination, getPagination] =
      useGetState<PaginationProps>({
        current: 1,
        pageSize: 10,
        total: 0,
      });
    const [cacheParams, setCacheParams] = useState<IParams>();
    const [scroll, setScroll] = useState({ y: 400, x: '100%' });
    const columnsWidthMap = useRef<{ [key: string]: number }>({});
    const [columns, setColumns] = useState<any[]>([]);
    const [modal, contextHolder] = Modal.useModal();

    const [_, eipRef] = useEIP();

    useEffect(() => {
      setScroll({
        y: domHeight
          ? tmplList.length > 0
            ? domHeight - 80 - 48
            : domHeight - 80
          : 400,
        x: '100%',
      });
    }, [domHeight, tmplList]);

    const fetch = async (params?: IParams) => {
      if (!queryPermission) return;
      setLoading(true);
      try {
        const {
          ruleTmplGroupId,
          ruleTmplGroupName,
          status,
          createUserCode,
          pageId,
          pageSize,
        }: IParams = { ...(cacheParams || {}), ...(params || {}) };
        const pageInfo = getPagination();
        const res = await queryRuleTemplateGroup({
          pageId: pageId || pageInfo.current,
          pageSize: pageSize || pageInfo.pageSize,
          filterCondition: [
            {
              workGroupId,
              ruleTmplGroupId,
              ruleTmplGroupName,
              status,
              createUserCode,
            },
          ],
        });
        if (res.errorId !== 0) {
          throw Error(res.message);
        }
        if (res.data.resultList) {
          setTmplList(res.data.resultList);
        }
        setPagination({
          current: res.data.pageId,
          pageSize: res.data.pageSize,
          total: res.data.totalSize,
        });
        setCacheParams(params);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetch();
    }, []);

    useImperativeHandle(ref, () => ({
      reload: (params) => fetch(params),
    }));

    const { activeRoleId } = useUserRoles();

    const { menuAuth } = useAuthHook();

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

    useEffect(() => {
      const result = [];
      for (const item of (inputColumns as any[]) || []) {
        if (!columnsWidthMap.current[item.dataIndex]) {
          columnsWidthMap.current[item.dataIndex] = item.width;
        }
        result.push({ ...item, with: columnsWidthMap.current[item.dataIndex] });
      }
      result.push({
        title: '操作',
        dataIndex: 'action',
        width: 320,
        minWidth: 320,
        fixed: 'right',
        render(_: any, record: any) {
          return (
            <div className={styles.operationBox}>
              {dataPermission(record) && queryPermission ? (
                <Button
                  onClick={() => onView(record as RuleTemplateGroupIDTO)}
                  type="link"
                  color="primary"
                >
                  查看
                </Button>
              ) : null}
              {dataPermission(record) && operatePermission ? (
                <Button
                  onClick={() => onBind(record as RuleTemplateGroupIDTO)}
                  ref={eipRef}
                  type="link"
                  color="primary"
                >
                  绑定账户组
                </Button>
              ) : null}
              {dataPermission(record) && operatePermission ? (
                <Button
                  ref={eipRef}
                  onClick={async () => {
                    try {
                      const res = await modifyRuleTemplateGroup({
                        modifyType: 2,
                        ruleTmplGroupId: record.ruleTmplGroupId,
                        ruleTmplGroupName: record.ruleTmplGroupName,
                        description: record.description,
                        status:
                          record.status === Status.ENABLE
                            ? Status.DISABLE
                            : Status.ENABLE,
                        workGroupId: workGroupId!,
                      });
                      if (res.errorId !== 0) {
                        throw Error(res.message);
                      }
                      message.success('操作成功');
                      fetch();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  type="link"
                  color="primary"
                >
                  {record.status === Status.DISABLE ? '启用' : '禁用'}
                </Button>
              ) : null}
              {dataPermission(record) && operatePermission ? (
                <Button
                  ref={eipRef}
                  onClick={() => onEdit(record as RuleTemplateGroupIDTO)}
                  type="link"
                  color="primary"
                >
                  编辑
                </Button>
              ) : null}
              {dataPermission(record) && operatePermission ? (
                <Button
                  ref={eipRef}
                  onClick={() => onClone(record as RuleTemplateGroupIDTO)}
                  type="link"
                  color="primary"
                >
                  复制
                </Button>
              ) : null}
              {dataPermission(record) && operatePermission ? (
                <>
                  <Button
                    ref={eipRef}
                    type="link"
                    color="primary"
                    onClick={() => {
                      modal.confirm({
                        width: '436px',
                        title: '删除规则模板',
                        content: (
                          <div>
                            <p style={{ color: '#757575' }}>请确认是否删除?</p>
                            <p style={{ color: '#A1A1A1' }}>
                              删除将对模版内所有已勾选的规则进行删除，预警、拦截风控均不再生效，且删除后不可恢复，请谨慎操作。
                            </p>
                          </div>
                        ),
                        onOk: async () => {
                          try {
                            const res = await modifyRuleTemplateGroup({
                              modifyType: 3,
                              ruleTmplGroupId: record.ruleTmplGroupId,
                              ruleTmplGroupName: record.ruleTmplGroupName,
                              description: record.description,
                              status: record.status,
                              workGroupId: workGroupId!,
                            });
                            if (res.errorId !== 0) {
                              throw Error(res.message);
                            }
                            message.success('操作成功');
                            fetch();
                            onDelete();
                          } catch (error) {
                            console.error(error);
                          }
                        },
                      });
                    }}
                  >
                    删除
                  </Button>
                </>
              ) : null}
            </div>
          );
        },
      });
      setColumns(result);
    }, [inputColumns]);

    const handleResize = useCallback(
      (index: number) =>
        (_e: any, { size }: { size: { width: number; height: number } }) => {
          const nextColumns = [...columns];
          const finalWidth = Math.max(nextColumns[index].minWidth!, size.width);
          nextColumns[index] = {
            ...nextColumns[index],
            width: finalWidth,
          };
          columnsWidthMap.current[nextColumns[index].dataIndex] = size.width;
          setColumns(nextColumns);
        },
      [columns]
    );

    const mergedColumns = useMemo(
      () =>
        columns.map((col, index) => ({
          ...col,
          onHeaderCell: (column: any) => ({
            width: column.width,
            onResize: handleResize(index),
            minWidth: column.minWidth,
          }),
        })),
      [columns]
    );

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'start',
          flexDirection: 'column',
        }}
      >
        <div className={styles.tableBase} style={{ flex: '1 auto' }}>
          {contextHolder}
          <Table
            style={{ width: '100%', height: '100%' }}
            size="middle"
            loading={loading}
            dataSource={tmplList}
            columns={mergedColumns}
            pagination={false}
            scroll={scroll}
            components={{
              header: {
                cell: ResizableTitle,
              },
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'right',
          }}
        >
          <Pagination
            pageSizeOptions={['10', '20', '50', '100', '200']}
            showSizeChanger={true}
            style={{
              paddingTop: '5px',
            }}
            showQuickJumper={true}
            showTotal={(total) => `总数：${total}`}
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={(pageId, pageSize) => fetch({ pageId, pageSize })}
          />
        </div>
      </div>
    );
  }
);

export default TemplateGroupList;
