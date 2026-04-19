import { message, TreeSelect, TreeSelectProps } from '@ht/sprite-ui';
import React, { useEffect, useState } from 'react';
import { DynamicDimCondition } from '../const';
import { queryDynDimCondition } from '@/services/dynamicDimension/index';

interface IProps {
  onChange: (
    option: DynamicDimCondition & { title: string; value: string }
  ) => void;
  value: string;
}

const ConditionSelect: React.FC<IProps> = ({ onChange, value }) => {
  const [loading, setLoding] = useState(false);
  const [treeData, setTreeData] = useState<TreeSelectProps['treeData']>([]);

  async function fetch() {
    try {
      setLoding(true);
      const res = await queryDynDimCondition({ pageId: 1, pageSize: 5000 });
      if (res.code !== 0) {
        throw new Error('查询动态维度条件失败');
      }
      if (res.data && res.data.resultList) {
        const parseData: TreeSelectProps['treeData'] = [];
        for (const item of res.data.resultList) {
          const group = parseData.find((i) => i.value === item.conditionType);
          if (group) {
            group.children!.push({
              key: item.conditionCode,
              title: item.conditionName,
              label: item.conditionName,
              value: item.conditionCode,
              ...item,
            });
          } else {
            parseData.push({
              key: item.conditionType,
              title: item.conditionTypeName,
              label: item.conditionTypeName,
              value: item.conditionType,
              selectable: false,
              children: [
                {
                  key: item.conditionCode,
                  title: item.conditionName,
                  label: item.conditionName,
                  value: item.conditionCode,
                  ...item,
                },
              ],
            });
          }
        }
        setTreeData(parseData);
      }
    } catch (error) {
      console.error(error);
      // message.error((error as any).message);
    } finally {
      setLoding(false);
    }
  }

  useEffect(() => {
    fetch();
  }, []);

  return (
    <TreeSelect
      style={{ width: '100%' }}
      loading={loading}
      treeData={treeData}
      treeDefaultExpandAll={true}
      value={value}
      onSelect={(_, node) =>
        onChange(node as DynamicDimCondition & { title: string; value: string })
      }
    />
  );
};

export default ConditionSelect;
