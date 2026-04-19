// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  type ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
  useMemo,
} from 'react';
import { Select, Table, message, Button, Collapse } from 'antd';
import { buildShortUUID } from '@/utils/uuid';
import { queryRuleBaseInfo } from '@/services/ruleSetting';
import {
  transformDictCodeToNameHelper,
  RULE_RELATION_TYPES,
  RULE_TYPE_LEVEL_2,
} from '@/utils/dict';
import { FORM_MODES } from '../../constant';
import styles from '../EditRule/styles.less';
import { DeleteOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

interface RuleRelaDTO {
  ruleRelaType: number;
  relaRuleId: number;
  relaRuleType: string;
  relaRuleName: string;
  relaRulePriority: number;
}

interface RuleRela {
  key: React.Key;
  relaRuleType: string;
  ruleId: number;
  ruleType: string;
  rulePriority: number;
  ruleName: string;
  [key: string]: any;
}

interface Ref {
  getFormValueAsync: () => Promise<
    Pick<RuleRelaDTO, 'ruleRelaType' | 'relaRuleId'>[]
  >;
}

type ModeType = keyof typeof FORM_MODES;

interface OptionItem {
  label: string;
  value: string;
  disabled: boolean;
  [key: string]: any;
}

export interface Props {
  mode: ModeType;
  workGroupId: number;
  defaultValues?: RuleRelaDTO[];
  ruleType: string;
}

const RuleRelaion: ForwardRefRenderFunction<Ref, Props> = (
  { mode, defaultValues, workGroupId, ruleType },
  ref
) => {
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([]);
  const [ruleRelaList, setRuleRelaList] = useState<
    NullableProperties<RuleRela>[]
  >([]);
  const [errorList, setErrorList] = useState<React.Key[]>([]);

  const isPreview = mode === FORM_MODES.PREVIEW;

  const [options, setOptions] = useState<OptionItem[]>([]);

  useEffect(() => {
    const getRules = async () => {
      try {
        const response = await queryRuleBaseInfo({
          workGroupId,
          pageId: 1,
          pageSize: 5000,
          authorityFlag: mode === 'PREVIEW' ? 0 : 2,
          filterCondition: { ruleType: [ruleType] },
        });
        if (response.code !== 0) {
          throw new Error('查询规则信息失败');
        }
        if (response.data && response.data.resultList) {
          setOptions(
            response.data.resultList.map((i: any) => ({
              label: `${i.ruleId}-${i.ruleName}`,
              value: i.ruleId,
              disabled: false,
              ...i,
            }))
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    getRules();
  }, []);

  const getOptions = useMemo(() => {
    return options.map((i) => ({
      ...i,
      disabled: ruleRelaList.map((j) => j.ruleId).includes(i.ruleId),
    }));
  }, [ruleRelaList, options]);

  const columns: ColumnsType<NullableProperties<RuleRela>> = [
    {
      title: '关联关系',
      dataIndex: 'relaRuleType',
      width: '20%',
      render: (value, record, index) =>
        isPreview ? (
          transformDictCodeToNameHelper(value.toString(), RULE_RELATION_TYPES)
        ) : (
          <Select
            style={{ width: '100%' }}
            options={RULE_RELATION_TYPES.map((i) => ({
              label: i.name,
              value: i.code,
            }))}
            defaultValue={value}
            onChange={(select) => {
              // 赋值
              setRuleRelaList((prev) => {
                const list = [...prev];
                list.splice(index, 1, {
                  ...record,
                  relaRuleType: select,
                });
                return list;
              });
            }}
          />
        ),
    },
    {
      title: '规则编号',
      dataIndex: 'ruleId',
      width: '20%',
      render: (value, record, index) =>
        isPreview ? (
          value
        ) : (
          <Select
            style={{ width: '100%' }}
            defaultValue={value}
            showSearch={true}
            allowClear={true}
            options={getOptions}
            filterOption={(inputValue, option): any =>
              option?.label.includes(inputValue)
            }
            onChange={(value, option: any) => {
              // 错误改动
              if (value && errorList.includes(record.key!)) {
                setErrorList(errorList.filter((i) => i !== record.key));
              }
              // 赋值
              if (value) {
                const { ruleType, rulePriority, ruleName } = option;
                setRuleRelaList((prev) => {
                  const list = [...prev];
                  list.splice(index, 1, {
                    key: record.key,
                    relaRuleType: record.relaRuleType,
                    ruleId: value,
                    ruleName,
                    ruleType,
                    rulePriority,
                  });
                  return list;
                });
              } else {
                setRuleRelaList((prev) => {
                  const list = [...prev];
                  list.splice(index, 1, {
                    key: record.key,
                    relaRuleType: record.relaRuleType,
                    ruleId: null,
                    ruleName: null,
                    ruleType: null,
                    rulePriority: null,
                  });
                  return list;
                });
              }
            }}
            status={errorList.includes(record.key!) ? 'error' : undefined}
          />
        ),
    },
    {
      title: '规则类型',
      dataIndex: 'ruleType',
      width: '20%',
      render: (value) => {
        return transformDictCodeToNameHelper(value, RULE_TYPE_LEVEL_2) || '--';
      },
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      width: '20%',
      render: (value) => value || '--',
    },
    {
      title: '优先级',
      dataIndex: 'rulePriority',
      width: '20%',
      render: (value) => value || '--',
    },
  ];

  useEffect(() => {
    if (defaultValues) {
      setRuleRelaList(
        defaultValues.map((i) => ({
          key: buildShortUUID(),
          ruleId: i.relaRuleId,
          ruleName: i.relaRuleName,
          rulePriority: i.relaRulePriority,
          ruleType: i.relaRuleType,
          relaRuleType: String(i.ruleRelaType),
        }))
      );
    }
  }, []);

  // 添加
  const onAdd = () => {
    setRuleRelaList((prev) => [
      ...prev,
      {
        key: buildShortUUID(),
        relaRuleType: RULE_RELATION_TYPES[0].code,
        ruleId: null,
        ruleRelaType: null,
        rulePriority: null,
        ruleName: null,
        ruleType: null,
      },
    ]);
  };

  // 选中
  const onSelectChange = (keys: React.Key[]) => setSelectKeys(keys);

  // 删除
  const onDelete = (selected: React.Key[]) => {
    if (selectKeys.length === 0) {
      message.warning('请选择至少一项规则');
    }
    setRuleRelaList((prev) =>
      [...prev].filter((i) => !selected.includes(i.key!))
    );
    setSelectKeys([]);
  };

  // 校验
  const validate = useCallback(async () => {
    const emptyList = [];
    for (const item of ruleRelaList) {
      if (!item.ruleId) {
        emptyList.push(item.key!);
      }
    }
    setErrorList(emptyList);
    if (emptyList.length === 0) {
      return ruleRelaList.map((i) => ({
        ruleRelaType: parseInt(i.relaRuleType!, 10),
        relaRuleId: i.ruleId!,
      }));
    } else {
      message.error('请选择规则');
      throw Error('请选择规则');
    }
  }, [ruleRelaList]);

  const [activeKey, setActiveKey] = useState<string | string[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      getFormValueAsync: validate,
    }),
    [validate]
  );

  const [activeKeys, setActiveKeys] = useState(['1']);

  return (
    <Collapse
      activeKey={activeKeys}
      bordered={false}
      expandIcon={({ isActive }) => (
        <RightOutlined
          rotate={isActive ? 90 : 0}
          style={{ color: '#444444', fontSize: '16px', cursor: 'pointer' }}
          onClick={() => setActiveKeys(activeKeys.length === 0 ? ['1'] : [])}
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
              onClick={() =>
                setActiveKeys(activeKeys.length === 0 ? ['1'] : [])
              }
            >
              关联列表
            </div>
          ),
          children: (
            <>
              {isPreview ? null : (
                <div style={{ padding: '8px 0 0' }}>
                  <Button
                    style={{ fontSize: '14px', marginRight: '16px' }}
                    type={'primary'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd();
                      if (activeKey.length === 0) {
                        setActiveKey(['1']);
                      }
                    }}
                  >
                    <PlusOutlined />
                    新增
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(selectKeys);
                    }}
                    style={{ fontSize: '14px' }}
                    type={'primary'}
                  >
                    <DeleteOutlined />
                    删除
                  </Button>
                </div>
              )}
              <Table
                style={{ marginTop: '12px' }}
                rowSelection={
                  isPreview
                    ? undefined
                    : {
                        type: 'checkbox',
                        selectedRowKeys: selectKeys,
                        onChange: onSelectChange,
                      }
                }
                size="small"
                columns={columns}
                pagination={false}
                dataSource={ruleRelaList}
              />
            </>
          ),
        },
      ]}
    />
  );
};

export default forwardRef(RuleRelaion);
