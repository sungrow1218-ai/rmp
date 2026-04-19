// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  type ForwardRefRenderFunction,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
  useState,
} from 'react';
import {
  SECURITY_CONTROL_TYPES__MAP,
  type DictCodeEnumType,
} from '@/utils/dict';
import FullConfig from './config';
import { FORM_MODES } from '../../constant';
import { BasicForm, FormActionType } from '@/components/Form';
import { FormProps, Button, Collapse } from 'antd';
import { isArray, isFunction } from 'lodash';
import { SobInfo } from '@/services/account';
import styles from '../EditRule/styles.less';
import { RightOutlined } from '@ant-design/icons';
import {
  isManageAccount,
  isTradingAccount,
} from './components/ExemptAccountSelect';
import { AcctItem } from '@/services/rule';

export interface Props {
  mode: keyof typeof FORM_MODES;
  ruleType: DictCodeEnumType['RULE_TYPE_LEVEL_2'];
  defaultValues?: RuleCalculateParamDTO[];
  debug?: boolean;
  onValuesChange?: FormProps['onValuesChange'];
  ruleParamValues?: any;
  sobInfo?: SobInfo;
}

interface Ref {
  getFormValueAsync: () => Promise<RuleCalculateParamDTO[]>;
  getFieldsValue?: () => RuleCalculateParamDTO[];
}

interface RuleCalculateParamDTO {
  ruleParamType: number;
  ruleParamValue: string;
  ruleParamValue2?: string;
}

