import React, {
  type ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { Form, Input, Row, InputNumber, Col, Select } from 'antd';
import { type PreConditionConfigAll } from './PreCondition';
import { type PreConditionValueProp } from '../../RuleThreshold';
import styles from '../../style.less';

interface Props {
  config: PreConditionConfigAll & { uuid: string };
  defaultValue?: PreConditionValueProp;
  onValuesChange?: (formUuid: string, values: any) => void;
  readOnly: boolean;
}

export interface PreConditionFormRef {
  handleFormSubmit: () => Promise<any>;
}

const PreConditionForm: ForwardRefRenderFunction<PreConditionFormRef, Props> = (
  { config, defaultValue, readOnly, onValuesChange = () => {} },
  ref
) => {
  const {
    uuid,
    conditionType,
    conditionTypeName,
    compareOperation,
    inputNumberProp,
  } = config;
  const [form] = Form.useForm();

  const handleFormSubmit = useCallback(() => {
    return form.validateFields();
  }, [form]);

  useImperativeHandle(
    ref,
    () => ({
      handleFormSubmit,
    }),
    [handleFormSubmit]
  );

  useEffect(() => {
    const compareOperationName = compareOperation.find(
      (c) => c.code === defaultValue?.compareOperation
    )?.name;

    onValuesChange(uuid, {
      ...defaultValue,
      unit: inputNumberProp.name,
      compareOperationName,
      conditionTypeName,
    });
  }, [
    compareOperation,
    conditionTypeName,
    defaultValue,
    onValuesChange,
    uuid,
    inputNumberProp.name,
  ]);

  return (
    <Form
      name={String(conditionType)}
      key={String(conditionTypeName)}
      initialValues={{ ...defaultValue, unitCode: inputNumberProp.code }}
      onValuesChange={(_, allValues) => {
        const compareOperationName = compareOperation.find(
          (c) => c.code === allValues.compareOperation
        )?.name;

        onValuesChange(uuid, {
          ...allValues,
          unit: inputNumberProp.name,
          compareOperationName,
          conditionTypeName,
        });
      }}
      layout="inline"
      form={form}
      style={{ width: '100%' }}
    >
      <Row
        gutter={12}
        style={{ minWidth: 640, width: '100%' }}
        className={styles.ruleConfigBody}
      >
        <Form.Item name="id" style={{ margin: 0 }}>
          <Input style={{ display: 'none' }} disabled={true} />
        </Form.Item>
        <Form.Item name="type" style={{ margin: 0 }}>
          <Input style={{ display: 'none' }} disabled={true} />
        </Form.Item>
        <Form.Item name="unitCode" style={{ margin: 0 }}>
          <Input style={{ display: 'none' }} disabled={true} />
        </Form.Item>
        <Col
          span={10}
          className={styles.ruleConfigBodyCol}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <div style={{ width: '100%', paddingLeft: 8 }}>
            {conditionType}-{conditionTypeName}
          </div>
        </Col>
        <Col span={7} className={styles.ruleConfigBodyCol}>
          <Form.Item
            name="compareOperation"
            rules={[
              {
                required: true,
                message: '选项必选',
              },
            ]}
          >
            <Select
              options={compareOperation.map((t) => ({
                label: `${t.code}-${t.name}`,
                value: t.code,
              }))}
              style={{ width: '100%' }}
              disabled={readOnly}
            />
          </Form.Item>
        </Col>
        <Col span={7} className={styles.ruleConfigBodyCol}>
          <Form.Item
            name="thresholdValue"
            rules={[
              {
                required: true,
                message: '选项必填',
              },
            ]}
          >
            <InputNumber
              max={inputNumberProp?.max}
              min={inputNumberProp.min}
              precision={inputNumberProp.precision}
              style={{ width: '100%' }}
              addonAfter={inputNumberProp.name}
              disabled={readOnly}
              stringMode={true}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(PreConditionForm);
