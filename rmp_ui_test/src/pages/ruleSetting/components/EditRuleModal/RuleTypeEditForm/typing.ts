import { type Props as RuleBasicInfoProps } from '@/pages/ruleSetting/components/RuleBasicInfo';
import { type Props as RuleControlAcctProps } from '@/pages/ruleSetting/components/RuleDimensionControl';
import { type Props as RuleSecurityControlProps } from '@/pages/ruleSetting/components/RuleSecurityControl';
import { type Props as RuleThresholdProps } from '@/pages/ruleSetting/components/RuleThreshold';
import { type Props as RuleGeneralThresholdProps } from '@/pages/ruleSetting/components/RuleGeneralThreshold';
import { type Props as RuleCalculateParamProps } from '@/pages/ruleSetting/components/RuleCalculateParam';
import { type Props as RuleEffectiveTimeProps } from '@/pages/ruleSetting/components/RuleEffectiveTime';
import { type Props as RuleRelationProps } from '@/pages/ruleSetting/components/RuleRelation';

type NonNullable<T> = Exclude<T, null | undefined>;

export type RuleBasicInfoValues = NonNullable<
  RuleBasicInfoProps['defaultValues']
>;

export type RuleControlAcctValues = NonNullable<
  RuleControlAcctProps['defaultValues']
>;

export type RuleSecurityControlValues = NonNullable<
  RuleSecurityControlProps['defaultValues']
>;

export type RuleThresholdValues = NonNullable<
  RuleThresholdProps['defaultValues']
>;

export type RuleGeneralThresholdValues = NonNullable<
  RuleGeneralThresholdProps['defaultValues']
>;

export type RuleCalculateParamValues = NonNullable<
  RuleCalculateParamProps['defaultValues']
>;

export type RuleEffectiveTimeValues = NonNullable<
  RuleEffectiveTimeProps['defaultValues']
>;

export type RuleRelationValues = NonNullable<
  RuleRelationProps['defaultValues']
>;