const RuleCalculateParam: ForwardRefRenderFunction<Ref, Props> = (
  {
    mode,
    ruleType,
    defaultValues,
    debug,
    onValuesChange,
    ruleParamValues,
    sobInfo,
  },
  ref
) => {
  const isPreview = mode === FORM_MODES.PREVIEW;

  const getSchema = useMemo(() => {
    const ruleConfig = FullConfig[ruleType as keyof typeof FullConfig];
    if (ruleConfig) {
      if (isFunction(ruleConfig)) {
        let data = ruleConfig({ ...ruleParamValues, mode, sobInfo });
        if (mode !== 'ADD') {
          data = data.map((p) => {
            return {
              ...p,
              defaultValue: undefined,
            };
          });
        }
        return data;
      } else {
        return ruleConfig;
      }
    }
    return null;
  }, [ruleType, ruleParamValues, mode, sobInfo]);

  const formRef = useRef<FormActionType>(null);

  useEffect(() => {
    if (formRef.current && defaultValues && getSchema) {
      const initValues: Recordable = defaultValues.reduce(
        (prev: Recordable, cur) => {
          const schema = getSchema.find(
            (i) => i.field === `${cur.ruleParamType}`
          );
          if (schema?.component === 'MultipleSelect') {
            return {
              ...prev,
              [cur.ruleParamType]: [
                ...(prev[cur.ruleParamType] || []),
                cur.ruleParamValue,
              ],
            };
          } else {
            return { ...prev, [cur.ruleParamType]: cur.ruleParamValue };
          }
        },
        {}
      );
      // I1 特殊处理
      if (ruleType === 'I1') {
        if (initValues['194']) {
          const acctType = initValues['194'];
          let bl = '';
          if (isTradingAccount(acctType)) {
            initValues['193'] = (initValues['193'] || []).map((i: string) => {
              const [bookLevel, extSysId, marketId, accountCode] = i.split('|');
              bl = bookLevel;
              return {
                bookLevel: Number(bookLevel),
                extSysId: Number(extSysId),
                marketId: Number(marketId),
                accountCode,
              };
            });
          } else if (isManageAccount(acctType)) {
            initValues['193'] = (initValues['193'] || []).map((i: string) => {
              const [bookLevel, extSysId, accountCode] = i.split('|');
              bl = bookLevel;
              return {
                bookLevel: Number(bookLevel),
                extSysId: Number(extSysId),
                accountCode,
              };
            });
          }
          initValues['194'] = `${bl}|${acctType}`;
          setTimeout(() => {
            formRef.current?.setFieldsValue(initValues);
            setTimeout(() => {
              formRef.current?.setFieldValue('193', initValues['193']);
            }, 200);
          }, 200);
        } else if (
          !initValues['194'] &&
          initValues['193'] &&
          initValues['193'].length >= 0
        ) {
          const result = [];
          for (const item of initValues['193']) {
            if (item.split('|').length === 3) {
              const [bookLevel, extSysId, accountCode] = item.split('|');
              result.push({
                bookLevel: Number(bookLevel),
                extSysId: Number(extSysId),
                accountCode,
              });
            }
            if (item.split('|').length === 4) {
              const [bookLevel, extSysId, marketId, accountCode] =
                item.split('|');
              result.push({
                bookLevel: Number(bookLevel),
                extSysId: Number(extSysId),
                marketId: Number(marketId),
                accountCode,
              });
            }
          }
          initValues['193'] = result;
          setTimeout(() => {
            formRef.current?.setFieldsValue(initValues);
          }, 200);
        } else {
          formRef.current?.setFieldsValue(initValues);
        }
      } else {
        formRef.current?.setFieldsValue(initValues);
      }
    }
    // 特殊处理: Z06003 10003-仅控制瞬时撤单
    if (
      formRef.current &&
      getSchema &&
      !defaultValues &&
      ruleType === 'Z06003'
    ) {
      formRef.current.setFieldsValue({ '10003': '0' });
    }
    // 特殊处理当192是空的时候默认为0
    if (formRef.current && getSchema && ruleType === 'A1') {
      const car192Values = defaultValues?.find(
        (p) => p.ruleParamType === 192
      )?.ruleParamValue;
      if (!car192Values) {
        formRef.current.setFieldsValue({ '192': '0' });
      }
    }
  }, [defaultValues]);

  const cacheRuleParamValuesRef = useRef<Recordable>({});

  useEffect(() => {
    if (ruleType === 'F1') {
      if (
        formRef.current?.getFieldValue('14') === '2' &&
        ruleParamValues?.unionControlType &&
        ruleParamValues?.unionControlType.toString() === '1'
      ) {
        formRef.current.setFieldValue('14', null);
      }
    }
    // 扩展参数 - 55-业务平台
    if (formRef.current?.getFieldValue('55') === '-1') {
      formRef.current.setFieldValue('55', undefined);
    }
    // Z04
    if (ruleType === 'Z04') {
      if (
        formRef.current?.getFieldValue('98') !== '1' &&
        ruleParamValues?.securityControlType &&
        ruleParamValues?.securityControlType.toString() ===
          SECURITY_CONTROL_TYPES__MAP.KEY_1.code
      ) {
        formRef.current?.setFieldValue('98', null);
      }
    }
    // I1
    if (ruleType === 'I1') {
      if (
        ruleParamValues.controlAcctType !==
        cacheRuleParamValuesRef.current.controlAcctType
      ) {
        formRef.current?.setFieldsValue({
          '193': undefined,
          '194': undefined,
        });
      }
    }
    cacheRuleParamValuesRef.current = ruleParamValues;
  }, [ruleParamValues, ruleType]);

  const handleFormSubmit = useCallback(async () => {
    const result = await formRef.current?.validateFields();
    const dataForSubmit: RuleCalculateParamDTO[] = [];
    const fileds = Object.keys(result).filter((r) => r !== 'items');
    // I1特殊处理
    if (ruleType === 'I1') {
      if (result['194']) {
        const [, acctType] = result['194'].split('|');
        result['194'] = acctType;
      }
      if (result['193'] && result['193'].length > 0) {
        result['193'] = result['193'].map((i: AcctItem) => {
          const { bookLevel, extSysId, marketId, accountCode } = i;
          if (marketId) {
            return `${bookLevel}|${extSysId}|${marketId}|${accountCode}`;
          } else {
            return `${bookLevel}|${extSysId}|${accountCode}`;
          }
        });
      } else {
        delete result['194'];
      }
    }
    for (const ruleParamType of fileds) {
      const paramValue = result[ruleParamType];
      // 值为NULL的特殊处理
      const fields = ruleParamType.split('|');
      if (paramValue === 'NULL') continue;
      if (Array.isArray(paramValue)) {
        paramValue.forEach((pv) => {
          if (typeof paramValue !== 'undefined') {
            dataForSubmit.push({
              ruleParamType: Number(ruleParamType),
              ruleParamValue: pv,
            });
          }
        });
      } else if (typeof paramValue !== 'undefined') {
        if (typeof ruleParamType === 'string' && ruleParamType.includes('|')) {
          fields.forEach((h) => {
            if (isArray(paramValue[h])) {
              paramValue[h].forEach((pv: any) => {
                dataForSubmit.push({
                  ruleParamType: Number(h),
                  ruleParamValue: pv,
                });
              });
            }
          });
        } else {
          dataForSubmit.push({
            ruleParamType: Number(ruleParamType),
            ruleParamValue: result[ruleParamType],
          });
        }
      }
    }
    return dataForSubmit;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getFormValueAsync: handleFormSubmit,
      getFieldsValue: () => defaultValues ?? [],
    }),
    [handleFormSubmit, defaultValues]
  );

  const [activeKey, setActiveKey] = useState(['1']);

  return (
    <Collapse
      activeKey={activeKey}
      bordered={false}
      expandIcon={({ isActive }) => (
        <RightOutlined
          rotate={isActive ? 90 : 0}
          style={{ color: '#444444', fontSize: '16px', cursor: 'pointer' }}
          onClick={() => setActiveKey(activeKey.length === 0 ? ['1'] : [])}
        />
      )}
      style={{
        boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.14)',
        borderRadius: '4px',
        marginBottom: '16px',
      }}
      items={[
        {
          key: '1',
          label: (
            <div
              className={styles.blockTitle}
              onClick={() => setActiveKey(activeKey.length === 0 ? ['1'] : [])}
            >
              计算参数
            </div>
          ),
          children: (
            <div style={{ paddingBottom: '8px' }}>
              <BasicForm
                ref={formRef}
                layout="inline"
                onValuesChange={onValuesChange}
                schemas={getSchema ?? undefined}
                disabled={isPreview}
              />
              {debug && <Button onClick={handleFormSubmit}>测试</Button>}
            </div>
          ),
        },
      ]}
    />
  );
};

export default forwardRef(RuleCalculateParam);
