// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  CSSProperties,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
} from 'react';
import {
  Dropdown,
  Popover,
  Select,
  SelectProps,
  Tree,
  TreeProps,
  TreeDataNode,
  ConfigProvider,
} from 'antd';
import { SECURITY_CATEGORY_LEVEL } from '@/utils/dict';
import { difference, unionBy } from 'lodash';
import styles from './styles.less';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import { CloseOutlined } from '@ant-design/icons';

interface Props {
  value?: string[];
  onChange?: (value: string[]) => void;
  secuControl?: string[];
  style?: CSSProperties;
}

interface Node {
  name: string;
  code: string;
  children?: Node[];
}

// 转换函数 json=>treeNode
const transformFn = (
  node: Node,
  filter: string[] = [],
  parentNode?: TreeDataNode
) => {
  const treeNode: TreeDataNode = {
    key: node.code,
    title: `${node.code} ${node.name}`,
    checkable: false,
    isLeaf: false,
  };
  if (filter.length === 0 || (parentNode && parentNode.checkable)) {
    treeNode.checkable = true;
  } else {
    treeNode.checkable = filter.includes(node.code);
  }
  if (node.children) {
    treeNode.isLeaf = false;
    treeNode.children = node.children.map((i) =>
      transformFn(i, filter, treeNode)
    );
  } else {
    treeNode.isLeaf = true;
  }
  return treeNode;
};

// 过滤treeNode
const filterTreeNode = (node: TreeDataNode) => {
  if (node.isLeaf && node.checkable) return node;
  if (node.children) {
    const children: TreeDataNode[] = [];
    for (const item of node.children) {
      const result: TreeDataNode | false = filterTreeNode(item);
      if (result) {
        children.push(result);
      }
    }
    if (children.length > 0) {
      node.children = children;
      return node;
    }
    if (node.checkable) {
      node.children = children;
      return node;
    }
    return false;
  }
  return false;
};

// 获取下级所有节点
const getAllChildrenNodes = (node: TreeDataNode): TreeDataNode[] => {
  let nodes: TreeDataNode[] = [];
  if (node.children) {
    for (const item of node.children) {
      nodes = [...nodes, item, ...getAllChildrenNodes(item)];
    }
    return nodes;
  } else {
    return nodes;
  }
};

// 获取上级所有节点
const getAllParentNodes = (
  pos: string,
  allNodes: TreeDataNode[]
): TreeDataNode[] => {
  const nodes: TreeDataNode[] = [];
  const posArr = pos
    .split('-')
    .slice(1, -1)
    .map((i) => parseInt(i, 10));
  let parentNode = allNodes;
  for (const pos of posArr) {
    const node = parentNode[pos];
    parentNode = node.children as TreeDataNode[];
    nodes.push(node);
  }
  return nodes;
};

// 压缩树
const zipTree = (node: TreeDataNode, refer: string[]) => {
  if (refer.includes(node.key as string)) {
    return [node.key as string];
  }
  if (node.children) {
    let result: string[] = [];
    for (const item of node.children) {
      result = [...result, ...zipTree(item, refer)];
    }
    return result;
  }
  return [];
};

// 解压树
const unzipTree = (node: TreeDataNode, refer: string[]) => {
  if (refer.includes(node.key as string)) {
    return [node, ...getAllChildrenNodes(node)];
  }
  if (node.children) {
    let result: TreeDataNode[] = [];
    for (const item of node.children) {
      result = [...result, ...unzipTree(item, refer)];
    }
    return result;
  }
  return [];
};

// 生成树数据
export const generateTreeData = (secuControl: string[]) => {
  // 生成树
  const transformTree = SECURITY_CATEGORY_LEVEL.map((i) =>
    transformFn(i, secuControl)
  );
  // 过滤树
  const filterTree: TreeDataNode[] = [];
  for (const node of transformTree) {
    const tmp = filterTreeNode(node);
    if (tmp) {
      filterTree.push(tmp);
    }
  }
  return filterTree;
};

// 获取展示数据
export const getViewData = (value: string[], secuControl: string[] = []) => {
  const traversalTree = (node: TreeDataNode, refer: string[]) => {
    if (refer.includes(node.key as string)) {
      return [node];
    }
    if (node.children) {
      let result: TreeDataNode[] = [];
      for (const item of node.children) {
        result = [...result, ...traversalTree(item, refer)];
      }
      return result;
    }
    return [];
  };
  let viewNodes: TreeDataNode[] = [];
  if (value) {
    for (const node of generateTreeData(secuControl)) {
      viewNodes = [...viewNodes, ...traversalTree(node, value)];
    }
  }
  return viewNodes.map((i) => ({ label: i.title, value: i.key }));
};

