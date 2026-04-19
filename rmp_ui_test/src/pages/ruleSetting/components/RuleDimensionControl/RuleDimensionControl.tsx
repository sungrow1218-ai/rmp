// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  useCallback,
  useMemo,
  type ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import {
  Form,
  Select,
  FormProps,
  Table,
  Popover,
  Alert,
  Button,
  Collapse,
} from 'antd';
import {
  type DictCodeEnumType,
  DIMENSION_CONTROL_TYPES__MAP,
  RULE_CONTROL_DIM,
  transformDictFeKeyToCodeHelper,
} from '@/utils/dict';
import ShareholderAccountSelect from './component/ShareholderAccountSelect';
import { FORM_MODES } from '../../constant';
import { AcctItem, RuleControlAcct } from '@/services/rule';
import { ExtSysItem, SobInfo } from '@/services/account';
import ControlAcctTypeSelect, {
  BookTypeEnum,
  BookTypeToAcctType,
} from './component/ControlAcctTypeSelect';
import ExtSystemSelect from '@/components/ExtSystemSelect';
import { useMount } from 'ahooks';
import MultiSelectAccount from '../RuleCalculateParam/components/MultiSelectAccount';
import { isArray } from 'lodash';
import ExcludeAcctTypeSelect from './component/ExcludeAcctTypeSelect';
import AcctGroupSelect from './component/AcctGroupSelect';
import { QuestionCircleOutlined, RightOutlined } from '@ant-design/icons';

import styles from '../EditRule/styles.less';
import { transformDictToSelectOptionsLabel } from '@/utils/utils';

export interface Props {
  mode: keyof typeof FORM_MODES;
  ruleType: DictCodeEnumType['RULE_TYPE_LEVEL_2'];
  defaultValues?: Partial<RuleControlAcct>;
  debug?: boolean;
  sobInfo?: SobInfo;
  includeExtSystem?: boolean;
  onlyTradeAccount?: boolean;
  onlyManageAccount?: boolean;
  unionControlTypeOptionsNew?: ItemProps[];
  onValuesChange?: FormProps['onValuesChange'];
  ruleParamValues?: any;
  ShareholderAccountSelectShowAllOption?: boolean;
  includeAcctGroup?: boolean;
}

interface ItemProps {
  label: string;
  value: string;
}
interface Ref {
  getFormValueAsync: () => Promise<Partial<RuleControlAcct>>;
}

const FormItem = Form.Item;

/** 联合控制方式选项 */
const unionControlTypeOptions = [
  DIMENSION_CONTROL_TYPES__MAP.INDEPENDENT,
  DIMENSION_CONTROL_TYPES__MAP.UNION,
].map((cdt) => {
  return { label: cdt.name, value: cdt.code };
});

// acctType映射bookType
export const AcctTypeToBookType = {
  [transformDictFeKeyToCodeHelper('BY_TRADING_ACCOUNT', RULE_CONTROL_DIM)]:
    BookTypeEnum.TRADE_ACCOUNT,
  [transformDictFeKeyToCodeHelper('BY_MANAGEMNT_ACCOUNT', RULE_CONTROL_DIM)]:
    BookTypeEnum.MANAGE_ACCOUNT,
};

const fixedInitialValues = {
  acctLevel: '',
  excludeAcctLevel: '',
  controlAcctType: null,
  excludeAcctType: null,
  unionControlType: '0',
  extSysIds: [],
  controlAccts: [],
  excludeAccts: [],
};

