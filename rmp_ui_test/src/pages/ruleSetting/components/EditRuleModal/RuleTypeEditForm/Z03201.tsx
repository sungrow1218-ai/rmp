import React, { useCallback, useRef } from 'react';
import { message } from 'antd';

import RuleBasicInfo from '@/pages/ruleSetting/components/RuleBasicInfo';
import RuleDimensionControl from '@/pages/ruleSetting/components/RuleDimensionControl';
import RuleCalculateParam from '@/pages/ruleSetting/components/RuleCalculateParam';
import RuleThreshold from '@/pages/ruleSetting/components/RuleThreshold';
import RuleEffectiveTime from '@/pages/ruleSetting/components/RuleEffectiveTime';
import { alterRuleSetting } from '@/services/ruleSetting';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import FooterButton from './FooterButton';

import type {
  RuleBasicInfoValues,
  RuleControlAcctValues,
  RuleSecurityControlValues,
  RuleThresholdValues,
  RuleCalculateParamValues,
  RuleEffectiveTimeValues,
  RuleRelationValues,
} from './typing';
import RuleRelation from '../../RuleRelation';
import { SobInfo } from '@/services/account';
import RuleSecurityControl from '../../RuleSecurityControl';
import { messageInfo } from './message';
import { AlterRuleSettingParam } from '@/services/ruleSetting/dto';

interface Props {
  mode: keyof typeof FORM_MODES;
  sobInfo?: SobInfo;
  workGroupId: number;
  record?: {
    ruleBaseInfo: RuleBasicInfoValues;
    ruleControlAcct: RuleControlAcctValues;
    ruleControlSecurity: RuleSecurityControlValues;
    specialThreshold: RuleThresholdValues;
    extParamList: RuleCalculateParamValues;
    ruleRelaList: RuleRelationValues;
  };
  refetch: () => void;
  onClose: () => void;
  notShowFoot?: boolean;
}

const ruleType = 'Z03201';

const EditFormZ01201: React.FC<Props> = ({
  mode,
  record,
  refetch,
  onClose,
  sobInfo,
  workGroupId,
  notShowFoot,
}) => {
  const basicInfoRef = useRef<{
    getFormValueAsync: () => Promise<RuleBasicInfoValues>;
  }>(null);
  const dimensionControlRef = useRef<{
    getFormValueAsync: () => Promise<RuleControlAcctValues>;
  }>(null);
  const securityControlRef = useRef<{
    getFormValueAsync: () => Promise<RuleSecurityControlValues>;
  }>(null);
  const thresholdRef = useRef<{
    getFormValueAsync: () => Promise<RuleThresholdValues>;
  }>(null);
  const effectiveTimeRef = useRef<{
    getFormValueAsync: () => Promise<RuleEffectiveTimeValues>;
  }>(null);
  const calculateParamRef = useRef<{
    getFormValueAsync: () => Promise<RuleCalculateParamValues>;
  }>(null);
  const relationRef = useRef<{
    getFormValueAsync: () => Promise<
      Pick<InferArray<RuleRelationValues>, 'ruleRelaType' | 'relaRuleId'>[]
    >;
  }>(null);

  const handleFormDataSubmit = useCallback(async () => {
    try {
      const [
        ruleBaseInfo,
        ruleControlAcct,
        ruleControlSecurity,
        extParamList,
        specialThreshold,
        ruleEffectiveTime,
        ruleRelaList,
      ] = await Promise.all([
        basicInfoRef.current?.getFormValueAsync(),
        dimensionControlRef.current?.getFormValueAsync(),
        securityControlRef.current?.getFormValueAsync(),
        calculateParamRef.current?.getFormValueAsync(),
        thresholdRef.current?.getFormValueAsync(),
        effectiveTimeRef.current?.getFormValueAsync(),
        relationRef.current?.getFormValueAsync(),
      ]);

      const alterType = ['ADD', 'ADD_VIA_COPY'].includes(mode) ? 1 : 2;
      const ruleQueryParams = {
        alterType,
        workGroupId,
        ruleBaseInfo: { ...ruleBaseInfo, ...ruleEffectiveTime },
        ruleControlAcct,
        ruleControlSecurity,
        specialThreshold,
        extParamList,
        ruleRelaList,
      };
      const result = await alterRuleSetting(
        ruleQueryParams as DeepPartial<AlterRuleSettingParam>
      );
      if (result.code === 145003) {
        refetch();
        message.success({ content: messageInfo(alterType) });
        onClose();
        return;
      } else if (result.code !== 0) {
        // message.error({
        //   content: `${result.message}`,
        // });
        return;
      }
      refetch();
      onClose();
      message.success({ content: '提交成功' });
    } catch (error) {}
  }, [mode, refetch]);

  return (
    <>
      <RuleBasicInfo
        ruleType={ruleType}
        mode={mode}
        ref={basicInfoRef}
        defaultValues={record?.ruleBaseInfo ?? undefined}
      />
      <RuleDimensionControl
        mode={mode}
        ruleType={ruleType}
        sobInfo={sobInfo}
        ref={dimensionControlRef}
        defaultValues={record?.ruleControlAcct ?? undefined}
        includeExtSystem={true}
        includeAcctGroup={true}
      />
      <RuleSecurityControl
        mode={mode}
        ruleType={ruleType}
        ref={securityControlRef}
        defaultValues={record?.ruleControlSecurity ?? undefined}
      />
      <RuleCalculateParam
        mode={mode}
        ruleType={ruleType}
        ref={calculateParamRef}
        defaultValues={record?.extParamList ?? undefined}
      />
      <RuleThreshold
        mode={mode}
        defaultValues={record?.specialThreshold ?? undefined}
        ruleType={ruleType}
        ref={thresholdRef}
      />
      <RuleEffectiveTime
        mode={mode}
        defaultValues={
          record && record.ruleBaseInfo
            ? {
                beginDate: record.ruleBaseInfo.beginDate,
                endDate: record.ruleBaseInfo.endDate,
                timeSegmentList: record.ruleBaseInfo.timeSegmentList,
              }
            : undefined
        }
        initTimeSegments={[{ beginTime: '093000', endTime: '145700' }]}
        ref={effectiveTimeRef}
      />
      <RuleRelation
        mode={mode}
        workGroupId={workGroupId}
        defaultValues={record?.ruleRelaList ?? undefined}
        ref={relationRef}
        ruleType={ruleType}
      />
      {mode !== 'PREVIEW' && !notShowFoot && (
        <FooterButton onSubmit={handleFormDataSubmit} onClose={onClose} />
      )}
    </>
  );
};

export default EditFormZ01201;
