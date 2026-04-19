/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable max-lines */
import React, { useState, useEffect, useMemo } from 'react';
import { Table, message, Badge } from 'antd';
import {
  RULE_TYPE_LEVEL_2,
  transformDictCodeToNameHelper,
  RULE_RELATION_TYPES,
  SECURITY_CONTROL_TYPES,
  SECURITY_AGGREGATION_METHODS,
  DIMENSION_CONTROL_TYPES,
  RULE_CONTROL_DIM,
} from '@/utils/dict';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { SobInfo } from '@/services/account';
import { useMemoizedFn } from 'ahooks';
import styles from './style.less';
import { queryRuleSetting } from '@/services/ruleSetting';
import { QueryRuleSettingRspDTO } from '@/services/ruleSetting/dto';

interface Props {
  record: QueryRuleSettingRspDTO & { sobInfo?: SobInfo };
  showColumns: string[];
  tableWidth: number;
}
type subTableListType = QueryRuleSettingRspDTO & { ruleRelaType?: number } & {
  key?: React.Key;
} & { sobInfo?: SobInfo };
const SubTable: React.FC<Props> = (props) => {
  const [subData, setSubData] = useState<subTableListType[]>([]);
  const [subLoading, setSubLoading] = useState<boolean>(false);

  const getColumns = useMemo(() => {
    const epxcolumns = [
      {
        title: '规则编号',
        dataIndex: 'ruleId',
        width: 75,
        render(_: any, record: Recordable) {
          return <>{record.ruleBaseInfo.ruleId ?? ''}</>;
        },
      },
      {
        title: <div style={{ minWidth: '70px' }}>规则类型</div>,
        dataIndex: 'ruleType',
        width: 250,
        onHeaderCell: () => ({
          className: 'minWidthColunms',
        }),
        ellipsis: true,
        render(_: any, record: Recordable) {
          const value = record.ruleBaseInfo.ruleType;
          return `${transformDictCodeToNameHelper(value, RULE_TYPE_LEVEL_2)}`;
        },
      },
      {
        title: <div style={{ minWidth: '70px' }}>规则名称</div>,
        dataIndex: 'ruleName',
        ellipsis: true,
        width: 250,
        onHeaderCell: () => ({
          className: 'minWidthColunms',
        }),
        render(_: any, record: Recordable) {
          return `${record.ruleBaseInfo.ruleName}`;
        },
      },
      {
        title: '启用状态',
        width: 100,
        dataIndex: 'ruleStatus',
        render(_: any, record: Recordable) {
          const value = record.ruleBaseInfo.ruleStatus.toString();
          return (
            <div>
              <Badge
                color={value === '1' ? '#3F88F1' : '#BB744A'}
                size="small"
                style={{ marginRight: '8px' }}
              />
              {value === '1' ? (
                <span style={{ color: '#3F88F1' }}>启用</span>
              ) : (
                <span style={{ color: '#BB744A' }}>禁用</span>
              )}
            </div>
          );
        },
      },
      {
        title: '优先级',
        dataIndex: 'rulePriority',
        width: 90,
        align: 'center',
        render(_: any, record: Recordable) {
          return (
            <div
              style={{
                width: '40px',
                height: '32px',
                background: '#FFF2E1',
                borderRadius: '4px',
                border: '1px solid rgba(241,171,74,0.2)',
                margin: '0 auto',
                lineHeight: '32px',
                color: '#F1AB4A',
              }}
            >
              {record.ruleBaseInfo.rulePriority ?? ''}
            </div>
          );
        },
      },
      {
        title: '账户控制类型',
        dataIndex: 'ruleControDim',
        width: 120,
        render(_: any, record: Recordable) {
          const option: any[] = [];
          record.sobInfo?.bookList?.forEach((p: any) => {
            p.bookLevelList.forEach((it: any) => {
              option.push({
                label: it.bookLevelName,
                bookType: p.bookType,
                bookLevel: it.bookLevel,
              });
            });
          });

          const ruleControlType = record.ruleControlAcct?.controlAcctType ?? 3;
          const ruleControlLevel = record.ruleControlAcct?.acctLevel ?? 0;
          if (ruleControlType !== 1 && ruleControlType !== 2) {
            return (
              RULE_CONTROL_DIM.find((p) => p.code === String(ruleControlType))
                ?.name ?? ''
            );
          } else if (ruleControlType === 1) {
            return (
              option?.find(
                (it) => it.bookType === 2 && ruleControlLevel === it.bookLevel
              )?.label ?? ''
            );
          } else if (ruleControlType === 2) {
            return (
              option?.find(
                (it) => it.bookType === 1 && ruleControlLevel === it.bookLevel
              )?.label ?? ''
            );
          }
        },
      },
      {
        title: '联合控制模式',
        dataIndex: 'unionControlType',
        width: 160,
        render(_: any, record: Recordable) {
          const ruleControlType = record.ruleControlAcct?.unionControlType ?? 0;
          const value =
            DIMENSION_CONTROL_TYPES.find(
              (it) => it.code === String(ruleControlType)
            )?.name ?? '';
          return value;
        },
      },
      {
        title: '证券控制方式',
        dataIndex: 'securityControlType',
        width: 120,
        render(_: any, record: Recordable) {
          const ruleControlType =
            record.ruleControlSecurity.securityControlType ?? 0;
          const value =
            SECURITY_CONTROL_TYPES.find(
              (it) => it.code === String(ruleControlType)
            )?.name ?? '';
          return value;
        },
      },
      {
        title: '证券汇总方式',
        dataIndex: 'securitySummaryType',
        width: 120,
        render(_: any, record: Recordable) {
          const ruleControlType =
            record.ruleControlSecurity.securitySummaryType ?? 0;
          const value =
            SECURITY_AGGREGATION_METHODS.find(
              (it) => it.code === String(ruleControlType)
            )?.name ?? '';
          return value;
        },
      },
      {
        title: '创建人',
        dataIndex: 'createUserCode',
        width: 100,
        render(_: any, record: Recordable) {
          return <>{record.createUserCode ?? ''}</>;
        },
      },
      {
        title: '修改人',
        dataIndex: 'updateUserCode',
        width: 100,
        render(_: any, record: Recordable) {
          return <>{record.updateUserCode}</>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createDateTime',
        width: 180,
        render(_: any, record: Recordable) {
          const timeMonent = moment(
            String(record.createDateTime),
            'YYYYMMDDHHmmss'
          );
          if (timeMonent.isValid()) {
            return <div>{timeMonent.format('YYYY-MM-DD kk:mm:ss')}</div>;
          }
          return null;
        },
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateTime',
        width: 180,
        render(_: any, record: Recordable) {
          const timeMonent = moment(
            String(record.lastUpdateTime),
            'YYYYMMDDHHmmss'
          );
          if (timeMonent.isValid()) {
            return <div>{timeMonent.format('YYYY-MM-DD kk:mm:ss')}</div>;
          }
          return null;
        },
      },
    ];
    const result = [];
    for (const item of epxcolumns) {
      if (props.showColumns.includes(String(item.dataIndex))) {
        result.push(item as any);
      }
    }
    result.push({
      title: '规则关系',
      width: 190,
      fixed: 'right',
      dataIndex: 'ruleRelaType',
      render: (_: any, record: Recordable) => {
        const value = record.ruleRelaType ?? '';
        return (
          <div>
            {transformDictCodeToNameHelper(
              value.toString(),
              RULE_RELATION_TYPES
            )}
          </div>
        );
      },
    });
    // 48px是折叠符号宽度
    const columnsWidth = result.reduce((prev, cur) => prev + cur.width, 48);
    let isAutoColumnsWidth = false;
    if (props.tableWidth > columnsWidth) {
      isAutoColumnsWidth = true;
    }
    if (isAutoColumnsWidth) {
      return result.map((i) => {
        if (i.dataIndex === 'ruleRelaType') {
          return i;
        } else {
          return { ...i, width: '' };
        }
      });
    }
    return result;
  }, [props.showColumns, props.tableWidth]);

  const onQueryExpand = useMemoizedFn(async (record: subTableListType) => {
    try {
      setSubLoading(true);
      const ruleIds = record.ruleRelaList.map((item) => item.relaRuleId);
      const ruleTypes = record.ruleRelaList.map((item) => item.relaRuleType);

      if (ruleIds.length === 0) return;

      const result = await queryRuleSetting({
        pageId: 1,
        pageSize: ruleIds.length || 20,
        filterCondition: {
          ruleId: ruleIds,
          workGroupList: [
            { workGroupId: record.workGroupId, ruleType: ruleTypes },
          ],
        },
      });

      if (result.code !== 0) {
        message.error({
          content: `${result.message || '未知错误'}`,
        });

        return;
      }
      const list = result.data?.resultList?.map((item, index) => {
        return {
          ...item,
          key: uuidv4(),
          ruleRelaType: record.ruleRelaList[index].ruleRelaType,
          sobInfo: record?.sobInfo,
        };
      });
      setSubData(list);
    } catch (error) {
      //  message.error({ content: `${JSON.stringify(error)}` });
    } finally {
      setSubLoading(false);
    }
  });

  useEffect(() => {
    onQueryExpand(props.record);
  }, [onQueryExpand, props.record]);

  return (
    <div className={styles.subTable}>
      <Table
        size="middle"
        columns={getColumns}
        loading={subLoading}
        dataSource={subData || []}
        pagination={false}
      />
    </div>
  );
};

export default SubTable;
