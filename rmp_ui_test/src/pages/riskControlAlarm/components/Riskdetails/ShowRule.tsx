import React, { useMemo } from 'react';
import RiskInfo from './RegulatoryRule';
import { WarnRemarkData } from '@/services/riskControlAlarm';
import { RULE_TYPE_LEVEL_2 } from '@/utils/dict';

interface Props {
  ruleType?: string;
  marketId?: number;
}
const EditFormNotFound = () => {
  return <></>;
};

const RiskRuleInfo: React.FC<Props> = ({ ruleType, marketId }) => {
  const RiskInfoShow = useMemo(() => {
    const isTrue = RULE_TYPE_LEVEL_2.find((p) => p.code === ruleType)?.code;
    if (ruleType && isTrue) {
      return RiskInfo[isTrue] ?? <></>;
    }
    return EditFormNotFound;
  }, [ruleType]);
  return (
    <>
      <RiskInfoShow marketId={marketId} />
    </>
  );
};

export default RiskRuleInfo;
