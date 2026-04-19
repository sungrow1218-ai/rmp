import React, { useCallback, useRef } from 'react';
import { message } from 'antd';

import RuleBasicInfo from '@/pages/ruleSetting/components/RuleBasicInfo';
import RuleDimensionControl from '@/pages/ruleSetting/components/RuleDimensionControl';
import RuleSecurityControl from '@/pages/ruleSetting/components/RuleSecurityControl';
import RuleCalculateParam from '@/pages/ruleSetting/components/RuleCalculateParam';
import RuleGeneralThreshold from '@/pages/ruleSetting/components/RuleGeneralThreshold';
import RuleEffectiveTime from '@/pages/ruleSetting/components/RuleEffectiveTime';
import { alterRuleSetting } from '@/services/ruleSetting';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import FooterButton from './FooterButton';

import type {
  RuleBasicInfoValues,
  RuleControlAcctValues,
  RuleSecurityControlValues,
  RuleGeneralThresholdValues,
  RuleCalculateParamValues,
  RuleEffectiveTimeValues,
  RuleRelationValues,
} from './typing';
import { messageInfo } from './message';
import RuleRelation from '../../RuleRelation';
import { SobInfo } from '@/services/account';
import { DIMENSION_CONTROL_TYPES__MAP } from '@/utils/dict';
import { AlterRuleSettingParam } from '@/services/ruleSetting/dto';

interface Props {
  mode: keyof typeof FORM_MODES;
  sobInfo?: SobInfo;
  workGroupId: number;
  record?: {
    ruleBaseInfo: RuleBasicInfoValues;
    ruleControlAcct: RuleControlAcctValues;
    ruleControlSecurity: RuleSecurityControlValues;
    generalThreshold: RuleGeneralThresholdValues;
    extParamList: RuleCalculateParamValues;
    ruleRelaList: RuleRelationValues;
  };
  refetch: () => void;
  onClose: () => void;
  notShowFoot?: boolean;
}
/** 联合控制方式选项 */
const unionControlTypeOptions = [DIMENSION_CONTROL_TYPES__MAP.INDEPENDENT].map(
  (cdt) => {
    return { label: cdt.name, value: cdt.code };
  }
);
const ruleType = 'I51';

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
  const generalThresholdRef = useRef<{
    getFormValueAsync: () => Promise<RuleGeneralThresholdValues>;
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
        generalThreshold,
        ruleEffectiveTime,
        ruleRelaList,
      ] = await Promise.all([
        basicInfoRef.current?.getFormValueAsync(),
        dimensionControlRef.current?.getFormValueAsync(),
        securityControlRef.current?.getFormValueAsync(),
        calculateParamRef.current?.getFormValueAsync(),
        generalThresholdRef.current?.getFormValueAsync(),
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
        generalThreshold,
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
    } catch (error) {
      console.error(error);
    }
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
        unionControlTypeOptionsNew={unionControlTypeOptions}
        onlyManageAccount={true}
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
      <RuleGeneralThreshold
        mode={mode}
        defaultValues={record?.generalThreshold ?? undefined}
        ruleType={ruleType}
        ref={generalThresholdRef}
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
