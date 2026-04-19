import React, {
  useMemo,
  useCallback,
  type ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Form,
  DatePicker,
  TimePicker,
  Space,
  Button,
  Alert,
  Collapse,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FORM_MODES } from '../../constant';
import styles from '../EditRule/styles.less';
import {
  MinusCircleOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';

const FormItem = Form.Item;

const { RangePicker: DateRangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: { span: 18 },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    span: 18,
    offset: 6,
  },
};

interface RuleEffectiveTimeDTO {
  /** 起始日期 格式：yyyyMMdd */
  beginDate?: string;
  /** 截止日期 格式：yyyyMMdd */
  endDate?: string;
  timeSegmentList?: TimeSegmentDTO[];
}

interface TimeSegmentDTO {
  /** 起始时间，格式：hhmmss */
  beginTime: string;
  /** 截止时间，格式：hhmmss */
  endTime: string;
}

export interface Props {
  defaultValues?: RuleEffectiveTimeDTO;
  initTimeSegments?: TimeSegmentDTO[];
  mode: keyof typeof FORM_MODES;
  debug?: boolean;
}

interface Ref {
  getFormValueAsync: () => Promise<RuleEffectiveTimeDTO>;
}

const parseTimeSegments = (timeSegments: TimeSegmentDTO[]) => {
  const result = [];
  for (const { beginTime, endTime } of timeSegments) {
    const beginTimeMoment = dayjs(beginTime, 'HHmmss');
    const endTimeMoment = dayjs(endTime, 'HHmmss');
    if (beginTimeMoment.isValid() && endTimeMoment.isValid()) {
      result.push([dayjs(beginTime, 'HHmmss'), dayjs(endTime, 'HHmmss')]);
    }
  }
  return result;
};

const getInitialValues = ({
  mode,
  defaultValues,
  initTimeSegments,
}: {
  mode: keyof typeof FORM_MODES;
  defaultValues?: RuleEffectiveTimeDTO;
  initTimeSegments?: TimeSegmentDTO[];
}) => {
  if (mode === FORM_MODES.ADD) {
    return {
      effetiveDateRange: [],
      effetiveTimeRanges: initTimeSegments
        ? parseTimeSegments(initTimeSegments)
        : [],
    };
  }

  if (!defaultValues) {
    return {
      effetiveDateRange: [],
      effetiveTimeRanges: [],
    };
  }

  // ADD_VIA_COPY | EDIT | PREVIEW 都是一样的逻辑
  const { beginDate, endDate, timeSegmentList = [] } = defaultValues;
  const beginDataMoment = dayjs(beginDate, 'YYYYMMDD');
  const endDateMoment = dayjs(endDate, 'YYYYMMDD');
  const effetiveDateRange = [];
  if (beginDataMoment.isValid() && endDateMoment.isValid()) {
    effetiveDateRange.push(beginDataMoment);
    effetiveDateRange.push(endDateMoment);
  }

  const effetiveTimeRanges = timeSegmentList
    .map((timeSegment) => {
      const { beginTime, endTime } = timeSegment;
      const beginTimeMoment = dayjs(beginTime, 'HHmmss');
      const endTimeMoment = dayjs(endTime, 'HHmmss');
      if (beginTimeMoment.isValid() && endTimeMoment.isValid()) {
        return [dayjs(beginTime, 'HHmmss'), dayjs(endTime, 'HHmmss')];
      }
      return null;
    })
    .filter(Boolean);

  return {
    effetiveDateRange,
    effetiveTimeRanges,
  };
};

const transformMomentToDateStr = (momentDate: Dayjs) => {
  return momentDate.format('YYYYMMDD');
};

const transformMomentToTimeStr = (momentDate: Dayjs) => {
  return momentDate.format('HHmmss');
};

const RuleEffectiveTime: ForwardRefRenderFunction<Ref, Props> = (
  { mode, defaultValues, debug, initTimeSegments },
  ref
) => {
  const isPreview = mode === FORM_MODES.PREVIEW;
  const initialValues = useMemo(
    () => getInitialValues({ mode, defaultValues, initTimeSegments }),
    [defaultValues, mode, initTimeSegments]
  );
  const [form] = Form.useForm<{
    effetiveDateRange: [Dayjs, Dayjs];
    effetiveTimeRanges: [Dayjs, Dayjs][];
  }>();

  const handleFormSubmit = useCallback(async () => {
    const result = await form.validateFields();
    const { effetiveDateRange = [], effetiveTimeRanges = [] } = result;
    const [beginDateStr, endDataStr] = effetiveDateRange || [];
    const resultDatePart: Partial<
      Omit<RuleEffectiveTimeDTO, 'timeSegmentList'>
    > = {};
    if (beginDateStr && endDataStr) {
      const beginDate = transformMomentToDateStr(beginDateStr);
      const endDate = transformMomentToDateStr(endDataStr);
      resultDatePart.beginDate = beginDate;
      resultDatePart.endDate = endDate;
    }
    const timeSegmentList = effetiveTimeRanges
      .filter((t) => t[0] && t[1])
      .map((t) => {
        const [beginTime, endTime] = t;
        return {
          beginTime: transformMomentToTimeStr(beginTime),
          endTime: transformMomentToTimeStr(endTime),
        };
      });

    const dataToSubmit = {
      ...resultDatePart,
      timeSegmentList,
    };

    return dataToSubmit;
  }, [form]);

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
              高级控制
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
                          handleFormSubmit().then(console.log);
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
                name="ruleEffectiveTimeForm"
                autoComplete="off"
                initialValues={initialValues}
                form={form}
                disabled={isPreview}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  marginBottom: '6px',
                  display: 'flex',
                }}
              >
                <FormItem
                  label="生效日期"
                  name="effetiveDateRange"
                  style={{
                    marginBottom: '0px',
                  }}
                >
                  <DateRangePicker />
                </FormItem>
                <div>
                  <Form.List name="effetiveTimeRanges">
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            {...(index === 0
                              ? formItemLayout
                              : formItemLayoutWithOutLabel)}
                            label={index === 0 ? '生效时间' : ''}
                            required={false}
                            key={field.key}
                          >
                            <Space key={field.key} style={{ display: 'flex' }}>
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                  {
                                    required: true,
                                    message: '选项必填',
                                  },
                                ]}
                                noStyle={true}
                              >
                                <TimePicker.RangePicker />
                              </Form.Item>
                              {!isPreview ? (
                                <MinusCircleOutlined
                                  style={{ fontSize: 14, color: '#f5222d' }}
                                  onClick={() => remove(field.name)}
                                />
                              ) : null}
                            </Space>
                          </Form.Item>
                        ))}
                        {!(isPreview || fields.length === 5) ? (
                          <Form.Item
                            {...formItemLayoutWithOutLabel}
                            style={{
                              marginBottom: '0px',
                            }}
                          >
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              // style={{ width: '60%' }}
                              icon={<PlusOutlined />}
                            >
                              添加生效时间
                            </Button>
                            <Form.ErrorList errors={errors} />
                          </Form.Item>
                        ) : null}
                      </>
                    )}
                  </Form.List>
                </div>
              </Form>
            </>
          ),
        },
      ]}
    />
  );
};

export default forwardRef(RuleEffectiveTime);
