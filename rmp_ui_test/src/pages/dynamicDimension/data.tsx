import { BasicColumn } from '@/components/Table';
import { Form, Input, InputNumber, Select } from '@ht/sprite-ui';
import React from 'react';
import { Operator, OperatorView, UnitType, UnitView } from './const';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import SecurityTypeSelect, {
  getViewData,
} from '@/components/SecurityTypeSelectRebuild';
import ConditionSelect from './components/ConditionSelect';
import MultipleSelect from '@/components/MultipleSelectRebuild';

type EditType = 'text' | 'number' | 'select' | 'custom' | 'null';

export interface Condition {
  key: string;
  name: string | null;
  code: string | null;
  codeType: EditType;
  codeTypeComp?: string;
  codeProps: Recordable;
  operator: Operator | null;
  operatorType: EditType;
  operatorTypeComp?: string;
  operatorProps: Recordable;
  value: string | string[] | number | number[] | null;
  valueType: EditType;
  valueTypeComp?: string;
  valueProps: Recordable;
  unit: number | null;
  unitType: EditType;
  unitTypeComp?: string;
  unitProps: Recordable;
}

// 条件列
export const conditionColumns: (BasicColumn & { _editable: boolean })[] = [
  {
    dataIndex: 'index',
    title: '序号',
    _editable: false,
    width: 70,
    render: (value, record, index) => index,
  },
  {
    dataIndex: 'code',
    title: '条件名称',
    _editable: true,
    align: 'left',
    render: (value, record) => record.name || '--',
  },
  {
    dataIndex: 'operator',
    title: '运算符',
    _editable: true,
    align: 'left',
    render: (value) => OperatorView[value as Operator] || '--',
  },
  {
    dataIndex: 'value',
    title: '数值',
    _editable: true,
    width: 400,
    align: 'left',
    render: (value, record: Partial<Condition>) => {
      if (record.valueType === 'custom' && record.valueTypeComp) {
        // 证券类别-特殊处理
        if (record.valueTypeComp === 'SECURITY_TYPE') {
          const selected = getViewData(value);
          return selected.map((i) => i.label).join(',') || '--';
        }
        return value ?? '--';
      }
      if (record.valueType === 'select' && value) {
        const views = [];
        const options = record.valueProps?.options || [];
        for (const option of options) {
          if (value.includes(option.value)) {
            views.push(option.label);
            if (views.length === value.length) {
              break;
            }
          }
        }
        return views.join(',') || '--';
      } else if (Array.isArray(value)) {
        return value.join(',') || '--';
      } else {
        return value ?? '--';
      }
    },
  },
  {
    dataIndex: 'unit',
    title: '单位',
    width: 80,
    _editable: true,
    align: 'left',
    render: (value) => UnitView[value as UnitType] || '--',
  },
];

// 标的列
export const symbolColumns: BasicColumn[] = [
  { dataIndex: 'securityCode', title: '证券代码', align: 'left' },
  { dataIndex: 'securityName', title: '证券名称', align: 'left' },
  {
    dataIndex: 'marketId',
    title: '交易所',
    align: 'left',
    render: (value) =>
      transformDictCodeToNameHelper(value.toString(), TRADING_MARKETS),
  },
];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  placeholder: string;
  record: { [key: string]: any };
  index: number;
  children: React.ReactNode;
}

// 渲染组件
const renderComp = (
  type: EditType,
  props: Recordable = {},
  typeComp?: string
) => {
  if (type === 'number') {
    return (
      <InputNumber
        min={0}
        max={99999999}
        style={{ width: '100%' }}
        {...props}
      />
    );
  }
  if (type === 'text') {
    return <Input {...props} />;
  }
  if (type === 'select') {
    if (props.mode === 'multiple') {
      return <MultipleSelect {...props} />;
    } else {
      return <Select {...props} />;
    }
  }
  if (type === 'custom') {
    switch (typeComp) {
      case 'SECURITY_TYPE':
        return <SecurityTypeSelect {...props} />;
      case 'ConditionSelect':
        return <ConditionSelect {...(props as any)} />;
      default:
        return null;
    }
  }
  return null;
};

// 编辑单元格
export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing &&
      record[`${dataIndex}Type`] &&
      record[`${dataIndex}Type`] !== 'null' ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `` }]}
        >
          {renderComp(
            record[`${dataIndex}Type`],
            record[`${dataIndex}Props`],
            record[`${dataIndex}TypeComp`]
          )}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
