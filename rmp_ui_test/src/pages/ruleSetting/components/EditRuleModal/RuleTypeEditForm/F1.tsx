import { message } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import RuleBasicInfo from '@/pages/ruleSetting/components/RuleBasicInfo';
import RuleCalculateParam from '@/pages/ruleSetting/components/RuleCalculateParam';
import RuleDimensionControl from '@/pages/ruleSetting/components/RuleDimensionControl';
import RuleEffectiveTime from '@/pages/ruleSetting/components/RuleEffectiveTime';
import RuleGeneralThreshold from '@/pages/ruleSetting/components/RuleGeneralThreshold';
import RuleSecurityControl from '@/pages/ruleSetting/components/RuleSecurityControl';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import { alterRuleSetting } from '@/services/ruleSetting';
import FooterButton from './FooterButton';

import { SobInfo } from '@/services/account';
import { isArray, isEmpty } from 'lodash';
import RuleRelation from '../../RuleRelation';
import type {
  RuleBasicInfoValues,
  RuleCalculateParamValues,
  RuleControlAcctValues,
  RuleEffectiveTimeValues,
  RuleGeneralThresholdValues,
  RuleRelationValues,
  RuleSecurityControlValues,
} from './typing';
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
    generalThreshold: RuleGeneralThresholdValues;
    extParamList: RuleCalculateParamValues;
    ruleRelaList: RuleRelationValues;
  };
  refetch: () => void;
  onClose: () => void;
  notShowFoot?: boolean;
}

const ruleType = 'F1';
export const convertToObject = (arr: any[]) => {
  return arr.reduce((acc, curr) => {
    acc[curr.ruleParamType] = curr.ruleParamValue;
    return acc;
  }, {});
};
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
      // 额度方式14 - '2'  联合控制模式只能为unionControlType 0-单独 证券汇总方式securitySummaryType为单独计算 ‘0’
      const limitType = extParamList?.find((d: any) => d.ruleParamType === 14);

      if (!isEmpty(limitType) && limitType?.ruleParamValue === '2') {
        const unionControlType = ruleControlAcct?.unionControlType;
        const securitySummaryType = ruleControlSecurity?.securitySummaryType;

        if (!(unionControlType === 0 && securitySummaryType === 0)) {
          message.error(
            '当按照单笔控制时，只支持账户的联合控制模式为单独控制，证券的汇总方式为单独计算。'
          );

          return;
        }
      }
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
      console.error({ content: `${JSON.stringify(error)}` });
    }
  }, [mode, refetch]);

  // 计算参数/通用阈值交互
  const [ruleCalculateParamValues, setRuleCalculateParamValues] =
    useState(null);
  // 证券汇总方式/额度方式
  const [ruleSecuParamValues, setRuleSecuParamValues] = useState(null);
  // 证券控制方式/计算方式
  const [ruleSecuAndCalParamValues, setRuleSecuAndCalParamValues] =
    useState<any>(undefined);
  // 控制方式/额度方式
  const [ruleDemAndCalParamValues, setRuleDemAndCalParamValues] =
    useState<any>(undefined);
  // 监听计算参数改变
  const onRuleCalculateParamChange = (
    changedValues: Recordable,
    allValues: Recordable
  ) => {
    setRuleCalculateParamValues(allValues[6]);
    setRuleSecuParamValues(allValues[14]);
    setRuleDemAndCalParamValues(allValues);
  };
  // 监听控制证券改变
  const onRuleSecurityParamChange = (
    changedValues: Recordable,
    allValues: Recordable
  ) => {
    setRuleSecuAndCalParamValues({
      ...ruleSecuAndCalParamValues,
      securityControlType: allValues.securityControlType,
    });
  };
  // 监听控制方式
  const onRuleChangesCalu = (
    changedValues: Recordable,
    allValues: Recordable
  ) => {
    setRuleSecuAndCalParamValues({
      ...ruleSecuAndCalParamValues,
      unionControlType: allValues.unionControlType,
    });
  };
  useEffect(() => {
    if (mode !== 'ADD') {
      if (isArray(record?.extParamList)) {
        const allvalues = convertToObject(record?.extParamList ?? []);
        setRuleCalculateParamValues(allvalues['6']);
        setRuleSecuParamValues(allvalues['14']);
      }

      if (!isEmpty(record?.ruleControlSecurity)) {
        setRuleSecuAndCalParamValues({
          ...ruleSecuAndCalParamValues,
          securityControlType: record?.ruleControlSecurity.securityControlType,
          unionControlType: record?.ruleControlAcct.unionControlType,
        });
      }
    }
  }, [record, mode]);

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
        onValuesChange={onRuleChangesCalu}
        ruleParamValues={ruleDemAndCalParamValues}
        includeExtSystem={true}
        includeAcctGroup={true}
      />
      <RuleSecurityControl
        mode={mode}
        ruleType={ruleType}
        ref={securityControlRef}
        defaultValues={record?.ruleControlSecurity ?? undefined}
        onValuesChange={onRuleSecurityParamChange}
        ruleParamValues={ruleSecuParamValues}
      />
      <RuleCalculateParam
        mode={mode}
        ruleType={ruleType}
        ref={calculateParamRef}
        defaultValues={record?.extParamList ?? undefined}
        onValuesChange={onRuleCalculateParamChange}
        ruleParamValues={ruleSecuAndCalParamValues}
      />
      <RuleGeneralThreshold
        mode={mode}
        defaultValues={record?.generalThreshold ?? undefined}
        ruleType={ruleType}
        ref={generalThresholdRef}
        ruleCalculateParamValues={ruleCalculateParamValues}
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
