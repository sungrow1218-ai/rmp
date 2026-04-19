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
import { type DictCodeEnumType } from '@/utils/dict';
import Card from '@/components/Card';
import FullConfig from './config';
import { FORM_MODES } from '../../constant';
import { BasicForm, FormActionType } from '@/components/Form';
import { Button, FormProps, Collapse } from 'antd';
import { RuleControlAcct } from '@/services/rule';
import { isArray, isFunction } from 'lodash';
import { RuleControlAcctValues } from '../EditRuleModal/RuleTypeEditForm/typing';
import { RolePermissonProps } from '@/pages/roleManage/contant/typing';
import styles from '../EditRule/styles.less';

import { RightOutlined } from '@ant-design/icons';

export interface Props {
  mode: keyof typeof FORM_MODES;
  defaultValues?: RuleControlAcctValues;
  ruleType: DictCodeEnumType['RULE_TYPE_LEVEL_2'];
  debug?: boolean;
  onValuesChange?: FormProps['onValuesChange'];
  ruleParamValues?: any;
}

interface Ref {
  getFormValueAsync: () => Promise<RuleControlAcctValues>;
}

const RuleCalculateParam: ForwardRefRenderFunction<Ref, Props> = (
  { mode, ruleType, defaultValues, debug, onValuesChange, ruleParamValues },
  ref
) => {
  const isPreview = mode === FORM_MODES.PREVIEW;

  const getSchema = useMemo(() => {
    const ruleConfig = FullConfig[ruleType as keyof typeof FullConfig];
    if (ruleConfig) {
      if (isFunction(ruleConfig)) {
        let data = ruleConfig({ ...ruleParamValues, mode });
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
  }, [ruleType, ruleParamValues]);
  const formRef = useRef<FormActionType>(null);

  const handleFormSubmit = useCallback(async () => {
    const result = await formRef.current?.validateFields();
    for (const ruleParamType of Object.keys(result)) {
      const paramValue = result[ruleParamType];
      if (ruleParamType === 'controlAcctList' && !isArray(paramValue)) {
        result[ruleParamType] = [{ accountCode: paramValue }];
      }
    }
    return result;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getFormValueAsync: handleFormSubmit,
    }),
    [handleFormSubmit]
  );

  useEffect(() => {
    if (formRef.current) {
      formRef.current.setFieldsValue(defaultValues);
      if (
        mode !== 'ADD' &&
        ruleType === 'F2' &&
        defaultValues &&
        isArray(defaultValues?.controlAcctList) &&
        defaultValues?.controlAcctList.length > 0
      ) {
        formRef.current.setFieldsValue({
          ...defaultValues,
          controlAcctList: defaultValues.controlAcctList[0].accountCode,
        });
      }
    }
  }, [defaultValues, ruleType, mode]);

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
              账户控制范围
            </div>
          ),
          children: (
            <>
              <BasicForm
                ref={formRef}
                rowProps={{ gutter: 16 }}
                baseColProps={{ span: 8 }}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                disabled={isPreview}
                schemas={getSchema ?? undefined}
                onValuesChange={onValuesChange}
              />
              {debug && <Button onClick={handleFormSubmit}>测试</Button>}
            </>
          ),
        },
      ]}
    />
  );
};

export default forwardRef(RuleCalculateParam);
