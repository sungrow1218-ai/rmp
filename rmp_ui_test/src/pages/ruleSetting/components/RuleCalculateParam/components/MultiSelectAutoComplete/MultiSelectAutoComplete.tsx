import React, { useState, useEffect, FC, useRef, CSSProperties } from 'react';
import { Checkbox, Row, Col, Input, Popover } from 'antd';
import { ENTRUST_DIRECTION_TYPES } from '@/utils/dict';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { RolePermissonProps } from '@/pages/roleManage/contant/typing';
import { cloneDeep, isEmpty, isEqual } from 'lodash';

const { TextArea } = Input;
const aMap = new Map<string, string>();

const options = ENTRUST_DIRECTION_TYPES.map((i) => {
  aMap.set(i.code, i.name);
  return {
    label: i.name,
    value: i.code,
  };
});
interface Props {
  values?: Recordable;
  onChange?: (value: RolePermissonProps) => void;
  disabled?: boolean;
  style?: CSSProperties;
}
const MultiSelectAutoComplete: FC<Props> = ({
  values,
  onChange,
  disabled,
  style = {},
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedA, setSelectedA] = useState<CheckboxValueType[]>([]);
  const [selectedB, setSelectedB] = useState<CheckboxValueType[]>([]);
  const [inputOption, setInputOption] = useState<RolePermissonProps>({});

  const valuesCacheRef = useRef<Recordable>();

  useEffect(() => {
    const aPart = [...selectedA].map((p) => aMap.get(String(p))).join('+');
    const bPart = [...selectedB].map((p) => aMap.get(String(p))).join('-');
    setInputValue([aPart, bPart].filter(Boolean).join('-'));
    setInputOption({
      '102': selectedA,
      '103': selectedB,
    });
    onChange &&
      onChange({
        '102': selectedA,
        '103': selectedB,
      });
  }, [selectedA, selectedB]);

  useEffect(() => {
    if (
      values &&
      !isEmpty(values) &&
      !isEqual(values, valuesCacheRef.current)
    ) {
      valuesCacheRef.current = cloneDeep(values);
      if (102 in values) {
        const aList =
          typeof values[102] === 'string' ? [values[102]] : values[102];
        setSelectedA(aList);
      }
      if (103 in values) {
        const bList =
          typeof values[103] === 'string' ? [values[103]] : values[103];
        setSelectedB(bList);
      }
    }
  }, [values]);

  const dropdownContent = (
    <div style={{ padding: '16px 0 16px 8px', width: '923px' }}>
      <Row gutter={24}>
        <Col
          span={12}
          style={{
            border: '1px solid #d9d9d9',
            padding: 0,
            marginRight: '15px',
          }}
        >
          <div
            style={{
              width: '88px',
              background: '#fff',
              position: 'absolute',
              top: '-12px',
              left: '20px',
            }}
          >
            委托增加方向
          </div>
          <Checkbox.Group
            key="selectedA"
            options={options}
            value={selectedA}
            onChange={(checkedValues) => {
              setSelectedA(checkedValues);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10px 0 0 10px',
            }}
          />
        </Col>
        <Col span={11} style={{ border: '1px solid #d9d9d9', padding: 0 }}>
          <div
            style={{
              width: '88px',
              background: '#fff',
              position: 'absolute',
              top: '-12px',
              left: '20px',
            }}
          >
            委托减少方向
          </div>
          <Checkbox.Group
            key="selectedB"
            options={options}
            value={selectedB}
            onChange={(val) => {
              setSelectedB(val);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10px',
            }}
          />
        </Col>
      </Row>
    </div>
  );

  return (
    <Popover content={dropdownContent} placement="bottom" trigger="click">
      <TextArea
        rows={4}
        value={inputValue}
        data-option={inputOption}
        readOnly={true}
        style={{
          userSelect: 'none',
          cursor: 'pointer',
          resize: 'none',
          ...style,
        }}
        disabled={disabled}
      />
    </Popover>
  );
};

export default MultiSelectAutoComplete;
