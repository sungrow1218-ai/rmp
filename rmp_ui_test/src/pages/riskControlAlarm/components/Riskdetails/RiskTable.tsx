import { RollbackOutlined } from '@ht-icons/sprite-ui-react';
import { Button, Descriptions, Tag, Typography, Table } from '@ht/sprite-ui';
import React, { useMemo } from 'react';

import { RULE_TYPE_LEVEL_2, transformDictCodeToNameHelper } from '@/utils/dict';
import CardTitle from '@/components/CardTitle';
import { getIsIfram } from '@/utils/utils';
import { ExtSysItem } from '@/services/account';
import { getSystemNameById } from '@/hooks/useSystemInfo';
import { ColumnsType } from '@ht/sprite-ui/lib/table';
import styles from './style.less';
import { WarnRemarkData } from '@/services/riskControlAlarm';
import { tranRuleData } from '../constant';

interface Props {
  factorData: WarnRemarkData | null;
  ruleType?: string;
  entrustCode: string;
}

const RiskTable: React.FC<Props> = ({
  factorData,
  ruleType,
  entrustCode = '',
}) => {
  const TableData = useMemo(() => {
    if (factorData && ruleType) {
      const trData = tranRuleData(factorData, ruleType, entrustCode);
      if (trData) {
        return trData;
      }
    }
    return [];
  }, [factorData, ruleType]);

  const getCoumn = useMemo(() => {
    const column: ColumnsType<any> = [
      {
        title: '指标参数',
        dataIndex: 'indexName',
      },
      {
        title: '指标值',
        dataIndex: 'indexValue',
      },
      {
        title: '不提示阈值',
        dataIndex: 'ignoreThreshold',
      },
      {
        title: '预警阈值',
        dataIndex: 'warnThreshold',
      },
      {
        title: '禁止阈值',
        dataIndex: 'banThreshold',
      },
    ];
    const isTrue = TableData.find((p) => p.ignoreThreshold !== '--');
    if (ruleType === 'J1' || ruleType === 'J2') {
      const columnJ: ColumnsType<any> = [
        {
          title: '指标参数',
          dataIndex: 'indexName',
        },
        {
          title: '指标值',
          dataIndex: 'indexValue',
        },
      ];
      return columnJ;
    }
    if (isTrue) {
      return column;
    } else {
      return column.filter((p) => p.dataIndex !== 'ignoreThreshold');
    }
  }, [TableData]);
  return (
    <div className={styles.RiskDetailTable}>
      <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '16px' }}>
        指标数据汇总
      </div>
      <Table columns={getCoumn} dataSource={TableData} pagination={false} />
    </div>
  );
};

export default RiskTable;
