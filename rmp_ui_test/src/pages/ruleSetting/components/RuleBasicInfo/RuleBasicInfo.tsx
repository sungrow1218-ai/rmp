// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  type ForwardRefRenderFunction,
  forwardRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { Form, Input, Switch, Select, Alert, Button, Collapse } from 'antd';
import {
  type DictCodeEnumType,
  transformDictCodeToNameHelper,
  RULE_TYPE_LEVEL_2,
  RULE_CHECK_POINT_TYPES,
  RULE_STATUSES__MAP,
} from '@/utils/dict';
import { FORM_MODES } from '../../constant';
import styles from '../EditRule/styles.less';
import { RightOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

interface RuleBasicInfoDTO {
  /**
   * 规则序号，新增时传 0，编辑时传规则 ID
   */
  ruleId: number;
  /**
   * 规则类型
   */
  ruleType: DictCodeEnumType['RULE_TYPE_LEVEL_2'];
  /**
   * 规则名称
   */
  ruleName: string;
  /**
   * 规则状态(状态涉及到的地方较多,当前先写死,后面处理)
   */
  ruleStatus: 1 | 2;
  /**
   * 规则优先级 1-10
   */
  rulePriority: string | number;
  /**
   * 检查时点
   */
  ruleCheckPoint: DictCodeEnumType['RULE_CHECK_POINT_TYPES'] | number;
  /**
   * 规则描述
   */
  ruleSummary?: string;
  /**
   * 自定义参数
   */
  selfDefineParam?: string;
  /**
   * 起始日期
   */
  beginDate?: string;
  /**
   * 截止日期
   */
  endDate?: string;
  /**
   * 生效时间段列表
   */
  timeSegmentList?: { beginTime: string; endTime: string }[];
}

interface BasicInfoFormValue
  extends Omit<RuleBasicInfoDTO, 'ruleId' | 'ruleStatus' | 'ruleCheckPoint'> {
  /**
   * 规则类型 - Input 获取的输出为 string
   */
  ruleId: string;
  /**
   * 规则状态 - Switch 获取的输出为 boolean
   */
  ruleStatus: boolean;
  /**
   * 检查时点 - 传入进来的为number
   */
  ruleCheckPoint: string;
}

export interface Props {
  defaultValues?: RuleBasicInfoDTO;
  mode: keyof typeof FORM_MODES;
  ruleType: DictCodeEnumType['RULE_TYPE_LEVEL_2'];
  debug?: boolean;
}

interface Ref {
  getFormValueAsync: () => Promise<RuleBasicInfoDTO>;
}

// 将接口数据入参格式的数据转换为组件表单的数据格式
function getInitialValue({
  mode,
  ruleType,
  defaultValues,
}: {
  mode: keyof typeof FORM_MODES;
  ruleType: DictCodeEnumType['RULE_TYPE_LEVEL_2'];
  defaultValues?: RuleBasicInfoDTO;
}): Partial<BasicInfoFormValue> {
  const emptyValue = {
    ruleId: '0',
    ruleType,
    ruleStatus: true,
    rulePriority: '5',
    ruleCheckPoint: ruleCheckPointOption[0].value,
  };

  if (mode === FORM_MODES.ADD || !defaultValues) {
    return emptyValue;
  }
  return {
    ...emptyValue,
    ruleId:
      mode === FORM_MODES.ADD_VIA_COPY
        ? emptyValue.ruleId
        : String(defaultValues.ruleId),
    ruleName: defaultValues.ruleName,
    ruleCheckPoint: defaultValues.ruleCheckPoint
      ? `${defaultValues.ruleCheckPoint}`
      : ruleCheckPointOption[0].value,
    rulePriority: defaultValues.rulePriority || emptyValue.rulePriority,
    ruleStatus: defaultValues.ruleStatus === RULE_STATUSES__MAP.ENABLED.code,
    ruleType: defaultValues.ruleType,
    ruleSummary: defaultValues.ruleSummary || '',
  };
}

const genSelectOption = () => {
  const result: { value: string; label: string }[] = [];
  for (let i = 1; i <= 10; i++) {
    result.push({
      label: `${i}`,
      value: `${i}`,
    });
  }
  return result;
};

const rulePriorityOption = genSelectOption();

/**
 * FIXME 这里暂时只保留事前风控的选项
 */
const ruleCheckPointOption = RULE_CHECK_POINT_TYPES.filter(
  (t) => t.code === 1
).map((t) => ({
  label: t.name,
  value: `${t.code}`,
}));

const RuleBasicInfo: ForwardRefRenderFunction<Ref, Props> = (
  { defaultValues, mode, ruleType, debug },
  ref
) => {
  const isPreview = mode === FORM_MODES.PREVIEW;

  const initialValues = useMemo(
    () => getInitialValue({ mode, defaultValues, ruleType }),
    [mode, defaultValues, ruleType]
  );

  useEffect(() => {
    setRuleStatus(initialValues.ruleStatus!);
  }, [initialValues]);

  const addMode = FORM_MODES.ADD === mode || FORM_MODES.ADD_VIA_COPY === mode;

  const ruleTypeName = transformDictCodeToNameHelper(
    ruleType,
    RULE_TYPE_LEVEL_2
  );

  const [ruleStatus, setRuleStatus] = useState(true);

  const [form] = Form.useForm<BasicInfoFormValue>();

  const handleFormSubmit = useCallback(async () => {
    const result = await form.validateFields();

    const dataToSubmit: RuleBasicInfoDTO = {
      ruleId: Number(result.ruleId),
      ruleType: result.ruleType,
      ruleName: result.ruleName,
      ruleStatus: ruleStatus
        ? RULE_STATUSES__MAP.ENABLED.code
        : RULE_STATUSES__MAP.DISABLED.code,
      rulePriority: Number(result.rulePriority),
      ruleCheckPoint: Number(result.ruleCheckPoint),
      ruleSummary: result.ruleSummary || '',
    };
    return dataToSubmit;
  }, [form, ruleStatus]);

  useImperativeHandle(
    ref,
    () => ({
      getFormValueAsync: handleFormSubmit,
    }),
    [handleFormSubmit]
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
              基本信息
            </div>
          ),
          extra: (
            <div
              className={styles.required}
              onClick={(e) => e.stopPropagation()}
            >
              是否启用:
              <Switch
                style={{ marginLeft: '8px' }}
                checkedChildren="开"
                unCheckedChildren="关"
                checked={ruleStatus}
                disabled={isPreview}
                onChange={(checked) => setRuleStatus(checked)}
              />
            </div>
          ),
          children: (
            <>
              {debug && (
                <Alert
                  message={
                    <>
                      {`模式：${mode}`}
                      <Button
                        onClick={() => {
                          handleFormSubmit();
                        }}
                      >
                        提交
                      </Button>
                    </>
                  }
                  type="warning"
                />
              )}
              <Form
                name="ruleBasicInfo"
                layout="inline"
                autoComplete="off"
                initialValues={initialValues}
                form={form}
                disabled={isPreview}
                style={{ width: '100%', marginBottom: '8px' }}
                // onValuesChange={handelFormValuesChange}
              >
                <FormItem
                  label="规则名称"
                  name="ruleName"
                  validateFirst={true}
                  rules={[
                    {
                      required: true,
                      message: '选项必填',
                      transform: (value: string) =>
                        value ? value.trim() : value,
                    },
                    {
                      validateTrigger: ['onChange'],
                      validator: (_rule, value: string, _callback) => {
                        let count = 0;
                        for (let index = 0; index < value.length; index++) {
                          if (value.charCodeAt(index) > 127) {
                            count += 3;
                          } else {
                            count += 1;
                          }
                        }
                        if (count < 128) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject(
                            '规则名称过长（中文不超过40字符，英文不超过120字符）'
                          );
                        }
                      },
                    },
                  ]}
                >
                  <Input style={{ width: '240px' }} />
                </FormItem>
                <FormItem
                  label="规则类型"
                  name="ruleType"
                  style={{ display: 'none' }}
                >
                  <Input disabled={true} suffix={ruleTypeName} />
                </FormItem>

                <FormItem
                  label="规则编号"
                  name="ruleId"
                  style={{ display: 'none' }}
                >
                  <Input disabled={true} />
                </FormItem>

                <FormItem
                  label="优先级"
                  name="rulePriority"
                  rules={[
                    {
                      required: true,
                      message: '选项必填',
                    },
                  ]}
                >
                  <Select
                    options={rulePriorityOption}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    style={{ width: '240px' }}
                  />
                </FormItem>
                <FormItem
                  label="检查时点"
                  name="ruleCheckPoint"
                  rules={[
                    {
                      required: true,
                      message: '选项必填',
                    },
                  ]}
                >
                  <Select
                    options={ruleCheckPointOption}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    style={{ width: '240px' }}
                  />
                </FormItem>
                <FormItem
                  label="规则描述"
                  name="ruleSummary"
                  rules={[
                    {
                      max: 500,
                      message: '长度不能超过 100 个字符',
                    },
                  ]}
                >
                  <Input style={{ width: '400px' }} />
                </FormItem>
              </Form>
            </>
          ),
        },
      ]}
    />
  );
};

export default forwardRef(RuleBasicInfo);
