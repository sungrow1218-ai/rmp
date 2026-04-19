// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import { useCreation } from 'ahooks';
import React from 'react';
import { Col, Form } from 'antd';
import { cloneDeep, isBoolean, isFunction, isNil } from 'lodash';
import { componentMap } from '../componentMap';
import { useItemLabelWidth } from '../hooks/useItemLabelWidth';
import { ComponentType } from '../types';
import type {
  FormActionType,
  FormProps,
  FormSchemaInner as FormSchema,
  Rule as ValidationRule,
} from '../types/form';
import classNames from 'classnames';

interface IProps {
  schema?: FormSchema;
  formProps?: FormProps;
  defaultValues?: Recordable;
  formAction?: FormActionType;
  formModel: Recordable;
}

const FormItem = (props: IProps) => {
  const {
    schema = {} as FormSchema,
    formProps = {} as FormProps,
    defaultValues = {} as Recordable,
    formAction,
    formModel,
  } = props;

  // TODO 组件 CropperAvatar 的 size 属性类型为 number
  // 此处补充一个兼容
  //   if (schema.value.component === 'CropperAvatar' && typeof formvalue.size === 'string') {
  //     formvalue.size = undefined;
  //   }

  const itemLabelWidthProp = useItemLabelWidth(schema, formProps);

  const values = useCreation(() => {
    const { mergeDynamicData } = formProps;
    return {
      field: schema.field,
      values: {
        ...mergeDynamicData,
        ...defaultValues,
        ...formModel,
      } as Recordable,
      schema,
    };
  }, [defaultValues, schema, formProps, formModel]);

  const componentsProps = useCreation(() => {
    let { componentProps = {} } = schema;
    if (isFunction(componentProps)) {
      componentProps =
        componentProps({
          schema,
          formAction,
          formModel,
        }) ?? {};
    }
    return componentProps as Recordable;
  }, [schema, formAction, formModel]);

  const disabled = (() => {
    const { disabled: globDisabled } = formProps;
    const { dynamicDisabled } = schema;
    const { disabled: itemDisabled = false } = componentsProps;
    let disabled = !!globDisabled || itemDisabled;
    if (isBoolean(dynamicDisabled)) {
      disabled = dynamicDisabled;
    }
    if (isFunction(dynamicDisabled)) {
      disabled = dynamicDisabled(values);
    }
    return disabled;
  })();

  const readonly = (() => {
    const { readonly: globReadonly } = formProps;
    const { dynamicReadonly } = schema;
    const { readonly: itemReadonly = false } = componentsProps;

    let readonly = globReadonly || itemReadonly;
    if (isBoolean(dynamicReadonly)) {
      readonly = dynamicReadonly;
    }
    if (isFunction(dynamicReadonly)) {
      readonly = dynamicReadonly(values);
    }
    return readonly;
  })();

  const getShow = (): { isShow: boolean; isIfShow: boolean } => {
    const { show, ifShow } = schema;

    let isShow = true;
    let isIfShow = true;

    if (isBoolean(show)) {
      isShow = show;
    }
    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(show)) {
      isShow = show(values);
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(values);
    }
    return { isShow, isIfShow };
  };

  /**
   * @description: 生成placeholder
   */
  const createPlaceholderMessage = (component: ComponentType) => {
    if (component.includes('Input') || component.includes('Complete')) {
      return '请输入';
    }
    if (component.includes('Picker')) {
      return '请选择';
    }
    if (
      component.includes('Select') ||
      component.includes('Cascader') ||
      component.includes('Checkbox') ||
      component.includes('Radio') ||
      component.includes('Switch')
    ) {
      return '请选择';
    }
    return '';
  };

  const setComponentRuleType = (
    rule: ValidationRule,
    component: ComponentType,
    valueFormat: string
  ) => {
    if (Reflect.has(rule, 'type')) {
      return;
    }
    if (
      ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(
        component
      )
    ) {
      rule.type = valueFormat ? 'string' : 'object';
    } else if (
      ['RangePicker', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(
        component
      )
    ) {
      rule.type = 'array';
    } else if (['InputNumber'].includes(component)) {
      rule.type = 'number';
    }
  };

  const handleRules = (): ValidationRule[] => {
    const {
      rules: defRules = [],
      component,
      rulesMessageJoinLabel,
      label,
      dynamicRules,
      required,
    } = schema;
    if (isFunction(dynamicRules)) {
      return dynamicRules(values);
    }

    let rules: ValidationRule[] = cloneDeep(defRules);
    const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = formProps;

    const joinLabel = Reflect.has(schema, 'rulesMessageJoinLabel')
      ? rulesMessageJoinLabel
      : globalRulesMessageJoinLabel;

    const assertLabel = joinLabel ? (isFunction(label) ? '' : label) : '';
    const defaultMsg = component
      ? createPlaceholderMessage(component) + assertLabel
      : assertLabel;

    const validator = (rule: any, value: any) => {
      const msg = rule.message || defaultMsg;
      if (value === undefined || isNil(value)) {
        // 空值
        return Promise.reject(msg);
      } else if (Array.isArray(value) && value.length === 0) {
        // 数组类型
        return Promise.reject(msg);
      } else if (typeof value === 'string' && value.trim() === '') {
        // 空字符串
        return Promise.reject(msg);
      } else if (
        typeof value === 'object' &&
        Reflect.has(value, 'checked') &&
        Reflect.has(value, 'halfChecked') &&
        Array.isArray(value.checked) &&
        Array.isArray(value.halfChecked) &&
        value.checked.length === 0 &&
        value.halfChecked.length === 0
      ) {
        // 非关联选择的tree组件
        return Promise.reject(msg);
      }
      return Promise.resolve();
    };

    /*
     * 1、若设置了required属性，又没有其他的rules，就创建一个验证规则；
     * 2、若设置了required属性，又存在其他的rules，则只rules中不存在required属性时，才添加验证required的规则
     *     也就是说rules中的required，优先级大于required
     */
    const currentRequired = isFunction(required) ? required(values) : required;

    if (currentRequired) {
      if (!rules || rules.length === 0) {
        rules = [
          { required: currentRequired, validator, validateTrigger: 'onChange' },
        ];
      } else {
        const requiredIndex: number = rules.findIndex((rule) =>
          Reflect.has(rule, 'required')
        );

        if (requiredIndex === -1) {
          rules.push({ required: currentRequired, validator });
        }
      }
    }

    const requiredRuleIndex: number = rules.findIndex(
      (rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator')
    );

    if (requiredRuleIndex !== -1) {
      const rule = rules[requiredRuleIndex];
      const { isShow } = getShow();
      if (!isShow) {
        rule.required = false;
      }
      if (component) {
        rule.message = (rule.message || defaultMsg) as any;

        if (component.includes('Input') || component.includes('Textarea')) {
          rule.whitespace = true;
        }
        const { valueFormat } = componentsProps;
        setComponentRuleType(rule, component, valueFormat);
      }
    }

    // Maximum input length rule check
    const characterInx = rules.findIndex((val) => val.max);
    if (characterInx !== -1 && !rules[characterInx].validator) {
      rules[characterInx].message = (rules[characterInx].message ||
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `字符数应小于${rules[characterInx].max}位`) as any;
    }

    return rules;
  };

  const renderComponent = () => {
    const { renderComponentContent, component } = schema;
    const { autoSetPlaceHolder, size } = formProps;

    const propsData: Recordable = {
      allowClear: true,
      size,
      ...componentsProps,
      disabled,
      readonly,
    };

    const Comp = componentMap[component as ComponentType];

    const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;

    // RangePicker place is an array
    if (isCreatePlaceholder && component !== 'RangePicker' && component) {
      propsData.placeholder =
        componentsProps.placeholder || createPlaceholderMessage(component);
    }

    propsData.formValues = { ...values };

    const compAttr: Recordable = {
      ...propsData,
    };

    if (!renderComponentContent) {
      return <Comp {...compAttr} />;
    }

    const content = isFunction(renderComponentContent)
      ? renderComponentContent(
          { ...values },
          {
            disabled,
            readonly,
          }
        )
      : renderComponentContent;

    return <Comp {...compAttr}>{content}</Comp>;
  };

  const renderLabelHelpMessage = () => {
    const { label, helpMessage, helpComponentProps, subLabel } = schema;
    const getLabel = isFunction(label) ? label({ ...values }) : label;
    const renderLabel = subLabel ? (
      <span>
        {getLabel} <span className="text-secondary">{subLabel}</span>
      </span>
    ) : (
      <span
        title={`${getLabel as string}`}
        style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {getLabel}
      </span>
    );
    const getHelpMessage = isFunction(helpMessage)
      ? helpMessage({ ...values })
      : helpMessage;
    if (
      !getHelpMessage ||
      (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)
    ) {
      return renderLabel;
    }
    return (
      <span>
        {renderLabel}
        {/* <BasicHelp placement="top" className="mx-1" text={getHelpMessage} {...helpComponentProps} /> */}
      </span>
    );
  };

  const renderItem = () => {
    const { itemProps, render, field, component, suffix } = schema;
    const { labelCol, wrapperCol } = itemLabelWidthProp;
    const { colon } = formProps;
    const opts = { disabled, readonly };
    const getContent = () => {
      return render ? render({ ...values }, opts) : renderComponent();
    };

    const getSuffix = isFunction(suffix) ? suffix(values) : suffix;

    return (
      <Form.Item
        name={field}
        colon={colon}
        className={classNames({ 'suffix-item': !!suffix })}
        {...(itemProps as Recordable)}
        label={renderLabelHelpMessage()}
        rules={handleRules()}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        {suffix ? (
          <div className="flex">
            <div className="flex-1">{getContent()}</div>
            <span className="suffix">{getSuffix}</span>
          </div>
        ) : (
          getContent()
        )}
      </Form.Item>
    );
  };

  const render = () => {
    const { colProps = {}, colContent, renderColContent, component } = schema;
    if (!(component && componentMap[component as ComponentType])) {
      return null;
    }

    const { baseColProps = {} } = formProps;
    const realColProps = { ...baseColProps, ...colProps };
    const { isIfShow, isShow } = getShow();
    const opts = { disabled, readonly };

    const getContent = () => {
      return colContent
        ? colContent
        : renderColContent
        ? renderColContent(values, opts)
        : renderItem();
    };

    return (
      isIfShow && (
        <Col {...realColProps} style={isShow ? {} : { display: 'none' }}>
          {getContent()}
        </Col>
      )
    );
  };

  return render();
};

export default FormItem;
