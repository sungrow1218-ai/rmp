import React, { useMemo } from 'react';
import RiskRuleInfo from '../RuleTypeTableInfo';
import { WarnRemarkData } from '@/services/riskControlAlarm';
import { RULE_TYPE_LEVEL_2 } from '@/utils/dict';
import { TableDataList } from '../RiskMain';

interface Props {
  ruleType: string;
  data?: WarnRemarkData;
  record?: TableDataList;
}
const EditFormNotFound = () => {
  return <></>;
};

const RiskInfoTable: React.FC<Props> = ({ ruleType, data, record }) => {
  const RiskInfoShow = useMemo(() => {
    const isTrue = RULE_TYPE_LEVEL_2.find((p) => p.code === ruleType)?.code;
    if (ruleType && data && isTrue) {
      return RiskRuleInfo[isTrue] ?? <></>;
    }
    return EditFormNotFound;
  }, [ruleType, data]);
  return <>{data ? <RiskInfoShow data={data} record={record} /> : ''}</>;
};

export default RiskInfoTable;