function getIntialValues({
  mode,
  defaultValues,
}: {
  mode: keyof typeof FORM_MODES;
  defaultValues?: Partial<RuleControlAcct>;
}) {
  if (mode === FORM_MODES.ADD || !defaultValues) {
    return fixedInitialValues;
  }
  const {
    acctLevel = fixedInitialValues.acctLevel,
    controlAcctType = fixedInitialValues.controlAcctType,
    excludeAcctType = fixedInitialValues.excludeAcctType,
    excludeAcctLevel = fixedInitialValues.excludeAcctLevel,
    unionControlType = fixedInitialValues.unionControlType,
    controlAcctList = [],
    excludeAcctList = [],
  } = defaultValues || {};

  const finalInitialValues: {
    acctLevel: string | number;
    excludeAcctLevel: string | number;
    controlAcctType: string | number | null;
    excludeAcctType: string | number | null;
    unionControlType: string | number;
    extSysIds: Set<number> | number[];
    controlAcctList: Partial<AcctItem>[];
    excludeAcctList: Partial<AcctItem>[];
  } = {
    acctLevel: `${acctLevel}`,
    excludeAcctLevel: `${excludeAcctLevel}`,
    controlAcctType: controlAcctType ? `${acctLevel}|${controlAcctType}` : null,
    excludeAcctType: excludeAcctType
      ? `${excludeAcctLevel}|${excludeAcctType}`
      : null,
    unionControlType: `${unionControlType}`,
    extSysIds: new Set([
      ...controlAcctList.map((i) => i.extSysId as number),
      ...excludeAcctList
        .filter((i) => i.extSysId)
        .map((i) => i.extSysId as number),
    ]),
    controlAcctList,
    excludeAcctList,
  };

  finalInitialValues.extSysIds = [...finalInitialValues.extSysIds];

  // 对接系统特殊处理
  if (
    controlAcctType ===
    Number(
      transformDictFeKeyToCodeHelper('BY_INTERGRATE_SYSTEM', RULE_CONTROL_DIM)
    )
  ) {
    finalInitialValues.controlAcctList = [];
  }

  // 账户组特殊处理
  if (
    controlAcctType ===
    Number(transformDictFeKeyToCodeHelper('BY_ACCT_GROUP', RULE_CONTROL_DIM))
  ) {
    finalInitialValues.extSysIds = [];
  }

  return finalInitialValues;
}

/**
 * 维度控制编辑组件
 * FIXME：针对一期完全定制的版本，功能只能适配一期，未来可能会被完全重构
 */
