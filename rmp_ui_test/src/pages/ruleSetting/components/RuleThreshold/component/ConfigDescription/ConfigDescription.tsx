import React, { type FC } from 'react';
import AllDescComp from './Descriptions';

interface Props {
  ruleType: string;
  preConditionValues: any[];
  thresholdConditionValues: any[];
}

const ConfigDescription: FC<Props> = ({
  ruleType,
  preConditionValues,
  thresholdConditionValues,
}) => {
  const Comp = AllDescComp?.[ruleType];

  if (!Comp) {
    return <div>规则类型:{ruleType} 的描述组件暂未实现</div>;
  }

  return (
    <>
      <div
        style={{
          height: 22,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#3f434b',
          lineHeight: '22px',
          marginBottom: '10px',
        }}
      >
        阈值描述
      </div>
      <div
        style={{
          padding: '6px 8px',
          border: '1px solid #DDDEE0',
          width: '100%',
          minHeight: '56px',
          borderRadius: '4px',
        }}
      >
        <Comp
          preConditionValues={preConditionValues}
          thresholdConditionValues={thresholdConditionValues}
        />
      </div>
    </>
  );
};

export default ConfigDescription;
