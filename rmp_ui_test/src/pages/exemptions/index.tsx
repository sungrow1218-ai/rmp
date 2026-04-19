import { SearchOutlined, PlusOutlined } from '@ht-icons/sprite-ui-react';
import styles from './style.less';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import { Button, Input, message, Popconfirm } from '@ht/sprite-ui';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHeightResize } from '@/hooks';
import {
  BasicColumn,
  BasicTable,
  TableAction,
  TableActionType,
} from '@/components/Table';
import { DelIcon, EditIcon } from '../roleManage/contant/iconSvg';
import FormModal, { ModalActionType } from './FormModal';
import { AlterType, Mode } from './data';
import { queryWorkGroup } from '@/services/account';
import { RULE_TYPE_LEVEL_2, transformDictCodeToNameHelper } from '@/utils/dict';
import withKeepAlive from '@/wrappers/KeepAlive';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import {
  alterRuleApproveExempt,
  queryRuleApproveExempt,
} from '@/services/exemptions/index';

const RuleExemptions = () => {
  const domRef = useRef(null);

  const domHeight = useHeightResize(domRef);

  const tableRef = useRef<TableActionType>(null);

  const [searchValue, setSearchValue] = useState('');

  const [workGroupMap, setWorkGroupMap] = useState<Recordable>({});

  useEffect(() => {
    queryWorkGroup({ pageId: 1, pageSize: 5000 })
      .then((res) => {
        if (res.code !== 0) {
          throw new Error('获取工作台信息失败');
        }
        if (!res.data || res.data.resultList.length === 0) {
          throw new Error('未查询到工作台信息');
        }
        setWorkGroupMap(
          res.data.resultList.reduce(
            (prev, cur) => ({ ...prev, [cur.workGroupId]: cur.workGroupName }),
            {}
          )
        );
      })
      .catch((error) => console.error(error));
  }, []);

  const getColumns = useMemo<BasicColumn[]>(
    () => [
      {
        title: '用户',
        dataIndex: 'userCode',
        width: '150px',
        align: 'left',
        render: (value) => value || '--',
      },
      {
        title: '工作台',
        dataIndex: 'workGroupId',
        width: '200px',
        align: 'left',
        render: (value) => workGroupMap[value] || '--',
      },
      {
        title: '豁免规则类型',
        dataIndex: 'ruleTypeList',
        ellipsis: true,
        align: 'left',
        render: (value) => {
          if (value && Array.isArray(value)) {
            return value
              .map((i: string) =>
                transformDictCodeToNameHelper(i, RULE_TYPE_LEVEL_2)
              )
              .join('，');
          } else {
            return '--';
          }
        },
      },
      {
        title: '更新用户',
        dataIndex: 'updateUserCode',
        width: '150px',
        align: 'left',
        render: (value) => value || '--',
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateTime',
        width: '200px',
        align: 'left',
        render: (value) => value || '--',
      },
    ],
    [workGroupMap]
  );

  useEffect(() => {
    calculate();
  }, [domHeight]);

  const calculate = () => {
    if (tableRef.current) {
      tableRef.current.setProps({
        scroll: {
          y: domHeight
            ? tableRef.current.getDataSource().length > 0
              ? domHeight - 175
              : domHeight - 119
            : 400,
        },
      });
    }
  };

  // 搜索处理
  const handleSearch = (value: string) => {
    if (tableRef.current) {
      tableRef.current?.reload({
        pagination: { current: 1 },
        searchInfo: {
          filterCondition: {
            userCode: value,
          },
        },
      });
    }
  };

  const modalRef = useRef<ModalActionType>(null);

  // 创建操作
  const doCreate = () => {
    if (modalRef.current) {
      modalRef.current.open(Mode.ADD);
    }
  };

  // 编辑操作
  const doEdit = (value: Recordable) => {
    if (modalRef.current) {
      modalRef.current.open(Mode.EDIT, value);
    }
  };

  return (
    <div className={styles.pageStyle}>
      <div className={styles.list}>
        <div className={styles.title}>
          <img src={TitleImgSrc} style={{ width: '24px', height: '24px' }} />
          <span>规则豁免列表</span>
        </div>
        <div ref={domRef} className={styles.symbols}>
          <div className={styles.actionBar}>
            <Input
              prefix={<SearchOutlined />}
              className={styles.symbolsSearch}
              onChange={(e) => {
                setSearchValue(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="请输入用户编码"
              value={searchValue}
              allowClear={true}
            />

            <Button type="primary" onClick={doCreate}>
              <PlusOutlined />
              新建豁免
            </Button>
          </div>
          <div style={{ height: 'calc(100% - 64px)' }}>
            <BasicTable
              ref={tableRef}
              fetchSetting={{
                listField: 'data.resultList',
                pageField: 'pageId',
                totalField: 'data.totalSize',
              }}
              style={{ width: '100%', height: '100%' }}
              columns={getColumns}
              api={queryRuleApproveExempt}
              immediate={true}
              onDataChange={calculate}
              autoCreateKey={true}
              pagination={{
                showTotal: (total) => `总数：${total}`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showQuickJumper: true,
                size: 'default',
              }}
              actionColumn={{
                width: 120,
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                fixed: false,
                render: (value: any, record: Recordable) => (
                  <TableAction
                    stopButtonPropagation={true}
                    actions={[
                      {
                        label: <EditIcon onClick={() => doEdit(record)} />,
                        divider: true,
                      },
                      {
                        label: (
                          <Popconfirm
                            title="是否确认删除?"
                            okText="是"
                            cancelText="否"
                            onConfirm={async () => {
                              try {
                                const result = await alterRuleApproveExempt({
                                  modifyType: AlterType.DELETE,
                                  userCode: record.userCode,
                                  workGroupId: record.workGroupId,
                                  ruleTypeList: record.ruleTypeList,
                                });
                                if (result.code !== 0) {
                                  throw new Error(result.message);
                                }
                                message.success('操作成功');
                              } catch (error: any) {
                                console.error(error);
                                // message.error(error.message);
                              } finally {
                                tableRef.current?.reload();
                              }
                            }}
                          >
                            <DelIcon />
                          </Popconfirm>
                        ),
                        divider: false,
                      },
                    ]}
                  />
                ),
              }}
            />
          </div>
        </div>
      </div>
      <FormModal ref={modalRef} onConfirm={() => tableRef.current?.reload()} />
    </div>
  );
};

export default withKeepAlive({
  cacheKey: KEEPALIVE_CACHE_KEY.RULE_EXEMPTIONS,
})(RuleExemptions);
