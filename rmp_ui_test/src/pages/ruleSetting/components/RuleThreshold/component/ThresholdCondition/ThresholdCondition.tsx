import React, {
  createRef,
  useMemo,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  type ForwardRefRenderFunction,
  type MutableRefObject,
} from 'react';
import { Row, Col, type FormInstance } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import ThresholdConditionForm from './ThresholdConditionForm';
import { allThresholdConditions } from '../../config';
import { type ExtractUnion } from '../../config/typing';
import { type ThresholdConditionValueProp } from '../../RuleThreshold';
import styles from '../../style.less';

// 使用示例
export type ThresholdConditionConfigAll = ExtractUnion<
  typeof allThresholdConditions
>;

interface Props {
  config: ThresholdConditionConfigAll[];
  defaultValues: ThresholdConditionValueProp[];
  readOnly: boolean;
  onFormValueChange: (valueSnapShot: any) => void;
}

interface Ref {
  handleFormSubmit: () => Promise<ThresholdConditionValueProp[]>;
}

function isValidValue(value: any) {
  if (value === undefined || value === null) {
    return false;
  }
  if (value === '' || Number.isNaN(value)) {
    return false;
  }
  return true;
}

const ThresholdCondition: ForwardRefRenderFunction<Ref, Props> = (
  { config, defaultValues, readOnly, onFormValueChange },
  ref
) => {
  // 为 config 增加 uuid 字段，用于区分每个表格的数据
  const configWithUuid = useMemo(() => {
    return config.map((c) => {
      return { uuid: uuidv4(), ...c };
    });
  }, [config]);

  // 所有表格的 uuid 列表，用于生成结果数据时候的排序
  const uuidList = useMemo(
    () => configWithUuid.map((c) => c.uuid),
    [configWithUuid]
  );

  // 所有表格保存值的快照保存在这里
  const formValueSnapShot = useRef<Record<string, any>>(
    uuidList.map((uuid) => {
      return { [uuid]: {} };
    })
  );

  // 所有表格组件的 ref 保存在这里
  const formRefs = useRef<{
    [key in string]: MutableRefObject<{
      handleFormSubmit: () => Promise<ThresholdConditionValueProp>;
      validateFields: () => Promise<any>;
      getFieldValue: FormInstance['getFieldValue'];
    }>;
  }>(
    uuidList.reduce((acc, uuid) => {
      return { ...acc, [uuid]: createRef() };
    }, {})
  );

  // 触发所有子表格的 warningValue 与 forbidenValue 字段
  const revalidateForms = useCallback(() => {
    Object.keys(formRefs.current).forEach((uuid) => {
      formRefs.current[uuid].current.validateFields();
    });
  }, [formRefs]);

  // 表格字段变化后，将变化值写入快照，用于 Description 拼接描述消费
  const handleFormValuesChange = useCallback(
    (uuid: string, formValue: any) => {
      const state = formValueSnapShot.current;
      formValueSnapShot.current = { ...state, [uuid]: formValue };
      const stateArr = uuidList.map((uid) => {
        return formValueSnapShot.current[uid];
      });
      onFormValueChange(stateArr);
    },
    [onFormValueChange, uuidList]
  );

  // 提交表格数据，转换为接口需要的格式
  const handleFormSubmit = useCallback(async () => {
    const formSubmitValues = await Promise.all(
      Object.keys(formRefs.current).map((uuid) => {
        return formRefs.current[uuid].current.handleFormSubmit();
      })
    );
    return formSubmitValues;
  }, [formRefs]);

  useImperativeHandle(
    ref,
    () => ({
      handleFormSubmit,
    }),
    [handleFormSubmit]
  );

  // 获取所有表格的 warningValue 和 forbidenValue 字段，并进行有效性筛选，用于联动校验
  const getValidFieldValues = useCallback(() => {
    const warningValues = Object.keys(formRefs.current).map((uuid) => {
      return formRefs.current[uuid].current.getFieldValue('warningValue');
    });
    const forbidenValues = Object.keys(formRefs.current).map((uuid) => {
      return formRefs.current[uuid].current.getFieldValue('forbidenValue');
    });
    return {
      warningValues: warningValues.filter(isValidValue),
      forbidenValues: forbidenValues.filter(isValidValue),
    };
  }, [formRefs]);

  // 所有表格 warningValue 字段的校验规则，主要包括：1. 不能同时为空；2. 如果填写了一个，其他的也需要填写
  const warningValueValidator = useCallback(async () => {
    const maxValueCount = Object.keys(formRefs.current).length;
    const { warningValues, forbidenValues } = getValidFieldValues();
    if (warningValues.length === 0 && forbidenValues.length === 0) {
      throw new Error('预警值与禁止值不能同时为空');
    }
    if (warningValues.length > 0 && warningValues.length < maxValueCount) {
      throw new Error('预警值如果填写了一个，其他的也需要填写');
    }
  }, [getValidFieldValues]);

  // 所有表格 forbidenValue 字段的校验规则，主要包括：1. 不能同时为空；2. 如果填写了一个，其他的也需要填写
  const forbidenValueValidator = useCallback(async () => {
    const maxValueCount = Object.keys(formRefs.current).length;
    const { warningValues, forbidenValues } = getValidFieldValues();
    if (warningValues.length === 0 && forbidenValues.length === 0) {
      throw new Error('预警值与禁止值不能同时为空');
    }
    if (forbidenValues.length > 0 && forbidenValues.length < maxValueCount) {
      throw new Error('禁止值如果填写了一个，其他的也需要填写');
    }
  }, [getValidFieldValues]);

  return (
    <>
      <Row
        gutter={12}
        style={{ minWidth: 640 }}
        className={styles.ruleConfigHeader}
      >
        <Col span={8}>
          <div className={styles.ruleConfigHeaderCol}>条件</div>
        </Col>
        <Col span={4}>
          <div className={styles.ruleConfigHeaderCol}>比较方向</div>
        </Col>
        <Col span={6}>
          <div className={styles.ruleConfigHeaderCol}>预警值</div>
        </Col>
        <Col span={6}>
          <div className={styles.ruleConfigHeaderCol}>禁止值</div>
        </Col>
      </Row>
      {configWithUuid.map((item) => {
        return (
          <ThresholdConditionForm
            key={item.uuid}
            config={item}
            ref={formRefs.current[item.uuid]}
            defaultValue={defaultValues.find(
              (v) => v.type === item.conditionType
            )}
            readOnly={readOnly}
            onValuesChange={handleFormValuesChange}
            warningValueValidator={warningValueValidator}
            forbidenValueValidator={forbidenValueValidator}
            revalidateForms={revalidateForms}
          />
        );
      })}
    </>
  );
};

export default forwardRef(ThresholdCondition);
