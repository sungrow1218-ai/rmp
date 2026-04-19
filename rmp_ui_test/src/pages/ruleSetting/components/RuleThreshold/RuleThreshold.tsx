// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  type ForwardRefRenderFunction,
  useImperativeHandle,
  useMemo,
  useCallback,
  useState,
  useRef,
  forwardRef,
} from 'react';
import { Col, Row, Button, Alert, Collapse } from 'antd';
import { type DictCodeEnumType } from '@/utils/dict';
import ThresholdCondition from './component/ThresholdCondition';
import PreCondition from './component/PreCondition';
import ConfigDescription from './component/ConfigDescription';
import { FORM_MODES } from '../../constant';
import RuleConfig, { allThresholdConditions, allPreConditions } from './config';
import { type ExtractUnion } from './config/typing';
import styles from './style.less';
import { SpecialThreshold } from '@/services/rule';
import { isFinite, isString } from 'lodash';
import cstyles from '../EditRule/styles.less';
import { RightOutlined } from '@ant-design/icons';

type ThresholdConditionConfigAll = ExtractUnion<typeof allThresholdConditions>;
type PreConditionConfigAll = ExtractUnion<typeof allPreConditions>;

/**
 * 1、阈值配置模式与 ruleType 一一对应，通用配置模式下没有前置条件，成对校验
 */

// 阈值配置方式是通用模式还是专用模式
const RULE_THRESHOLD_MODE = {
  GENERAL: 'GENERAL',
  SPECIAL: 'SPECIAL',
} as const;

export interface Props {
  defaultValues?: SpecialThreshold;
  mode: keyof typeof FORM_MODES;
  ruleType: DictCodeEnumType['RULE_TYPE_LEVEL_2'];
  debug?: boolean;
}

interface Ref {
  getFormValueAsync: () => Promise<SpecialThreshold>;
}

export interface PreConditionValueProp {
  id: string;
  type: string;
  compareOperation: string;
  thresholdValue?: string;
  unitCode?: string;
}

export interface ThresholdConditionValueProp {
  id: string;
  type: string;
  compareOperation: string;
  warningValue?: string;
  forbidenValue?: string;
  unitCode?: string;
}

function genEmptyPreConditionValue(preConditions: PreConditionConfigAll[]) {
  return preConditions.map((pc) => {
    return {
      id: '0',
      type: pc.conditionType,
      compareOperation: pc.compareOperation[0].code,
    };
  });
}

function genEmptyThresholdConditionValue(
  thresholdConditions: ThresholdConditionConfigAll[]
) {
  return thresholdConditions.map((pc) => {
    return {
      id: '0',
      type: pc.conditionType,
      compareOperation: pc.compareOperation[0].code,
    };
  });
}

// 将接口结构的数据根据类型配置转换为表单结构的数据
function getInitialValues(params: {
  mode: keyof typeof FORM_MODES;
  thresholdConditions: ThresholdConditionConfigAll[] | [];
  preConditions?: PreConditionConfigAll[] | [];
  incomingValue?: SpecialThreshold;
}) {
  const {
    mode,
    incomingValue = {
      preConditionList: [],
      thresholdConditionList: [],
    } as SpecialThreshold,
    thresholdConditions,
    preConditions = [],
  } = params;

  // 新增的时候，两个表格的默认值均为空
  if (mode === FORM_MODES.ADD) {
    const emptyThresholdConditionValue =
      genEmptyThresholdConditionValue(thresholdConditions);
    /**
     * ruleType 没有 preConditions 的情况
     */
    if (!preConditions || preConditions?.length === 0) {
      return { thresholdCondition: emptyThresholdConditionValue };
    }
    /**
     * ruleType 有 preConditions 的情况
     */
    const emptyPreConditionValue = genEmptyPreConditionValue(preConditions);
    return {
      thresholdCondition: emptyThresholdConditionValue,
      preCondition: emptyPreConditionValue,
    };
  }

  const preConditionDefaultValue = preConditions.map(
    ({ conditionType, compareOperation }) => {
      if (
        incomingValue.preConditionList &&
        incomingValue.preConditionList.length === 0
      ) {
        return {
          id: '0',
          type: conditionType,
          compareOperation: compareOperation[0].code,
          thresholdValue: undefined,
        };
      } else {
        const target = (incomingValue.preConditionList || []).find(
          (i) => `${i.conditionType}` === conditionType
        );
        return {
          id: String(target?.conditionId),
          type: conditionType,
          compareOperation:
            String(target?.conditionCompareDirection) ||
            compareOperation[0].code,
          thresholdValue: target?.conditionValue,
        };
      }
    }
  );

  const thresholdConditionDefaultValue = thresholdConditions.map(
    ({ conditionType, compareOperation }) => {
      if (
        incomingValue.thresholdConditionList &&
        incomingValue.thresholdConditionList.length === 0
      ) {
        return {
          id: '0',
          type: conditionType,
          compareOperation: compareOperation[0].code,
          warningValue: undefined,
          forbidenValue: undefined,
        };
      } else {
        const target = (incomingValue.thresholdConditionList || []).find(
          (i) => `${i.conditionType}` === conditionType
        );
        return {
          id: String(target?.conditionId),
          type: conditionType,
          compareOperation: target?.conditionCompareDirection
            ? String(target?.conditionCompareDirection)
            : compareOperation[0].code,
          warningValue: target?.conditionWarnValue,
          forbidenValue: target?.conditionForbidValue,
        };
      }
    }
  );

  // 复制模式下，将 id 设置为 0
  if (mode === FORM_MODES.ADD_VIA_COPY) {
    return {
      preCondition:
        preConditionDefaultValue.map((p) => ({ ...p, id: '0' })) || [],
      thresholdCondition:
        thresholdConditionDefaultValue.map((t) => ({ ...t, id: '0' })) || [],
    };
  }

  // 编辑 & 查看模式下，直接返回
  return {
    preCondition: preConditionDefaultValue || [],
    thresholdCondition: thresholdConditionDefaultValue || [],
  };
}

