import {
  ComponentMap,
  SecurityGroup,
  SetType,
  TemplateItem,
} from '@/pages/ruleSetting/RuleTemplateGroup/type';
import { Form } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import styles from './styles.less';
import Bigjs from 'big.js';

export type ValueTyep = { [key: string]: { value: number; setType: SetType } };

interface IProps {
  templates: TemplateItem[];
  securityGroup: SecurityGroup;
  onFormValuesChange: (values: ValueTyep) => void;
  disabled?: boolean;
}

export interface IAction {
  setDefaultValue: (percent?: number) => void;
  validate: () => Promise<void>;
}

const FormTemplate = forwardRef<IAction, IProps>(
  ({ templates, securityGroup, onFormValuesChange, disabled = false }, ref) => {
    const [form] = Form.useForm();

    useImperativeHandle(
      ref,
      () => ({
        setDefaultValue: (percent) => {
          const defaultValues = securityGroup.thresholdList.reduce(
            (prev, cur) => ({
              ...prev,
              [cur.factorType]: {
                value: percent
                  ? new Bigjs(cur.defaultValue as number)
                      .times(percent)
                      .div(100)
                      .toFixed(2)
                  : cur.defaultValue,
                setType: percent ? SetType.SCALE : SetType.DEFAULT,
              },
            }),
            {}
          );
          form.setFieldsValue(defaultValues);
          onFormValuesChange(defaultValues);
        },
        validate: () => form.validateFields(),
      }),
      [securityGroup]
    );

    // 设置默认值
    useEffect(() => {
      const defaultValues = securityGroup.thresholdList.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.factorType]: {
            value: cur.value || cur.defaultValue,
            setType: cur.setType,
          },
        }),
        {}
      );
      form.setFieldsValue(defaultValues);
    }, [securityGroup]);

    const renderItem = (item: TemplateItem) => {
      const partsWithKeys = item.template.split(/(\$\d+)/);
      return (
        <div className={styles.item}>
          {partsWithKeys.map((i) => {
            if (item[i as any]) {
              const field = i.replace('$', '');
              const { rules, component, componentProps } = item[i as any];
              const Comp = ComponentMap[component];
              const configItem = securityGroup.thresholdList.find(
                (i) => `${i.factorType}` === field
              );
              return (
                <div style={{ margin: '0 8px' }}>
                  <Form.Item noStyle={true} name={field} rules={rules}>
                    <Comp
                      {...componentProps}
                      defaultValue={configItem?.defaultValue}
                      style={{ width: '100px' }}
                    />
                  </Form.Item>
                </div>
              );
            } else {
              return i;
            }
          })}
        </div>
      );
    };

    return (
      <div>
        <Form
          form={form}
          disabled={disabled}
          onValuesChange={(_, allValues) =>
            onFormValuesChange(allValues as ValueTyep)
          }
        >
          {templates.map((i) => renderItem(i))}
        </Form>
      </div>
    );
  }
);

export default FormTemplate;
