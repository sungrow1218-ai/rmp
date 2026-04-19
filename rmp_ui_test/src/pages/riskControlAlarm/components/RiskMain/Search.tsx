// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  RadioChangeEvent,
  type FormInstance,
  Select,
} from 'antd';
import {
  RULE_TYPE_LEVEL_2,
  ALARM_REACTIONS,
  TRADING_MARKETS,
  GRAY_FLAG,
} from '@/utils/dict';
import styles from '../../style.less';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import { tranFromDataToOption } from '@/utils/utils';
import { useWorkGroup } from '@/hooks/useWorkGroup';
import { queryExternSystem } from '@/services/account';
import moment from 'moment';
import { PaginationType } from '@/services/typing';
import { WaringType } from './RiskMain';
import { ENTRUST_DIRECTION } from '@/utils/dictEntrust';
import RuleTypeTreeSelect from '@/components/RuleTypeTreeSelect/RuleTypeTreeSelect';
import { WorkGroupList } from '@/services/rule';
import {
  queryRuleSetting,
  queryRuleTemplateGroup,
} from '@/services/ruleSetting';
import { RiskLevel } from '@/pages/ruleSetting/RuleTemplateGroup/type';

const transformDictFilter = (
  dict: readonly { code: string; name: string }[]
) => {
  return dict
    .map((item) => {
      return { value: item.code, label: `${item.code}-${item.name}` };
    })
    .filter((it) => !it.label.includes('不区分'));
};
const transformDictAll = (dict: readonly { code: string; name: string }[]) => {
  return dict
    .map((item) => {
      return { value: item.code, label: `${item.name}` };
    })
    .filter((it) => !it.label.includes('不区分'));
};

const getLabelSpan = (title: string) => {
  return <span style={{ width: '60px' }}>{title}</span>;
};

const ruleTypeAll: string[] = RULE_TYPE_LEVEL_2.map((p) => p.code);

type Option = { label: string; value: any }[];