// 转换数值
const parseNumberLikeValue = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (isString(value)) {
    const parse = Number(value);
    return isFinite(parse) ? parse : undefined;
  }
  if (isFinite(value)) {
    return value;
  }
};

const RuleThreshold: ForwardRefRenderFunction<Ref, Props> = (
  { ruleType, defaultValues, mode, debug },
  ref
) => {
  const preConditionRef = useRef<{
    handleFormSubmit: () => Promise<PreConditionValueProp[]>;
  }>(null);
  const thresholdConditionRef = useRef<{
    handleFormSubmit: () => Promise<ThresholdConditionValueProp[]>;
  }>(null);

  const { thresholdConditions, preConditions } = useMemo(() => {
    const matchedConf = RuleConfig?.[ruleType];
    const emptyConf = { thresholdConditions: [], preConditions: [] };
    if (!matchedConf) {
      return emptyConf;
    }
    return {
      ...emptyConf,
      ...matchedConf,
    };
  }, [ruleType]);

  const [preConditionSnapShot, setPreConditionSnapShot] = useState<any[]>([]);
  const [thresholdConditionSnapShot, setThresholdConditionSnapShot] = useState<
    any[]
  >([]);

  const handlePreConditionChange = useCallback((values: any[]) => {
    setPreConditionSnapShot(values);
  }, []);

  const handleThresholdConditionChange = useCallback((values: any[]) => {
    setThresholdConditionSnapShot(values);
  }, []);

  const readOnly = mode === FORM_MODES.PREVIEW;

  const initialValues = useMemo(
    () =>
      getInitialValues({
        mode,
        thresholdConditions:
          thresholdConditions as ThresholdConditionConfigAll[],
        preConditions: preConditions as PreConditionConfigAll[],
        incomingValue: defaultValues,
      }),
    [defaultValues, mode, preConditions, thresholdConditions]
  );

  const handleSubmit = useCallback(async () => {
    const [preConditionValues = [], thresholdConditionValues = []] =
      await Promise.all([
        preConditionRef?.current?.handleFormSubmit(),
        thresholdConditionRef?.current?.handleFormSubmit(),
      ]);
    const result = {
      preConditionList: preConditionValues.map((i) => ({
        conditionId: Number(i.id),
        conditionType: Number(i.type),
        conditionCompareDirection: Number(i.compareOperation),
        conditionValue: parseNumberLikeValue(i.thresholdValue),
        unit: Number(i.unitCode),
      })),
      thresholdConditionList: thresholdConditionValues.map((i) => ({
        conditionId: Number(i.id),
        conditionType: Number(i.type),
        conditionCompareDirection: Number(i.compareOperation),
        conditionWarnValue: parseNumberLikeValue(i.warningValue),
        conditionForbidValue: parseNumberLikeValue(i.forbidenValue),
        unit: Number(i.unitCode),
      })),
    };
    return result;
  }, [preConditionRef, thresholdConditionRef]);

  useImperativeHandle(ref, () => ({ getFormValueAsync: handleSubmit }), [
    handleSubmit,
  ]);

  if (!thresholdConditions && !preConditions) {
    return null;
  }

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
              className={cstyles.blockTitle}
              onClick={() => setActiveKey(activeKey.length === 0 ? ['1'] : [])}
            >
              阈值设置
            </div>
          ),
          children: (
            <div style={{ paddingTop: '12px' }}>
              {debug && (
                <Alert
                  message={
                    <>
                      {`规则类型：${ruleType} 模式：${mode}`}
                      <Button onClick={handleSubmit}>提交</Button>
                    </>
                  }
                  type="warning"
                />
              )}
              <Row gutter={24} className={styles.container}>
                {preConditions && preConditions.length !== 0 && (
                  <Col span={12}>
                    <div style={{ marginRight: 100 }}>
                      <div className={styles.ruleConfigTableTitle}>
                        前置条件
                      </div>
                      <PreCondition
                        config={preConditions as PreConditionConfigAll[]}
                        defaultValues={
                          initialValues.preCondition as PreConditionValueProp[]
                        }
                        readOnly={readOnly}
                        onFormValueChange={handlePreConditionChange}
                        ref={preConditionRef}
                      />
                    </div>
                  </Col>
                )}
                {thresholdConditions && thresholdConditions.length !== 0 && (
                  <Col span={12}>
                    <div className={styles.ruleConfigTableTitle}>阈值条件</div>
                    <ThresholdCondition
                      config={
                        thresholdConditions as ThresholdConditionConfigAll[]
                      }
                      defaultValues={
                        initialValues.thresholdCondition as ThresholdConditionValueProp[]
                      }
                      readOnly={readOnly}
                      onFormValueChange={handleThresholdConditionChange}
                      ref={thresholdConditionRef}
                    />
                  </Col>
                )}
                <Col span={24} style={{ marginTop: '10px' }}>
                  <ConfigDescription
                    ruleType={ruleType}
                    preConditionValues={preConditionSnapShot}
                    thresholdConditionValues={thresholdConditionSnapShot}
                  />
                </Col>
              </Row>
            </div>
          ),
        },
      ]}
    />
  );
};

export default forwardRef(RuleThreshold);
