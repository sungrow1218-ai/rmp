import { Badge, Button, message, Table } from '@ht/sprite-ui';
import { ColumnsType } from '@ht/sprite-ui/lib/table';
import React, { useEffect, useRef, useState } from 'react';
import { DetailState } from '../../contant/typing';
import {
  RULE_RELATION_TYPES,
  RULE_TYPE_LEVEL_2,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import { useMemoizedFn } from 'ahooks';
import { ProcessRuleList, queryRelateRuleList } from '@/services/process';
import RuleModal from '../ChangeDetail/RuleDetail';
import { queryRuleSetting } from '@/services/ruleSetting';

interface Props {
  data: any;
  size?: number;
}

const RuleRelat = ({ data, size }: Props) => {
  const [open, setOpen] = useState(false);
  const [relatData, setRelatData] = useState<ProcessRuleList[] | undefined>(
    undefined
  );
  const [ruledata, setRuleData] = useState<any>(null);

  const queryRelatList = useMemoizedFn(async () => {
    try {
      const { ruleId } = data?.ruleBaseInfo ?? 0;
      if (!ruleId) {
        return;
      }
      const result = await queryRelateRuleList({ ruleId });

      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message}`,
        // });

        return;
      }
      if (result.data && result.data.resultList) {
        setRelatData(result.data.resultList);
      } else {
        setRelatData([]);
      }
    } catch (error) {
      //  message.error({ content: `${JSON.stringify(error)}` });
    } finally {
    }
  });

  const onQueryExpand = useMemoizedFn(
    async (ruleId: number, ruleType: string, workGroupId: number) => {
      try {
        if (!ruleId) return;

        const result = await queryRuleSetting({
          pageId: 1,
          pageSize: 1,
          filterCondition: {
            ruleId: [ruleId],
            workGroupList: [{ workGroupId, ruleType: [ruleType] }],
          },
        });
        if (result.code !== 0) {
          // message.error({
          //   content: `${result.message}`,
          // });

          return;
        }
        if (result.data.resultList) {
          setRuleData(result.data.resultList[0]);
        } else {
          setRuleData([]);
        }
      } catch (error) {
        //  message.error({ content: `${JSON.stringify(error)}` });
      } finally {
      }
    }
  );

  useEffect(() => {
    queryRelatList();
  }, [data]);

  const columns: ColumnsType<ProcessRuleList> = [
    {
      title: '相关规则编号',
      dataIndex: 'relatedRuleId',
    },
    {
      title: '规则状态',
      dataIndex: 'status',
      render: (value) => {
        return (
          <div>
            <Badge color={value === 1 ? '#52C41A' : '#BB744A'} />
            {value === 1 ? (
              <span style={{ color: '#52C41A' }}>已启用</span>
            ) : (
              <span style={{ color: '#BB744A' }}>待启用</span>
            )}
          </div>
        );
      },
    },
    {
      title: '规则类型',
      dataIndex: 'ruleType',
      render: (value) => {
        return (
          <div>{transformDictCodeToNameHelper(value, RULE_TYPE_LEVEL_2)}</div>
        );
      },
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
    },
    {
      title: '相关点',
      dataIndex: 'relationType',
      render: (value) => {
        return (
          <div>
            {transformDictCodeToNameHelper(
              value.toString(),
              RULE_RELATION_TYPES
            )}
          </div>
        );
      },
    },

    {
      title: '操作',
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              onQueryExpand(
                record.relatedRuleId,
                record.ruleType,
                record.workGroupId
              );
              setRuleData(record);
              setOpen(true);
            }}
          >
            {' '}
            查看
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      {relatData && relatData?.length > 0 && (
        <div style={{ paddingBottom: '15px' }}>
          <Table
            size="middle"
            dataSource={relatData}
            columns={columns}
            pagination={false}
            scroll={{ y: 150 }}
          />
          {open && <RuleModal data={ruledata} setOpen={setOpen} />}
        </div>
      )}
    </div>
  );
};

export default RuleRelat;
