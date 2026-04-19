import React, { CSSProperties, useEffect, useState, type FC } from 'react';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import MultipleSelect from '@/components/MultipleSelectRebuild';
import { queryDynamicDimension } from '@/services/dynamicDimension/index';

interface Props {
  mode: keyof typeof FORM_MODES;
  value?: number[];
  onChange?: (value: number[]) => void;
  style?: CSSProperties;
}

type IndexOption = {
  label: string;
  value: number;
};

const DynamicDimensionSelect: FC<Props> = ({
  value,
  onChange,
  mode,
  style = {},
}) => {
  const [options, setOptions] = useState<IndexOption[]>([]);

  useEffect(() => {
    async function fetchIndexList() {
      try {
        const { data, code } = await queryDynamicDimension({
          pageId: 1,
          pageSize: 1000,
          authorityFlag: mode === 'PREVIEW' ? 0 : 1,
        });
        if (code !== 0) {
          throw new Error('动态维度列表获取失败');
        }
        const compOptions = (data?.resultList || []).map((li) => {
          return {
            label: `${li.dyndimId} ${li.dyndimName}`,
            value: li.dyndimId,
          };
        });
        setOptions(compOptions);
      } catch (e) {
        console.error(e);
      }
    }
    fetchIndexList();
  }, []);

  return (
    <MultipleSelect
      options={options}
      value={value}
      onChange={(values: number[]) => onChange && onChange(values)}
      style={style}
    />
  );
};

export default DynamicDimensionSelect;
