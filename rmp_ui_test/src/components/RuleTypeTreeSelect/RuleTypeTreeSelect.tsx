import {
  ConfigProvider,
  Empty,
  Popover,
  Select,
  SelectProps,
  Tree,
  TreeDataNode,
  TreeProps,
  TreeSelect,
  TreeSelectProps,
} from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import styles from './styles.less';
import { CloseOutlined } from '@ant-design/icons';
import { tranFromDataToOption } from '@/utils/utils';
import { RULE_TYPE_LEVEL_2 } from '@/utils/dict';
import { RuleTypeTreeDataValue } from './constant';
import { EventDataNode } from 'antd/es/tree';

const getOptions = tranFromDataToOption(RULE_TYPE_LEVEL_2, 'name', 'code');
interface Props {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const RuleTypeTreeSelect: React.FC<Props> = ({ value, onChange }) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const disabled = useContext(DisabledContext);

  const handleCheck: TreeSelectProps['onChange'] = (keys, e, node) => {
    setCheckedKeys(keys);
    const values = keys.map((p: string) => p.split('|')[1]);
    onChange && onChange(values);
  };

  const renderPopoverContent = () => {
    const selectOptons =
      getOptions.filter((p) => (value || []).some((q) => q === p.value)) ?? [];
    return (
      <div className={styles.previewContent}>
        {selectOptons.map((i, index: number) => (
          <div className={styles.item} key={i.value}>
            <div className={styles.text}>{i.label as string}</div>
            {!disabled && (
              <CloseOutlined
                onClick={() => {
                  const list = selectOptons.filter((o) => o.value !== i.value);
                  onChange && onChange(list.map((o) => o.value as string));
                  const list1 = checkedKeys.filter(
                    (p) => p !== `${i.label}|${i.value}`
                  );
                  setCheckedKeys(list1);
                }}
                style={{
                  marginLeft: '4px',
                  fontSize: '10px',
                  cursor: 'pointer',
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (!value || (value && value.length === 0)) {
      setOpen(false);
    }
  }, [value]);
  return (
    <>
      <ConfigProvider getPopupContainer={() => document.body}>
        <Popover
          content={renderPopoverContent}
          placement="topRight"
          open={open}
          onOpenChange={(state) => {
            if (value && value.length > 0) {
              setOpen(state);
            } else {
              setOpen(false);
            }
          }}
        >
          <TreeSelect
            showSearch={true}
            style={{ width: '100%' }}
            value={checkedKeys}
            autoClearSearchValue={false}
            styles={{
              popup: {
                root: { maxHeight: 400, overflow: 'auto' },
              },
            }}
            maxTagCount={'responsive'}
            placeholder="请选择"
            allowClear={true}
            multiple={true}
            treeCheckable={true}
            showCheckedStrategy={'SHOW_CHILD'}
            treeDefaultExpandAll={true}
            onChange={handleCheck}
            treeData={RuleTypeTreeDataValue}
          />
        </Popover>
      </ConfigProvider>
    </>
  );
};

export default RuleTypeTreeSelect;
