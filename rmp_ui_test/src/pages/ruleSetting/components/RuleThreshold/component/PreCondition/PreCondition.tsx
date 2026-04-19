import React, {
  useMemo,
  useRef,
  createRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
  type ForwardRefRenderFunction,
  type MutableRefObject,
} from 'react';
import { Row, Col } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import PreConditionForm from './PreConditionForm';
import { allPreConditions } from '../../config';
import { type ExtractUnion } from '../../config/typing';
import { type PreConditionValueProp } from '../../RuleThreshold';
import styles from '../../style.less';

// 使用示例
export type PreConditionConfigAll = ExtractUnion<typeof allPreConditions>;

interface Props {
  config: PreConditionConfigAll[];
  defaultValues: PreConditionValueProp[];
  readOnly: boolean;
  onFormValueChange: (valueSnapShot: any) => void;
}

interface Ref {
  handleFormSubmit: () => Promise<PreConditionValueProp[]>;
}

const PreCondition: ForwardRefRenderFunction<Ref, Props> = (
  { config, defaultValues, readOnly, onFormValueChange },
  ref
) => {
  const configWithUuid = useMemo(() => {
    return config.map((c) => {
      return { uuid: uuidv4(), ...c };
    });
  }, [config]);

  const uuidList = useMemo(
    () => configWithUuid.map((c) => c.uuid),
    [configWithUuid]
  );

  const formValueSnapShot = useRef<Record<string, any>>(
    uuidList.map((uuid) => {
      return { [uuid]: {} };
    })
  );

  const formRefs = useRef<{
    [key in string]: MutableRefObject<{
      handleFormSubmit: () => Promise<PreConditionValueProp>;
    }>;
  }>(
    uuidList.reduce((acc, uuid) => {
      return { ...acc, [uuid]: createRef() };
    }, {})
  );

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

  return (
    <>
      <Row
        gutter={12}
        style={{ minWidth: 640, width: '100%' }}
        className={styles.ruleConfigHeader}
      >
        <Col span={10}>
          <div className={styles.ruleConfigHeaderCol}>条件</div>
        </Col>
        <Col span={7}>
          <div className={styles.ruleConfigHeaderCol}>比较方向</div>
        </Col>
        <Col span={7}>
          <div className={styles.ruleConfigHeaderCol}>阈值</div>
        </Col>
      </Row>
      {configWithUuid.map((item) => {
        return (
          <PreConditionForm
            key={item.uuid}
            config={item}
            ref={formRefs.current[item.uuid]}
            defaultValue={defaultValues.find(
              (v) => v.type === item.conditionType
            )}
            readOnly={readOnly}
            onValuesChange={handleFormValuesChange}
          />
        );
      })}
    </>
  );
};

export default forwardRef(PreCondition);
