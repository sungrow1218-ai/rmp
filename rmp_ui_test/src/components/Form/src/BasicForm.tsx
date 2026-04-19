import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useCreation, useMount, useGetState } from 'ahooks';
import { Form, Row } from 'antd';
import classNames from 'classnames';
import { cloneDeep, cloneDeepWith, isFunction, merge, uniqueId } from 'lodash';

import dayjs from 'dayjs';

import FormItem from './components/FormItem';
import { useFormEvents } from './hooks/useFormEvents';
import { useFormValues } from './hooks/useFormValues';
import { useEarliest } from './hooks/useEarliest';
import type {
  FormActionType,
  FormProps,
  FormSchemaInner as FormSchema,
} from './types/form';
import { DATE_TYPE_COMPONENTS } from './helper';

import './index.module.scss';

// 辅助函数：判断是否为 React 组件/JSX 元素
function isReactElement(value: any) {
  if (typeof value !== 'object' || value === null) return false;
  // 1. 判断 JSX 元素（React.createElement 返回的对象）
  if (value.$$typeof === Symbol.for('react.element')) return true;
  // 2. 判断函数组件（纯函数，且名称/属性符合 React 组件特征）
  if (typeof value === 'function' && (value.displayName || value.name))
    return true;
  // 3. 判断类组件（继承自 React.Component）
  if (value.prototype && value.prototype.isReactComponent) return true;
  return false;
}

type IProps = FormProps;

const BasicForm = forwardRef<FormActionType, IProps>((props, ref) => {
  const { register } = props;

  const [defaultValues, setDefaultValues] = useState({});

  const [formModel, setFormModel] = useState({});

  const updateDefaultValues = (v: any) => {
    setDefaultValues(v);
  };

  const [isInitedDefault, setIsInitedDefault, getIsInitedDefault] =
    useGetState(false);
  const [inputProps, setInputProps] = useState<Partial<FormProps>>();
  const [schemas, setSchemas, getSchemas] = useGetState<FormSchema[] | null>(
    null
  );
  const updateSchemasFn = (v: FormSchema[]) => {
    setSchemas(v);
  };
  const [formRef] = Form.useForm();
  // 初始化-唯一标识
  const uid = useEarliest(() => `form-instance-${uniqueId()}`);

  const currentProps = useCreation(
    () => ({
      ...props,
      ...inputProps,
    }),
    [props, inputProps]
  );

  const formClass = useCreation(() => {
    return classNames(`basic-form ${uid}`);
  }, [currentProps.compact]);

  // Get uniform row style and Row configuration for the entire form
  const rowProps = useCreation(() => {
    const { baseRowStyle = {}, rowProps } = currentProps;
    return {
      style: baseRowStyle,
      ...rowProps,
    };
  }, [currentProps.baseColProps, currentProps.rowProps]);

  const getFormatSchemas = () => {
    // const _schemas: FormSchema[] = cloneDeep(
    //   (getSchemas() || currentProps.schemas) ?? []
    // );
    const _schemas: FormSchema[] = cloneDeepWith(
      (getSchemas() || currentProps.schemas) ?? [],
      (value) => {
        if (isReactElement(value)) {
          return value;
        }
      }
    );
    for (const schema of _schemas) {
      const {
        defaultValue,
        component,
        componentProps = {},
        isHandleDateDefaultValue = true,
      } = schema;
      // 处理时间类型
      if (
        isHandleDateDefaultValue &&
        defaultValue &&
        component &&
        DATE_TYPE_COMPONENTS.includes(component)
      ) {
        const opt = {
          schema,
          formAction: getFormAction(),
          formModel,
        };

        const valueFormat = componentProps
          ? isFunction(componentProps)
            ? componentProps(opt).valueFormat
            : componentProps.valueFormat
          : null;

        if (!Array.isArray(defaultValue)) {
          schema.defaultValue = valueFormat
            ? dayjs(defaultValue).format(valueFormat)
            : dayjs(defaultValue);
        } else {
          const def: any[] = [];
          defaultValue.forEach((item) => {
            def.push(
              valueFormat ? dayjs(item).format(valueFormat) : dayjs(item)
            );
          });
          schema.defaultValue = def;
        }
      }
    }

    return _schemas;
  };

  const formatSchemas = useCreation(() => {
    return getFormatSchemas();
  }, [schemas, props.schemas]);

  const { initDefault } = useFormValues({
    updateDefaultValues,
    schemas: formatSchemas,
  });

  const {
    handleSubmit,
    updateSchemas,
    resetSchemas,
    appendSchemaByField,
    removeSchemaByField,
    resetFields,
  } = useFormEvents({
    props: currentProps,
    formRef,
    formModel,
    getFormatSchemas,
    updateSchemas: updateSchemasFn,
  });

  useEffect(() => {
    resetSchemas(currentProps.schemas ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProps.schemas]);

  useEffect(() => {
    if (getIsInitedDefault()) {
      return;
    }
    if (schemas?.length) {
      initDefault();
      setIsInitedDefault(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemas]);

  const setFieldsValue = (values: Recordable) => {
    formRef.setFieldsValue(values);
    setFormModel((prev) => ({ ...prev, ...values }));
  };

  const setFieldValue = (name: any, value: any) => {
    formRef.setFieldValue(name, value);
    setFormModel((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setFieldsValue(defaultValues);
  }, [defaultValues]);

  const setProps = async (formProps: Partial<FormProps>) => {
    setInputProps(merge({ ...(inputProps || {}) }, formProps));
  };

  const handleEnterPress: any = (e: KeyboardEvent) => {
    const { autoSubmitOnEnter } = currentProps;
    if (!autoSubmitOnEnter) return;
    if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
      const { target } = e;
      if (
        target &&
        target.tagName &&
        target.tagName.toUpperCase() === 'INPUT'
      ) {
        handleSubmit();
      }
    }
  };

  const getFormAction = () => {
    return {
      ...(formRef ?? {}),
      resetFields,
      updateSchemas,
      resetSchemas,
      setFieldsValue,
      setFieldValue,
      setProps,
      removeSchemaByField,
      appendSchemaByField,
      submit: handleSubmit,
    } as unknown as FormActionType;
  };

  useImperativeHandle(ref, () => getFormAction());

  useMount(() => {
    initDefault();
    register?.(getFormAction());
  });

  return (
    <Form
      {...currentProps}
      className={formClass}
      form={formRef}
      onKeyDown={handleEnterPress}
      onValuesChange={(_, values) => {
        if (props.onValuesChange) {
          props.onValuesChange(_, values);
        }
        setFormModel(values);
      }}
    >
      <Row {...rowProps}>
        {formatSchemas.map((schema) => (
          <FormItem
            key={schema.field}
            formAction={getFormAction()}
            schema={schema}
            formProps={currentProps}
            defaultValues={defaultValues}
            formModel={formModel}
          />
        ))}
      </Row>
    </Form>
  );
});

export default BasicForm;