// 树状数据转选项
export const getTreeDataOptions = () => {
  const traversalTree = (node: TreeDataNode) => {
    let result: TreeDataNode[] = [node];
    if (node.children) {
      for (const item of node.children) {
        result = [...result, ...traversalTree(item)];
      }
    }
    return result;
  };
  let viewNodes: TreeDataNode[] = [];
  for (const node of generateTreeData([])) {
    viewNodes = [...viewNodes, ...traversalTree(node)];
  }
  return viewNodes.map((i) => ({ label: i.title, value: i.key }));
};

const SecurityTypeSelect: FC<Props> = ({
  value,
  onChange,
  secuControl = [],
  style = {},
}) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const disabled = useContext(DisabledContext);

  const getTreeData = useMemo(
    () => generateTreeData(secuControl),
    [secuControl]
  );

  const handleCheck: TreeProps['onCheck'] = (_, e) => {
    let resultKeys: string[] = [];
    // 获取全部下级
    const allChildrenKeys = getAllChildrenNodes(e.node).map((i) => i.key);
    // 获取全部上级
    const allParentKeys = getAllParentNodes(e.node.pos, getTreeData).map(
      (i) => i.key
    );
    if (e.checked) {
      // 添加-取并集
      resultKeys = unionBy(
        checkedKeys,
        [e.node.key as string],
        allChildrenKeys as string[]
      );
    } else {
      // 排除
      resultKeys = difference(checkedKeys, [
        e.node.key as string,
        ...(allChildrenKeys as string[]),
        ...(allParentKeys as string[]),
      ]);
    }
    if (onChange) {
      if (resultKeys.length === 0) {
        onChange([]);
      } else {
        let formData: string[] = [];
        for (const node of getTreeData) {
          formData = [...formData, ...zipTree(node, resultKeys)];
        }
        onChange(formData);
      }
    }
    setCheckedKeys(resultKeys);
  };

  const realValue = useMemo(
    () => getViewData(value || [], secuControl),
    [value, secuControl]
  );

  useEffect(() => {
    if (value) {
      let treeValues: TreeDataNode[] = [];
      for (const node of getTreeData) {
        treeValues = [...treeValues, ...unzipTree(node, value)];
      }
      setCheckedKeys(treeValues.map((i) => i.key as string));
    }
  }, [value]);

  const renderPopoverContent = (
    <div className={styles.previewContent}>
      {(realValue || []).map((i, index: number) => (
        <div className={styles.item} key={index}>
          <div className={styles.text}>{i.label as string}</div>
          {!disabled && (
            <CloseOutlined
              onClick={() => {
                const list = realValue.filter((o) => o.value !== i.value);
                onChange && onChange(list.map((o) => o.value as string));
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

  const getProps: SelectProps = {
    mode: 'multiple',
    labelInValue: true,
    allowClear: true,
    value: realValue,
    style: { width: '100%', ...style },
    placeholder: '请选择',
    maxTagCount: 'responsive',
    dropdownStyle: { maxHeight: '300px', overflow: 'auto' },
    showSearch: false,
    onChange: (values) =>
      onChange &&
      onChange(values.map((i: { label: string; value: string }) => i.value)),
    dropdownRender: () => (
      <Tree
        treeData={getTreeData}
        checkable={true}
        checkStrictly={true}
        defaultExpandAll={true}
        onCheck={handleCheck}
        checkedKeys={checkedKeys}
      />
    ),
  };

  useEffect(() => {
    if (value && value.length === 0) {
      setOpen(false);
    }
  }, [value]);

  return (
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
        {disabled ? (
          <Dropdown
            popupRender={() => (
              <div
                className="riskControlPlatform-select-dropdown"
                style={{
                  top: '0',
                  left: 0,
                  width: '100%',
                  maxHeight: '300px',
                  overflow: 'auto',
                }}
              >
                <Tree
                  treeData={getTreeData}
                  checkable={true}
                  checkStrictly={true}
                  defaultExpandAll={true}
                  onCheck={handleCheck}
                  disabled={disabled}
                  checkedKeys={checkedKeys}
                />
              </div>
            )}
          >
            <Select {...getProps} disabled={disabled} />
          </Dropdown>
        ) : (
          <Select {...getProps} />
        )}
      </Popover>
    </ConfigProvider>
  );
};

export default SecurityTypeSelect;
