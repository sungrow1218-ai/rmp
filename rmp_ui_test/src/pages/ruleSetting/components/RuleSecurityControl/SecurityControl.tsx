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
import FullConfig from './config';
import { FORM_MODES } from '../../constant';
import { BasicForm, FormActionType } from '@/components/Form';
import { Button, FormProps, Collapse } from 'antd';
import { RuleControlSecurity } from '@/services/rule';
import { isArray, isFunction } from 'lodash';
import styles from '../EditRule/styles.less';
import { RightOutlined } from '@ant-design/icons';

export interface Props {
  mode: keyof typeof FORM_MODES;
  defaultValues?: RuleControlSecurity;
  ruleType: DictCodeEnumType['RULE_TYPE_LEVEL_2'];
  debug?: boolean;
  onValuesChange?: FormProps['onValuesChange'];
  ruleParamValues?: any;
}

interface Ref {
  getFormValueAsync: () => Promise<RuleControlSecurity>;
}

const RuleCalculateParam: ForwardRefRenderFunction<Ref, Props> = (
  { mode, ruleType, defaultValues, debug, onValuesChange, ruleParamValues },
  ref
) => {
  const isPreview = mode === FORM_MODES.PREVIEW;

  const getSchema = useMemo(() => {
    const ruleConfig = FullConfig[ruleType];
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
    let { securitySetIdList = undefined } = result;
    if (result.securitySetIdList && !isArray(result.securitySetIdList)) {
      securitySetIdList = [result.securitySetIdList];
    }
    return { ...result, securitySetIdList };
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
    }
  }, [defaultValues]);

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
              证券控制范围
            </div>
          ),
          children: (
            <div style={{ paddingBottom: '8px' }}>
              <BasicForm
                ref={formRef}
                layout="inline"
                disabled={isPreview}
                schemas={getSchema ?? undefined}
                onValuesChange={onValuesChange}
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
