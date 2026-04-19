import React, { useMemo } from 'react';
import RiskRuleTypeInfo from '../RuleTypeInfo';
import { WarnRemarkData } from '@/services/riskControlAlarm';
import { RULE_TYPE_LEVEL_2, DictCodeEnumType } from '@/utils/dict';
import { TableDataList } from '../RiskMain';

interface Props {
  ruleType: string;
  data?: WarnRemarkData;
  record?: TableDataList;
}
type isRuleType = DictCodeEnumType['RULE_TYPE_LEVEL_2'];

const EditFormNotFound = () => {
  return <></>;
};

const RiskInfoPop: React.FC<Props> = ({ ruleType, data, record }) => {
  const RiskInfoShow = useMemo(() => {
    const isTrue = RULE_TYPE_LEVEL_2.find((p) => p.code === ruleType)?.code;
    if (ruleType && data && isTrue) {
      return RiskRuleTypeInfo[isTrue] ?? '';
    }
    return EditFormNotFound;
  }, [ruleType, data]);
  return <>{data ? <RiskInfoShow data={data} record={record} /> : ''}</>;
};

export default RiskInfoPop;
