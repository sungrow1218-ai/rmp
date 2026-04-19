// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import {
  ActionItem,
  BasicTable,
  TableAction,
  TableActionType,
} from '@/components/Table';
import { Button, Form, message, ConfigProvider, Empty } from '@ht/sprite-ui';
import React, { useEffect, useRef, useState } from 'react';
import { Condition, conditionColumns, EditableCell } from '../data';
import { PlusOutlined } from '@ht-icons/sprite-ui-react';
import { buildShortUUID } from '@/utils/uuid';
import {
  AlterType,
  CompareType,
  DynamicDimCondition,
  OperatorOptions,
  ValueType,
} from '../const';
import { getTreeDataOptions } from '@/components/SecurityTypeSelectRebuild';
import { queryConditionItem } from '@/services/dynamicDimension/index';

type Props = {
  defaultConditions: DynamicDimCondition[];
  onChange: (conditions: Condition[]) => void;
  onResetExpression: () => void;
  mode: AlterType;
};

const ConditionTable = ({
  defaultConditions,
  onChange,
  onResetExpression,
  mode,
}: Props) => {
  // 条件信息
  const [formMethods] = Form.useForm();

  // 表格-条件
  const tableRef = useRef<TableActionType>(null);

  // 当前编辑的key
  const [editingKey, setEditingKey] = useState<string>();

  // 缓存规则
  const [cacheCondition, setCacheCondition] =
    useState<Partial<Condition> | null>(null);

  // 规则列表
  const [conditions, setConditions] = useState<Partial<Condition>[]>([]);

  // 缓存选项
  const [cacheOption, setCacheOption] = useState<DynamicDimCondition | null>(
    null
  );

  // 是否编辑中
  const isEditing = (record: Recordable) => record.key === editingKey;

  // 扩展条件列
  const mergedColumns = conditionColumns.map((col) => {
    if (!col._editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Condition) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // 编辑
  const edit = (record: Partial<Condition>) => {
    setCacheCondition({ ...record } as Condition);
    const { code, operator, value, unit, unitType, key } = record;
    const formInitValue =
      unitType && unitType === 'null'
        ? { code, operator, value }
        : { code, operator, value, unit };
    formMethods.setFieldsValue(formInitValue);
    setEditingKey(key);
  };

  // 取消
  const cancel = () => {
    // 还原缓存
    if (cacheCondition) {
      const index = conditions.findIndex((i) => i.key === cacheCondition.key);
      const list = [...conditions];
      list.splice(index, 1, cacheCondition);
      setConditions(list);
      setCacheCondition(null);
      setCacheCondition(null);
    }
    formMethods.resetFields();
    setEditingKey('');
  };

  // 保存
  const save = async (key: any) => {
    try {
      const row = (await formMethods.validateFields()) as Condition;
      const newData = [...conditions];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setConditions(newData);
        onChange(newData as Condition[]);
        setEditingKey('');
        setCacheOption(null);
        setCacheCondition(null);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
      // message.error('请完整填写');
    }
  };

  // 操作列
  const createActions = (record: Condition): ActionItem[] => {
    return [
      {
        label: '编辑',
        ifShow: record.key !== editingKey,
        disabled: !!editingKey,
        onClick: () => edit(record),
      },
      {
        label: '删除',
        ifShow: record.key !== editingKey,
        onClick: () => {
          const list = conditions.filter((i) => i.key !== record.key);
          setConditions(list);
          onChange(list as Condition[]);
          onResetExpression();
        },
      },
      {
        label: '保存',
        ifShow: record.key === editingKey,
        onClick: () => save(record.key),
      },
      {
        label: '取消',
        ifShow: record.key === editingKey,
        onClick: () => cancel(),
      },
    ];
  };

  // 获取条件模板
  const getConditionTpl = (key?: string): Partial<Condition> => ({
    key: key || buildShortUUID(),
    codeType: 'custom',
    codeTypeComp: 'ConditionSelect',
    codeProps: {
      onChange: (
        option: DynamicDimCondition & { label: string; value: string }
      ) => {
        setCacheOption({ ...option, conditionName: option.label });
      },
    },
  });

  // 解析条件
  const parseCondition = async (
    prev: Partial<Condition>,
    condition: DynamicDimCondition
  ): Promise<Condition> => {
    const { key, codeType, codeProps, codeTypeComp } = prev;
    const newData: Partial<Condition> = {
      key,
      name: condition.conditionName,
      code: condition.conditionCode,
      codeType,
      codeTypeComp,
      codeProps,
    };
    // 运算符
    newData.operator = condition.conditionOperation || null;
    newData.operatorType = 'select';
    newData.operatorProps = {
      options: OperatorOptions[condition.conditionOperationType as CompareType],
    };
    // 证券类型-特殊处理
    if (condition.conditionCode === 'SECURITY_TYPE') {
      newData.value = condition.conditionValue || [];
      newData.valueType = 'custom';
      newData.valueTypeComp = 'SECURITY_TYPE';
      newData.valueProps = {
        options: getTreeDataOptions(),
      };
      newData.unit = null;
      newData.unitType = 'null';
      newData.unitProps = {};
    } else {
      // operationType === 1 数值
      if (
        condition.conditionValueType === ValueType.INPUT &&
        condition.conditionOperationType === 1
      ) {
        newData.value = condition.conditionValue
          ? condition.conditionValue[0]
          : 0;
        newData.valueType = 'number';
        newData.valueProps = {};
        newData.unit = condition.conditionValueUnit;
        newData.unitType = 'null';
        newData.unitProps = {};
      }
      // operationType !== 1 文本
      if (
        condition.conditionValueType === ValueType.INPUT &&
        condition.conditionOperationType !== 1
      ) {
        newData.value = condition.conditionValue
          ? condition.conditionValue[0]
          : null;
        newData.valueType = 'text';
        newData.valueProps = {};
        newData.unit = null;
        newData.unitType = 'null';
        newData.unitProps = {};
      }
      if (condition.conditionValueType === ValueType.INTERFACE) {
        const isMultiple = true;
        let options: { label: string; value: string }[] = [];
        try {
          tableRef.current?.setLoading(true);
          const {
            data: { resultList = [] },
          } = await queryConditionItem({
            pageId: 1,
            pageSize: 5000,
            filterCondition: {
              conditionCode: condition.conditionCode,
            },
          });
          options = resultList.map(
            (i: { itemName: string; itemValue: any }) => ({
              label: i.itemName,
              value: i.itemValue,
            })
          );
        } catch (error) {
          console.error(error);
          // message.error('查询动态维度条件可选项失败，请稍后重试');
        } finally {
          tableRef.current?.setLoading(false);
        }
        newData.value = isMultiple
          ? condition.conditionValue || []
          : condition.conditionValue || null;
        newData.valueType = 'select';
        newData.valueProps = {
          options,
          mode: isMultiple ? 'multiple' : undefined,
        };
        newData.unit = null;
        newData.unitType = 'null';
        newData.unitProps = {};
      }
    }
    return newData as Condition;
  };

  // 添加条件
  const addCondition = () => {
    const newRow = getConditionTpl();
    setConditions((prev) => [...prev, newRow]);
    edit(newRow);
  };

  useEffect(() => {
    const handleChange = async () => {
      if (cacheCondition && cacheOption) {
        const newRow = await parseCondition(cacheCondition, cacheOption);
        const index = conditions.findIndex((i) => i.key === newRow.key);
        if (index > -1) {
          const { operator, value, unit } = newRow;
          formMethods.setFieldsValue({ operator, value, unit });
          setConditions((prev) => {
            const list = [...prev];
            list.splice(index, 1, newRow);
            return list;
          });
        }
      }
    };
    handleChange();
  }, [cacheOption]);

  useEffect(() => {
    const handleChange = async () => {
      const initConditions = [];
      // 正序排列
      const defaultList = [...defaultConditions].sort(
        (a, b) => a.conditionOrderId - b.conditionOrderId
      );
      for (const item of defaultList) {
        const result = await parseCondition(getConditionTpl(), item);
        initConditions.push(result);
      }
      setConditions(initConditions);
      onChange(initConditions);
    };
    handleChange();
  }, [defaultConditions]);

  return (
    <>
      <Form form={formMethods} component={false} preserve={false}>
        <BasicTable
          ref={tableRef}
          columns={mergedColumns as any}
          pagination={false}
          dataSource={conditions}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowKey={'key'}
          actionColumn={{
            title: '操作',
            width: 150,
            ifShow: mode === AlterType.ADD || mode === AlterType.EDIT,
            dataIndex: 'action',
            render: (value, record, index) => {
              return (
                <TableAction actions={createActions(record as Condition)} />
              );
            },
          }}
        />
      </Form>
      {editingKey || mode === AlterType.VIEW ? null : (
        <Button
          style={{ marginTop: '16px' }}
          type="dashed"
          block={true}
          onClick={addCondition}
        >
          <PlusOutlined />
          添加条件
        </Button>
      )}
    </>
  );
};

export default ConditionTable;
