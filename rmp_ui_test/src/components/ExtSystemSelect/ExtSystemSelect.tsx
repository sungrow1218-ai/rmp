import MultipleSelect from '@/components/MultipleSelectRebuild';
import { ExtSysItem, queryExternSystem } from '@/services/account';
import { message, Select } from 'antd';
import React, { CSSProperties, useEffect, useState, type FC } from 'react';
import './styles.less';

interface Props {
  authFlag?: 0 | 1;
  mode?: 'single' | 'multiple';
  sobId?: number;
  value?: number[] | number;
  onChange?: (value: number[] | number) => void;
  updateExtSystems?: (value: ExtSysItem[]) => void;
  style?: CSSProperties;
}

interface ItemProps {
  label: string;
  value: number;
}

export function getSystemNameById(systemId: number, systemInfo?: ExtSysItem[]) {
  return (
    systemInfo?.find((item) => systemId === item.extSysId)?.extSysName ??
    '未知系统'
  );
}

const ExtSystemSelect: FC<Props> = ({
  authFlag,
  mode = 'multiple',
  sobId,
  value = [],
  onChange,
  updateExtSystems,
  style = {},
}) => {
  const [options, setOptions] = useState<ItemProps[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (!sobId) {
          setOptions([]);
          return;
        }
        const response = await queryExternSystem({
          pageId: 1,
          pageSize: 5000,
          authFlag,
          filterCondition: { sobId },
        });
        if (response.code !== 0) {
          // message.error(`查询对接系统失败 ${response.message}`);
          setOptions([]);
        }
        if (updateExtSystems) {
          updateExtSystems(response.data.resultList);
        }
        if (response.data && response.data.resultList) {
          setOptions(
            response.data.resultList.map((i) => ({
              label: i.extSysName,
              value: i.extSysId,
            }))
          );
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchOptions();
  }, [sobId]);

  if (mode === 'single') {
    <Select
      options={options}
      placeholder="请选择"
      onChange={(values: number) => onChange && onChange(values)}
      style={style}
    />;
  } else {
    return (
      <MultipleSelect
        value={value as number[]}
        onChange={(values: number[]) => onChange && onChange(values)}
        options={options}
        style={style}
      />
    );
  }
};

export default ExtSystemSelect;