const disabledDate = (current: any) => {
  return current && current.isAfter(moment(), 'day');
};
const SearchForm = ({
  form,
  onFinish,
  pagination,
  loading,
  setWatchType,
  setButtonCheck,
}: {
  form: FormInstance;
  onFinish: (page: number, pageSize: number) => void;
  pagination: PaginationType;
  loading?: boolean;
  setWatchType: React.Dispatch<React.SetStateAction<WaringType>>;
  setButtonCheck: React.Dispatch<React.SetStateAction<'0' | RiskLevel>>;
}) => {
  const [ruleIdOptions, setRuleIdOptions] = useState<Option>([]);
  const [load, setLoad] = useState<boolean>(false);
  const dataDisable = Form.useWatch('warnType', form);
  const resetForm = useCallback(() => {
    form.resetFields([
      'workGroupId',
      'ruleId',
      'ruleType',
      'extSysId',
      'marketId',
      'warnOperation',
      'securityCode',
      'entrustCode',
      'acctCode',
      'grayFlag',
      'historyDate',
      'entrustDirection',
      'ruleTmplGroupId',
      'ruleSource',
    ]);
    setSearchValue('');
    isCustomValue.current = false;
  }, [form]);

  useEffect(() => {
    if (dataDisable) {
      if (dataDisable === 'todayWarn') {
        setWatchType('today');
      } else {
        setWatchType('history');
      }
      form.setFieldValue('historyDate', null);
    }
  }, [dataDisable, form]);

  const onValidata = (e: RadioChangeEvent) => {
    if (e.target?.value === 'todayWarn') {
      form.validateFields(['historyDate']);
    }
  };

  const handleInputChange = (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let filterValue = '';
    const inputValue = e.target.value;
    if (type === 'ruleId') {
      filterValue = inputValue.replace(/[^0-9]/g, '');
    } else {
      filterValue = inputValue.replace(/[^a-zA-Z0-9.-]/g, '');
    }

    e.target.value = filterValue;
    form.setFieldValue(type, filterValue);
  };
  const workGroupList = useWorkGroup();

  const watchRuleType = Form.useWatch('ruleType', form);
  const watchRuleSource = Form.useWatch('ruleSource', form);

  useEffect(() => {
    const fetchRuleId = async () => {
      if (watchRuleSource === undefined) {
        setRuleIdOptions([]);
        return;
      }

      let _workGroupList: any[] = [];
      if (!watchRuleType || (watchRuleType && watchRuleType.length === 0)) {
        _workGroupList = workGroupList.map((p) => {
          return {
            workGroupId: p.workGroupId,
            ruleType: ruleTypeAll,
          };
        });
      } else {
        _workGroupList = workGroupList.map((p) => {
          return {
            workGroupId: p.workGroupId,
            ruleType: watchRuleType,
          };
        });
      }
      try {
        setLoad(true);
        const res = await queryRuleSetting({
          pageId: 1,
          pageSize: 5000,
          filterCondition: {
            workGroupList: _workGroupList,
          },
        });
        if (res.code !== 0) {
          setRuleIdOptions([]);
          // message.error('请求规则编号失败');
          return;
        }
        if (res.data && res.data.resultList) {
          const list = res.data.resultList;
          const options = list.map((p) => {
            return {
              label: `${p.ruleBaseInfo.ruleId}`,
              value: `${p.ruleBaseInfo.ruleId}`,
            };
          });
          setRuleIdOptions(options);
        } else {
          setRuleIdOptions([]);
        }
      } catch (error) {
        setRuleIdOptions([]);
        // message.error('请求规则编号失败');
      } finally {
        setLoad(false);
      }
    };
    if (watchRuleSource !== 2) {
      fetchRuleId();
    }
  }, [watchRuleType, workGroupList, watchRuleSource]);

  useEffect(() => {
    const fetchRuleGroupId = async () => {
      try {
        setLoad(true);
        if (watchRuleSource === undefined) {
          setRuleIdOptions([]);
          return;
        }
        const res = await queryRuleTemplateGroup({
          pageId: 1,
          pageSize: 5000,
          authorityFlag: 0,
          filterCondition: workGroupList?.map((p) => {
            return {
              workGroupId: p.workGroupId,
            };
          }),
        });
        if (res.errorId !== 0) {
          setRuleIdOptions([]);
          // message.error('请求规则编号失败');
          return;
        }
        if (res.data && res.data.resultList) {
          const list = res.data.resultList;
          const options = list.map((p) => {
            return {
              label: `${p.ruleTmplGroupId}`,
              value: `${p.ruleTmplGroupId}`,
            };
          });
          setRuleIdOptions(options);
        } else {
          setRuleIdOptions([]);
        }
      } catch (error) {
        setRuleIdOptions([]);
        // message.error('请求规则编号失败');
      } finally {
        setLoad(false);
      }
    };
    if (watchRuleSource === 2) {
      fetchRuleGroupId();
    }
  }, [watchRuleSource, workGroupList]);

  const [searchValue, setSearchValue] = useState<string>('');
  const isCustomValue = useRef<boolean>(false);
  // 监听搜索输入
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    isCustomValue.current = false;
  }, []);

  // 处理Select值变化（适配Form）
  const handleSelectChange = useCallback(
    (value: string) => {
      const isPreset = ruleIdOptions.some((item) => item.value === value);
      if (isPreset) {
        isCustomValue.current = false;
        setSearchValue('');
      } else if (value === null && searchValue) {
        if (watchRuleSource === 2) {
          form.setFieldsValue({ ruleTmplGroupId: searchValue });
        } else {
          form.setFieldsValue({ ruleId: searchValue });
        }
        isCustomValue.current = true;
      }
    },
    [form, ruleIdOptions, searchValue, watchRuleSource]
  );

  const handleBlur = useCallback(() => {
    // 2. 无选中值 + 有输入内容 + 输入内容无匹配预设选项：更新为自定义值
    if (searchValue) {
      if (watchRuleSource === 2) {
        form.setFieldsValue({ ruleTmplGroupId: searchValue });
      } else {
        form.setFieldsValue({ ruleId: searchValue });
      }
      isCustomValue.current = true;
      setSearchValue('');
    }
  }, [form, searchValue, watchRuleSource]);

  useEffect(() => {
    form.setFieldsValue({ ruleTmplGroupId: '' });
    form.setFieldsValue({ ruleId: '' });
    setSearchValue('');
  }, [watchRuleSource]);

  return (
    <div className={styles.search}>
      <Form
        form={form}
        initialValues={{
          grayFlag: ['0'],
        }}
        name="search_riskControAlarm"
      >
        <div style={{ display: 'flex', width: '100%', gap: '15px' }}>
          <Form.Item
            style={{ flex: 1 }}
            name="workGroupId"
            label={getLabelSpan('工作台')}
          >
            <MultipleSelect
              placeholder="请选择工作台"
              options={tranFromDataToOption(
                workGroupList,
                'workGroupName',
                'workGroupId'
              )}
            />
          </Form.Item>

          {/* <Form.Item
            style={{ flex: 1 }}
            name="ruleType"
            label={getLabelSpan('规则类型')}
          >
            <MultipleSelect options={transformDictAll(RULE_TYPE_LEVEL_2)} />
          </Form.Item> */}

          <Form.Item
            style={{ flex: 1 }}
            name="ruleType"
            label={getLabelSpan('规则类型')}
          >
            <RuleTypeTreeSelect />
          </Form.Item>
          <Form.Item
            style={{ flex: 1 }}
            name="ruleSource"
            label={getLabelSpan('触警对象')}
          >
            <Select
              allowClear={true}
              options={[
                {
                  label: '单规则',
                  value: 1,
                },
                {
                  label: '规则模板',
                  value: 2,
                },
              ]}
            />
          </Form.Item>

          {watchRuleSource !== 2 && (
            <Form.Item
              style={{ flex: 1 }}
              name="ruleId"
              label={getLabelSpan('规则编号')}
              rules={[
                {
                  validator: (_, value) => {
                    if (!watchRuleSource && !!value) {
                      return Promise.reject('请先选择触警对象');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Select
                onSearch={handleSearch}
                onChange={handleSelectChange}
                loading={load}
                onBlur={handleBlur}
                style={{ width: '100%' }}
                showSearch={true}
                options={ruleIdOptions}
                allowClear={true}
              />
            </Form.Item>
          )}
          {watchRuleSource === 2 && (
            <Form.Item
              style={{ flex: 1 }}
              name="ruleTmplGroupId"
              label={getLabelSpan('模板编号')}
            >
              <Select
                onSearch={handleSearch}
                onChange={handleSelectChange}
                loading={load}
                onBlur={handleBlur}
                style={{ width: '100%' }}
                showSearch={true}
                options={ruleIdOptions}
                allowClear={true}
              />
            </Form.Item>
          )}

          <Form.Item
            label={getLabelSpan('对接系统')}
            style={{ flex: 1 }}
            name="extSysId"
          >
            <MultipleSelect
              api={queryExternSystem}
              params={{
                authFlag: 1,
                pageId: 1,
                pageSize: 1000,
              }}
              labelField="extSysName"
              valueField="extSysId"
              resultField="data.resultList"
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', width: '100%', gap: '15px' }}>
          <Form.Item
            style={{ flex: 1 }}
            name="marketId"
            label={getLabelSpan('交易市场')}
          >
            <MultipleSelect options={transformDictFilter(TRADING_MARKETS)} />
          </Form.Item>

          {dataDisable === 'historyWarn' && (
            <Form.Item
              name="warnOperation"
              style={{ flex: 1 }}
              label={getLabelSpan('触警操作')}
            >
              <MultipleSelect options={transformDictAll(ALARM_REACTIONS)} />
            </Form.Item>
          )}

          <Form.Item
            style={{ flex: 1 }}
            name="securityCode"
            label={getLabelSpan('证券代码')}
          >
            <Input autoComplete="off" />
          </Form.Item>

          <Form.Item
            name="entrustCode"
            style={{ flex: 1 }}
            label={getLabelSpan('委托编码')}
          >
            <Input autoComplete="off" />
          </Form.Item>

          <Form.Item
            name="acctCode"
            style={{ flex: 1 }}
            label={getLabelSpan('账户')}
          >
            <Input
              autoComplete="off"
              onChange={(e) => {
                handleInputChange('acctCode', e);
              }}
            />
          </Form.Item>

          {dataDisable !== 'historyWarn' && (
            <Form.Item
              style={{ flex: 1 }}
              name="entrustDirection"
              label={getLabelSpan('委托方向')}
            >
              <MultipleSelect
                placeholder="请选择委托方向"
                options={transformDictAll(ENTRUST_DIRECTION)}
              />
            </Form.Item>
          )}
        </div>
        <div style={{ display: 'flex', width: '100%', gap: '15px' }}>
          <Form.Item
            name="grayFlag"
            style={{ flex: 1 }}
            label={getLabelSpan('灰度标志')}
          >
            <MultipleSelect options={transformDictAll(GRAY_FLAG)} />
          </Form.Item>
          {dataDisable === 'historyWarn' && (
            <Form.Item
              style={{ flex: '1', marginBottom: 0 }}
              name="entrustDirection"
              label={getLabelSpan('委托方向')}
            >
              <MultipleSelect
                placeholder="请选择委托方向"
                options={transformDictAll(ENTRUST_DIRECTION)}
              />
            </Form.Item>
          )}
          <Form.Item
            name="historyDate"
            style={{ flex: '1', marginBottom: 0 }}
            label={getLabelSpan('触警日期')}
            rules={[
              {
                required: dataDisable === 'historyWarn',
                message: '请输入日期',
              },
              {
                validator: (_, timeData: any) => {
                  if (
                    timeData &&
                    timeData.length > 0 &&
                    dataDisable !== 'todayWarn'
                  ) {
                    const diffInDays = timeData[1].diff(timeData[0], 'day');
                    if (diffInDays + 1 > 92) {
                      return Promise.reject('请选择三个月之内的日期');
                    }
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              disabledDate={disabledDate}
              disabled={dataDisable === 'todayWarn'}
            />
          </Form.Item>
          <Form.Item
            name="warnType"
            initialValue="todayWarn"
            style={{ flex: '1', marginBottom: 0 }}
          >
            <Radio.Group onChange={onValidata}>
              <Radio value="todayWarn">当日触警</Radio>
              <Radio value="historyWarn">历史触警</Radio>
            </Radio.Group>
          </Form.Item>

          {dataDisable !== 'historyWarn' && <div style={{ flex: 1 }}></div>}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              gap: '10px',
              flex: 1,
            }}
          >
            <Button onClick={resetForm}>重置</Button>
            <Button
              type="primary"
              loading={loading}
              onClick={() => {
                setButtonCheck('0');
                onFinish(1, pagination.pageSize);
              }}
            >
              查询
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SearchForm;
