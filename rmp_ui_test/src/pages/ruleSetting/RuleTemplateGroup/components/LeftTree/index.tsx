import React, { useEffect, useMemo, useState } from 'react';
import styles from './styles.less';
import { Checkbox, Empty, Input, Tree, TreeDataNode } from 'antd';
import {
  MinusSquareOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { transformTree, treeFilter } from './utils';
import { Mode } from '../../type';
import { getAllNodesBFS } from '../../TemplateGroupEdit/util';
import { IRuleConfigurationItem } from '@/pages/ruleSetting/type';
import { isEqual, sortBy } from 'lodash';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';

interface TemplateNode {
  Id: string;
  Name: string;
  SubList?: TemplateNode[];
}

interface IProps {
  template: TemplateNode[];
  onSelect: (ruleType: string) => void;
  onCheck?: (checked: string[]) => void;
  mode: Mode;
  filterRuleTypes?: string[];
  defaultRuleTypes?: string[];
  selectedKey: React.Key;
}

const LeftTree: React.FC<IProps> = ({
  template,
  onSelect,
  onCheck,
  mode,
  filterRuleTypes,
  defaultRuleTypes = [],
  selectedKey,
}) => {
  const [searchKey, setSearchKey] = useState<string>();

  const [checked, setChecked] = useState<string[]>(defaultRuleTypes);

  const getTreeData = useMemo<TreeDataNode[]>(() => {
    const result: TemplateNode[] = treeFilter(
      template,
      (node) => {
        if (filterRuleTypes) {
          return (
            filterRuleTypes.includes(node.Id) &&
            node.Name.includes(searchKey || '')
          );
        }
        return node.Name.includes(searchKey || '');
      },
      'SubList'
    );
    return transformTree<TemplateNode, TreeDataNode>(
      result,
      (node) => ({
        key: node.Id,
        title: node.Name,
        selectable: !node.SubList,
        checkable: true,
        disableCheckbox: mode === Mode.VIEW,
      }),
      'SubList'
    );
  }, [searchKey, template]);

  useEffect(() => {
    if (mode === Mode.VIEW) {
      const ruleTypes = getAllNodesBFS<TreeDataNode, 'children'>(
        getTreeData,
        'children'
      );
      setChecked(ruleTypes.map((i) => i.key as string));
    }
  }, [mode, getTreeData]);

  useEffect(() => {
    onCheck && onCheck(checked);
  }, [checked]);

  const checkedAll = useMemo(() => {
    const ruleTypes = getAllNodesBFS<IRuleConfigurationItem, 'SubList'>(
      template,
      'SubList'
    );
    return isEqual(sortBy(ruleTypes.map((i) => i.Id)), sortBy(checked));
  }, [checked]);

  const checkAll = (val: boolean) => {
    if (val) {
      const ruleTypes = getAllNodesBFS<IRuleConfigurationItem, 'SubList'>(
        template,
        'SubList'
      );
      setChecked(ruleTypes.map((i) => i.Id));
    } else {
      setChecked([]);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.search}>
        <Input
          placeholder="请输入目录名称"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          suffix={<SearchOutlined />}
          allowClear={true}
        />
      </div>
      <div className={styles.treeBlock}>
        <Tree
          treeData={getTreeData}
          checkable={true}
          defaultExpandAll={true}
          checkedKeys={checked}
          selectedKeys={selectedKey ? [selectedKey] : []}
          onSelect={(selected: React.Key[]) => {
            if (selected.length === 1) {
              onSelect(selected[0] as string);
            }
          }}
          onCheck={(val) => setChecked(val as string[])}
          switcherIcon={(props) => {
            if (props.expanded) {
              return (
                <MinusSquareOutlined
                  style={{ fontSize: 16, marginTop: '8px', color: '#DDDEE0' }}
                />
              );
            } else {
              return (
                <PlusSquareOutlined
                  style={{ fontSize: 16, marginTop: '8px', color: '#DDDEE0' }}
                />
              );
            }
          }}
        />
        {getTreeData.length === 0 && (
          <div style={{ marginTop: 100 }}>
            <Empty image={NoDataSimpleSvg} description={'暂无数据'} />
          </div>
        )}
      </div>
      {mode !== Mode.VIEW ? (
        <div className={styles.selectAll}>
          <Checkbox
            checked={checkedAll}
            onChange={(e) => checkAll(e.target.checked)}
          >
            全选
          </Checkbox>
        </div>
      ) : null}
    </div>
  );
};

export default LeftTree;
