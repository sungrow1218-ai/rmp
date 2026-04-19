import React, {
  type ForwardRefRenderFunction,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useEffect,
} from 'react';
import { Form, Input, Row, InputNumber, Col, Select } from 'antd';
import { type ThresholdConditionConfigAll } from './ThresholdCondition';
import { type ThresholdConditionValueProp } from '../../RuleThreshold';
import styles from '../../style.less';

interface Props {
  config: ThresholdConditionConfigAll & { uuid: string; required?: boolean };
  defaultValue?: ThresholdConditionValueProp;
  onValuesChange?: (formUuid: string, values: any) => void;
  readOnly: boolean;
  warningValueValidator: (rule: any, value: any) => Promise<void>;
  forbidenValueValidator: (rule: any, value: any) => Promise<void>;
  revalidateForms: () => void;
}

export interface ThresholdConditionFormRef {
  handleFormSubmit: () => Promise<any>;
  validateFields: () => Promise<any>;
  getFieldValue: (namePath: string[]) => any;
}

const ThresholdConditionForm: ForwardRefRenderFunction<
  ThresholdConditionFormRef,
  Props
> = (
  {
    config,
    defaultValue,
    readOnly,
    onValuesChange = () => {},
    warningValueValidator,
    forbidenValueValidator,
    revalidateForms,
  },
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

  // const warningAndForbidenValueValidatorShouldNotSameValidator =
  //   useCallback(() => {
  //     const wValue = form.getFieldValue('warningValue');
  //     const fValue = form.getFieldValue('forbidenValue');
  //     if (!wValue || !fValue || wValue !== fValue) {
  //       return Promise.resolve();
  //     }
  //     return Promise.reject('禁止使用相同的告警值和禁止值');
  //   }, [form]);

  useImperativeHandle(
    ref,
    () => ({
      handleFormSubmit,
      getFieldValue: form.getFieldValue,
      validateFields: () => {
        return form.validateFields(['warningValue', 'forbidenValue']);
      },
    }),
    [handleFormSubmit, form]
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
      key={String(conditionType)}
      layout="inline"
      initialValues={{ ...defaultValue, unitCode: inputNumberProp.code }}
      onValuesChange={(changedValues, allValues) => {
        const compareOperationName = compareOperation.find(
          (c) => c.code === allValues.compareOperation
        )?.name;

        onValuesChange(uuid, {
          ...allValues,
          unit: inputNumberProp.name,
          compareOperationName,
          conditionTypeName,
        });
        if (changedValues.warningValue || changedValues.forbidenValue) {
          // 当表格内的这两个值变化时，需要触发其他所有表格这两个单元格的校验
          revalidateForms();
        }
      }}
      form={form}
      style={{ display: 'block' }}
    >
      <Row
        gutter={24}
        style={{ minWidth: 640 }}
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
          span={8}
          className={styles.ruleConfigBodyCol}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <div style={{ width: '100%', paddingLeft: 8 }}>
            {conditionType}-{conditionTypeName}
          </div>
        </Col>
        <Col span={4} className={styles.ruleConfigBodyCol}>
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
        <Col span={6} className={styles.ruleConfigBodyCol}>
          <Form.Item
            name="warningValue"
            rules={[
              // {
              //   validator:
              //     warningAndForbidenValueValidatorShouldNotSameValidator,
              // },
              { validator: warningValueValidator },
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
        <Col span={6} className={styles.ruleConfigBodyCol}>
          <Form.Item
            name="forbidenValue"
            rules={[
              // {
              //   validator:
              //     warningAndForbidenValueValidatorShouldNotSameValidator,
              // },
              {
                required: config?.required,
                message: '请输入禁止值',
              },
              { validator: forbidenValueValidator },
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

export default forwardRef(ThresholdConditionForm);