const RuleDimensionControl: ForwardRefRenderFunction<Ref, Props> = (
  {
    mode,
    ruleType,
    defaultValues,
    debug,
    sobInfo,
    includeExtSystem,
    onlyManageAccount,
    onlyTradeAccount,
    unionControlTypeOptionsNew = unionControlTypeOptions,
    onValuesChange,
    ruleParamValues,
    ShareholderAccountSelectShowAllOption,
    includeAcctGroup,
  },
  ref
) => {
  const isPreview = mode === FORM_MODES.PREVIEW;
  const [form] = Form.useForm();
  const initialValues = useMemo(() => {
    return getIntialValues({ mode, defaultValues });
  }, [defaultValues, mode]);
  const [formValues, setFormValues] = useState(initialValues);
  const [extSystems, setExtSystems] = useState<ExtSysItem[]>([]);

  useEffect(() => {
    onValuesChange && onValuesChange({}, initialValues);
  }, [initialValues]);

  const extSysIds = Form.useWatch('extSysIds', form);
  const unionControlTypeVal = Form.useWatch('unionControlType', form);

  const handleFormSubmit = useCallback(async () => {
    const values = await form.validateFields();

    const {
      controlAcctType,
      excludeAcctType,
      unionControlType,
      controlAcctList = [],
      excludeAcctList = [],
    } = values;

    const [acctLevel, acctType] = controlAcctType.split('|');

    // 对接系统
    if (
      acctType ===
      transformDictFeKeyToCodeHelper('BY_INTERGRATE_SYSTEM', RULE_CONTROL_DIM)
    ) {
      const resultParams: Recordable = {
        controlAcctType: Number(acctType),
        unionControlType: Number(unionControlType),
        controlAcctList: extSysIds.map((extSysId: string) => ({ extSysId })),
        19998: values['19998'] ? values['19998'] : undefined,
      };

      if (excludeAcctType) {
        const [eAcctLevel, eAcctType] = excludeAcctType.split('|');
        resultParams.excludeAcctType = Number(eAcctType);
        // 排除类型账户组
        if (eAcctType === '5') {
          resultParams.excludeAcctList = excludeAcctList.map((i: any) => ({
            accountCode: i.accountCode,
          }));
        } else {
          resultParams.excludeAcctList = excludeAcctList;
          resultParams.excludeAcctLevel = Number(eAcctLevel);
        }
      }

      return resultParams;
    }

    // 账户组
    if (
      acctType ===
      transformDictFeKeyToCodeHelper('BY_ACCT_GROUP', RULE_CONTROL_DIM)
    ) {
      const resultParams: Recordable = {
        controlAcctType: Number(acctType),
        unionControlType: Number(unionControlType),
        controlAcctList: controlAcctList.map((i: any) => ({
          accountCode: i.accountCode,
        })),
      };

      return resultParams;
    }

    return {
      acctLevel: Number(acctLevel),
      controlAcctType: Number(acctType),
      unionControlType: Number(unionControlType),
      controlAcctList,
      excludeAcctList,
      19998: values['19998'] ? values['19998'] : undefined,
    };
  }, [form, extSysIds]);

  useImperativeHandle(
    ref,
    () => ({
      getFormValueAsync: handleFormSubmit,
      getFieldValue: () => form.getFieldsValue(),
      extSystemsList: extSystems,
    }),
    [handleFormSubmit, extSystems, form]
  );

  const controlAcctType = Form.useWatch('controlAcctType', form);

  const excludeAcctType = Form.useWatch('excludeAcctType', form);

  // 控制账户-显示
  const isShowControlAcct = useMemo(() => {
    if (!controlAcctType) {
      return false;
    }
    const [, acctType] = controlAcctType.split('|');

    // 对接系统
    if (
      acctType ===
      transformDictFeKeyToCodeHelper('BY_INTERGRATE_SYSTEM', RULE_CONTROL_DIM)
    ) {
      return false;
    }
    // 账户组
    if (
      acctType ===
      transformDictFeKeyToCodeHelper('BY_ACCT_GROUP', RULE_CONTROL_DIM)
    ) {
      return false;
    }
    return true;
  }, [controlAcctType]);

  // 排除账户-显示
  const isShowExcludeAcct = useMemo(() => {
    if (!controlAcctType) {
      return false;
    }
    if (controlAcctType) {
      const [, acctType] = controlAcctType.split('|');
      // 对接系统
      if (
        acctType ===
          transformDictFeKeyToCodeHelper(
            'BY_INTERGRATE_SYSTEM',
            RULE_CONTROL_DIM
          ) &&
        !excludeAcctType
      ) {
        return false;
      }
      // 账户组（控制类型）
      if (
        acctType ===
        transformDictFeKeyToCodeHelper('BY_ACCT_GROUP', RULE_CONTROL_DIM)
      ) {
        return false;
      }
    }
    if (excludeAcctType) {
      const [, acctType] = excludeAcctType.split('|');
      // 账户组（排除控制类型）
      if (
        acctType ===
        transformDictFeKeyToCodeHelper('BY_ACCT_GROUP', RULE_CONTROL_DIM)
      ) {
        return false;
      }
    }
    return true;
  }, [controlAcctType, excludeAcctType]);

  // 排除账户类型-显示
  const isShowExcludeType = useMemo(() => {
    if (!controlAcctType) {
      return false;
    }
    const [, acctType] = controlAcctType.split('|');

    // 对接系统
    if (
      acctType ===
      transformDictFeKeyToCodeHelper('BY_INTERGRATE_SYSTEM', RULE_CONTROL_DIM)
    ) {
      return true;
    }
    return false;
  }, [controlAcctType]);

  // 账户组-显示（控制方式）
  const isShowAcctGroupByControlAcctType = useMemo(() => {
    if (!controlAcctType) {
      return false;
    }
    const [, acctType] = controlAcctType.split('|');
    if (
      acctType ===
      transformDictFeKeyToCodeHelper('BY_ACCT_GROUP', RULE_CONTROL_DIM)
    ) {
      return true;
    }
    return false;
  }, [controlAcctType, excludeAcctType]);

  // 账户组-显示（排除控制方式）
  const isShowAcctGroupByExcludeAcctType = useMemo(() => {
    if (!excludeAcctType) {
      return false;
    }
    const [, acctType] = excludeAcctType.split('|');
    if (
      acctType ===
      transformDictFeKeyToCodeHelper('BY_ACCT_GROUP', RULE_CONTROL_DIM)
    ) {
      return true;
    }
    return false;
  }, [excludeAcctType]);

  // 对接系统-显示
  const isShowExtSystem = useMemo(() => {
    if (!controlAcctType) {
      return true;
    }
    const [, acctType] = controlAcctType.split('|');
    if (
      acctType ===
      transformDictFeKeyToCodeHelper('BY_ACCT_GROUP', RULE_CONTROL_DIM)
    ) {
      return false;
    }
    return true;
  }, [controlAcctType]);

  const getControlAcctLabel = useMemo(() => {
    if (controlAcctType && sobInfo) {
      const [bookLevel, acctType] = controlAcctType.split('|');
      const bookList = sobInfo.bookList.find(
        (i) => i.bookType === AcctTypeToBookType[acctType]
      );
      if (bookList && bookList.bookLevelList.length > 0) {
        const item = bookList.bookLevelList.find(
          (i) => i.bookLevel === Number(bookLevel)
        );
        return item ? item.bookLevelName : '股东账户';
      } else {
        return '股东账户';
      }
    } else {
      return '股东账户';
    }
  }, [controlAcctType, sobInfo]);

  const getExcludeAcctLabel = useMemo(() => {
    if (controlAcctType && sobInfo) {
      const [bookLevel, acctType] = (excludeAcctType || controlAcctType).split(
        '|'
      );
      const bookList = sobInfo.bookList.find(
        (i) => i.bookType === AcctTypeToBookType[acctType]
      );
      if (bookList && bookList.bookLevelList.length > 0) {
        const item = bookList.bookLevelList.find(
          (i) => i.bookLevel === Number(bookLevel)
        );
        return item ? `排除${item.bookLevelName}` : '排除股东账户';
      } else {
        return '排除股东账户';
      }
    } else {
      return '排除股东账户';
    }
  }, [controlAcctType, excludeAcctType, sobInfo]);

  const handleValuesChange: FormProps['onValuesChange'] = (
    changedValues,
    allValues
  ) => {
    let obj = { ...allValues };
    if (changedValues.controlAcctType === '|3') {
      obj = { ...obj, items: {} };
      form.setFieldValue('items', {});
    }
    setFormValues({ ...obj });

    // 选中对接系统改变控制方式
    if (changedValues.controlAcctType) {
      const [, acctType] = changedValues.controlAcctType.split('|');
      // 对接系统
      if (
        acctType ===
        transformDictFeKeyToCodeHelper('BY_INTERGRATE_SYSTEM', RULE_CONTROL_DIM)
      ) {
        form.setFieldValue('unionControlType', undefined);
        form.setFieldValue('excludeAcctList', []);
      }
      // 账户组
      if (
        acctType ===
        transformDictFeKeyToCodeHelper('BY_ACCT_GROUP', RULE_CONTROL_DIM)
      ) {
        form.setFieldValue('controlAcctList', []);
      }
      form.setFieldValue('excludeAcctType', undefined);
    }

    // 选中排除账户类型
    if (changedValues.excludeAcctType) {
      const [, acctType] = changedValues.excludeAcctType.split('|');
      // 账户组
      if (
        acctType ===
        transformDictFeKeyToCodeHelper('BY_ACCT_GROUP', RULE_CONTROL_DIM)
      ) {
        form.setFieldValue('excludeAcctList', []);
      }
    }

    onValuesChange && onValuesChange(changedValues, obj);
  };

  useMount(() => {
    // 新建时默认选中第一个
    if (
      mode === FORM_MODES.ADD &&
      sobInfo &&
      sobInfo.bookList.length > 0 &&
      sobInfo.bookList[0].bookLevelList.length > 0
    ) {
      const { bookLevel } = sobInfo.bookList[0].bookLevelList[0];
      const defaultOptionValue = `${bookLevel}|${
        BookTypeToAcctType[sobInfo.bookList[0].bookType as BookTypeEnum]
      }`;
      if (!onlyManageAccount) {
        form.setFieldValue('controlAcctType', defaultOptionValue);
        setTimeout(() => {
          handleValuesChange(
            { controlAcctType: defaultOptionValue },
            form.getFieldsValue()
          );
        }, 50);
      }
    }
  });

  const freeVal = useMemo(() => {
    if (ruleType === 'J2') {
      return isArray(ruleParamValues)
        ? ruleParamValues.find((d) => {
            return d.ruleParamType === 19998;
          })
        : {};
    }
    return null;
  }, [ruleType, ruleParamValues]);

  useEffect(() => {
    if (ruleType === 'F1') {
      if (ruleParamValues && ruleParamValues['14'] === '2') {
        form.setFieldValue('unionControlType', '0');
        onValuesChange &&
          onValuesChange(null, { ...formValues, unionControlType: '0' });
      }
    }
  }, [ruleType, ruleParamValues]);

  const tipTable = (
    <>
      <Table
        columns={[
          {
            dataIndex: 'controlType',
            title: '账户控制类型',
            align: 'center',
            onCell: (_, index) => {
              if (index === 0 || index === 2 || index === 4) {
                return { rowSpan: 2 };
              } else {
                return { rowSpan: 0 };
              }
            },
          },
          { dataIndex: 'mode', title: '控制模式', align: 'center' },
          {
            dataIndex: 'explain',
            title: '说明',
            align: 'center',
            render: (value: string) => {
              const [line1, line2] = value.split('|');
              return (
                <>
                  <div style={{ textAlign: 'left' }}>{line1}</div>
                  <div style={{ textAlign: 'left' }}>{line2}</div>
                </>
              );
            },
          },
        ]}
        dataSource={[
          {
            controlType: '账户组',
            mode: '单独控制',
            explain:
              '账户组的每个账户均单独控制|如果两个账户组A和B，A里有10个账户，B有9个账户，则19个账户均单独控制',
          },
          {
            controlType: '账户组',
            mode: '联合控制',
            explain:
              '所有账户一起控制|如果两个账户组A和B，A里有10个账户，B有9个账户，则19个账户合并控制',
          },
          {
            controlType: '对接系统',
            mode: '单独控制',
            explain:
              '每个对接系统单独控制|如对接系统选择O45，代表O45里的所有账户一起控',
          },
          {
            controlType: '对接系统',
            mode: '联合控制',
            explain:
              '对接系统一起控制|如对接系统选择O32、O45，代表O32、O45里的所有账户一起控',
          },
          {
            controlType: '其他类型',
            mode: '单独控制',
            explain:
              '按所选的账户单独控制|如产品账户类型，选择A和B两个产品账户，则A和B分开控制',
          },
          {
            controlType: '其他类型',
            mode: '联合控制',
            explain:
              '按所选的账户一起控制|如产品账户类型，选择A和B两个产品账户，则A和B合并控制',
          },
        ]}
        pagination={false}
      />
    </>
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
              账户控制范围
            </div>
          ),
          children: (
            <>
              {debug && (
                <Alert
                  message={
                    <>
                      {`规则类型：${ruleType} 模式：${mode}`}
                      <Button onClick={handleFormSubmit}>提交</Button>
                    </>
                  }
                  type="warning"
                />
              )}
              <Form
                name="ruleDimensionControlForm"
                autoComplete="off"
                initialValues={initialValues}
                form={form}
                layout="inline"
                disabled={isPreview}
                onValuesChange={handleValuesChange}
                style={{ width: '100%', marginBottom: '8px' }}
              >
                <FormItem
                  label="账户控制类型"
                  name="controlAcctType"
                  rules={[{ required: true, message: '选项必填' }]}
                >
                  <ControlAcctTypeSelect
                    sobInfo={sobInfo}
                    includeExtSystem={includeExtSystem}
                    onlyManageAccount={onlyManageAccount}
                    onlyTradeAccount={onlyTradeAccount}
                    includeAcctGroup={includeAcctGroup}
                  />
                </FormItem>
                <FormItem
                  label={
                    <>
                      联合控制模式
                      <Popover
                        content={tipTable}
                        placement={'bottom'}
                        autoAdjustOverflow={false}
                        getPopupContainer={() => document.body}
                      >
                        <QuestionCircleOutlined style={{ marginLeft: '4px' }} />
                      </Popover>
                    </>
                  }
                  name="unionControlType"
                  rules={[{ required: true, message: '选项必填' }]}
                >
                  <Select
                    options={transformDictToSelectOptionsLabel(
                      unionControlTypeOptionsNew
                    )}
                    style={{ width: '240px' }}
                  />
                </FormItem>
                {isShowExtSystem ? (
                  <FormItem
                    label="对接系统"
                    name="extSysIds"
                    rules={[{ required: true, message: '选项必填' }]}
                  >
                    <ExtSystemSelect
                      sobId={sobInfo?.sobId}
                      authFlag={mode === 'PREVIEW' ? 0 : 1}
                      updateExtSystems={(value) => setExtSystems(value)}
                      style={{ width: '240px' }}
                    />
                  </FormItem>
                ) : null}
                {isShowControlAcct ? (
                  <FormItem
                    label={getControlAcctLabel}
                    name="controlAcctList"
                    rules={[{ required: true, message: '选项必填' }]}
                  >
                    <ShareholderAccountSelect
                      mode={mode}
                      integrationSystemIds={extSysIds}
                      sobInfo={sobInfo as SobInfo}
                      controlAcctType={controlAcctType}
                      extSystems={extSystems}
                      showAllOption={ShareholderAccountSelectShowAllOption}
                      style={{ width: '360px' }}
                    />
                  </FormItem>
                ) : null}
                {isShowExcludeType ? (
                  <FormItem label="排除账户类型" name="excludeAcctType">
                    <ExcludeAcctTypeSelect
                      sobInfo={sobInfo as SobInfo}
                      includeAcctGroup={includeAcctGroup}
                      style={{ width: '240px' }}
                    />
                  </FormItem>
                ) : null}
                {isShowExcludeAcct ? (
                  <FormItem label={getExcludeAcctLabel} name="excludeAcctList">
                    <ShareholderAccountSelect
                      mode={mode}
                      integrationSystemIds={extSysIds}
                      sobInfo={sobInfo as SobInfo}
                      controlAcctType={excludeAcctType || controlAcctType}
                      extSystems={extSystems}
                      style={{ width: '360px' }}
                    />
                  </FormItem>
                ) : null}
                {isShowAcctGroupByControlAcctType ? (
                  <FormItem
                    label="账户组"
                    name="controlAcctList"
                    validateFirst={true}
                    rules={[
                      { required: true, message: '选项必填' },
                      () => ({
                        validator(_, value) {
                          const flag = new Set();
                          for (const item of value) {
                            flag.add(item.type);
                          }
                          if (flag.size === 1) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('账户类型不一致'));
                        },
                      }),
                    ]}
                  >
                    <AcctGroupSelect
                      sobInfo={sobInfo as SobInfo}
                      style={{ width: '360px' }}
                    />
                  </FormItem>
                ) : null}
                {isShowAcctGroupByExcludeAcctType ? (
                  <FormItem
                    label="排除账户组"
                    name="excludeAcctList"
                    validateFirst={true}
                    rules={[
                      () => ({
                        validator(_, value) {
                          const flag = new Set();
                          for (const item of value) {
                            flag.add(item.type);
                          }
                          if (flag.size === 1) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('账户类型不一致'));
                        },
                      }),
                    ]}
                  >
                    <AcctGroupSelect
                      sobInfo={sobInfo as SobInfo}
                      style={{ width: '360px' }}
                    />
                  </FormItem>
                ) : null}
                {(ruleType === 'J2' || ruleType === 'J4') &&
                unionControlTypeVal === '2' ? (
                  <FormItem label="单向豁免账户组" name="19998">
                    <MultiSelectAccount
                      ruleSecuParams={{
                        ...formValues,
                        sobInfo,
                        extSystems,
                      }}
                      values={freeVal}
                      mode={mode}
                    />
                  </FormItem>
                ) : null}
              </Form>
            </>
          ),
        },
      ]}
    />
  );
};

export default forwardRef(RuleDimensionControl);
