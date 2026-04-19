// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  type ForwardRefRenderFunction,
  useImperativeHandle,
  useMemo,
  useCallback,
  forwardRef,
  useState,
  useEffect,
} from 'react';
import { Button, Col, Form, Row, Select, Space, Collapse } from 'antd';
import { type DictCodeEnumType } from '@/utils/dict';
import { FORM_MODES } from '../../constant';
import RuleConfig from './config';
import { GeneralThreshold } from '@/services/rule';
import ThresholdItem from './ThresholdItem';
import { isEmpty, isFunction } from 'lodash';
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import styles from '../EditRule/styles.less';
import { useForm } from 'antd/es/form/Form';

export interface Props {
  defaultValues?: GeneralThreshold;
  mode: keyof typeof FORM_MODES;
  ruleType: DictCodeEnumType['RULE_TYPE_LEVEL_2'];
  debug?: boolean;
  ruleCalculateParamValues?: any;
}

interface Ref {
  getFormValueAsync: () => Promise<GeneralThreshold>;
}

const RuleGeneralThreshold: ForwardRefRenderFunction<Ref, Props> = (
  { ruleType, defaultValues, mode, debug, ruleCalculateParamValues },
  ref
) => {
  const config = useMemo(() => {
    const ruleConfig = RuleConfig[ruleType as keyof typeof RuleConfig];
    if (ruleConfig) {
      if (isFunction(ruleConfig)) {
        return ruleConfig(ruleCalculateParamValues);
      } else {
        return ruleConfig;
      }
    }
    return null;
  }, [ruleType, ruleCalculateParamValues]);

  const readOnly = mode === FORM_MODES.PREVIEW;

  const [form] = useForm();

  const [selected, setSelected] = useState<string[]>([]);

  // 没有配置的情况
  if (!config) {
    return null;
  }

  const getConfig = useMemo(
    () => ({
      compareDirection: config.compareDirection.map((i) => ({
        label: i.name,
        value: i.code,
      })),
      operations: config.operations.map((i) => ({
        label: i.name,
        value: i.code,
        disabled: selected.includes(i.code),
      })),
      inputNumberProp: config.inputNumberProp,
      thresholdCount: config.thresholdCount,
    }),
    [config]
  );

  const handleSubmit = useCallback(async () => {
    const { direction, thresholds } = await form.validateFields();
    const result = {
      compareDirection: Number(direction),
      unit: Number(getConfig.inputNumberProp.code),
      thresholdList: thresholds.map(
        (i: { inputValue: number; operation: string }) => ({
          value: Number(i.inputValue),
          operation: Number(i.operation),
        })
      ),
    };
    return result;
  }, [getConfig, form]);

  const thresholdsValue = Form.useWatch('thresholds', form);

  useEffect(() => {
    if (thresholdsValue) {
      const result = [];
      for (const item of thresholdsValue) {
        if (item?.operation) {
          result.push(item.operation);
        }
      }
      setSelected(result);
    }
  }, [thresholdsValue]);

  useEffect(() => {
    if (isEmpty(defaultValues)) {
      form.setFieldsValue({
        thresholds: new Array(getConfig.thresholdCount)
          .fill(1)
          .slice(0, 1)
          .map((i) => ({})),
      });
    }
    if (getConfig.compareDirection.length === 1) {
      form.setFieldsValue({
        direction: getConfig.compareDirection[0].value,
      });
    }
  }, [getConfig, defaultValues]);

  useImperativeHandle(ref, () => ({ getFormValueAsync: handleSubmit }), [
    handleSubmit,
  ]);

  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue({
        direction: `${defaultValues.compareDirection}`,
        thresholds: defaultValues.thresholdList
          ? defaultValues.thresholdList.map((i) => ({
              inputValue: i.value,
              operation: `${i.operation}`,
            }))
          : getConfig.operations.slice(0, 1),
      });
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
              通用阈值
            </div>
          ),
          children: (
            <div style={{ paddingBottom: '8px' }}>
              <Form
                form={form}
                layout="inline"
                // style={{ display: 'flex' }}
                disabled={readOnly}
              >
                <Form.Item
                  name={'direction'}
                  label="比较方向"
                  rules={[{ required: true, message: '请选择比较方向' }]}
                >
                  <Select
                    options={getConfig.compareDirection}
                    style={{ width: '240px' }}
                  />
                </Form.Item>
                <div>
                  <Form.List
                    name={'thresholds'}
                    rules={[
                      {
                        validator: async (_, names) => {
                          if (!names || names.length < 1) {
                            return Promise.reject(
                              new Error('至少填写一个阈值')
                            );
                          }
                        },
                      },
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => {
                      return (
                        <>
                          {fields.map((field, index) => (
                            <Form.Item
                              key={field.key}
                              label="阈值"
                              required={false}
                            >
                              <Space key={field.key}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange']}
                                  rules={[
                                    {
                                      validator: async (_, value) => {
                                        if (
                                          !value ||
                                          !('inputValue' in value) ||
                                          !('operation' in value) ||
                                          value.operation === undefined
                                        ) {
                                          return Promise.reject(
                                            new Error(
                                              '请完整填写或者删除该阈值'
                                            )
                                          );
                                        }
                                      },
                                    },
                                  ]}
                                  noStyle={true}
                                >
                                  <ThresholdItem
                                    inputProps={getConfig.inputNumberProp}
                                    options={getConfig.operations.filter(
                                      (i) => !selected.includes(i.value)
                                    )}
                                  />
                                </Form.Item>
                                {fields.length > 1 && !readOnly ? (
                                  <MinusCircleOutlined
                                    style={{ fontSize: 14, color: '#999' }}
                                    onClick={() => remove(field.name)}
                                  />
                                ) : null}
                                {fields.length < getConfig.thresholdCount &&
                                !readOnly ? (
                                  <PlusCircleOutlined
                                    style={{ fontSize: 14, color: '#999' }}
                                    onClick={() => add()}
                                  />
                                ) : null}
                              </Space>
                            </Form.Item>
                          ))}
                        </>
                      );
                    }}
                  </Form.List>
                </div>

                {debug && (
                  <Form.Item>
                    <Button onClick={handleSubmit}>测试</Button>
                  </Form.Item>
                )}
              </Form>
            </div>
          ),
        },
      ]}
    />
  );
};

export default forwardRef(RuleGeneralThreshold);
