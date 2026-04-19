import React, { useEffect, useMemo, useState } from 'react';
import { Button, Tree } from '@ht/sprite-ui';
import type { DataNode } from '@ht/sprite-ui/es/tree';
import styles from './style.less';
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
} from '@ht-icons/sprite-ui-react/lib/icons';
import clsx from 'clsx';

export type AccountItem = {
  acctCode?: string;
  acctName?: string;
  marketId?: number | string;
  extSysId?: number | string;
  bookLevel: number;
  parentAcctCode?: string;
  [k: string]: any;
};

export type TreeNode = DataNode & {
  key: string; // = dedupKey
  title: React.ReactNode;
  disabled?: boolean; // 禁用整行（含复选框）
  disableCheckbox?: boolean; // 仅禁用复选框
  raw: AccountItem;
  children?: TreeNode[];
};

interface Props {
  leftTreeData: TreeNode[];
  rightTreeData: TreeNode[];
  fullTreeData: TreeNode[]; // 全量树（未裁剪）
  desiredLevel: number; // 兼容旧签名
  leafLevel: number; // 最小层级（叶子）
  targetKeys: string[]; // 右侧“已选”的叶子 keys
  onTargetKeysChange: (keys: string[]) => void;
  leftTop?: React.ReactNode;
  rightTop?: React.ReactNode;
}

function flattenToMap(nodes: TreeNode[]) {
  const map = new Map<string, TreeNode>();
  const st = [...nodes];
  while (st.length) {
    const n = st.pop()!;
    map.set(String(n.key), n);
    (n.children as TreeNode[] | undefined)?.forEach((c) => st.push(c));
  }
  return map;
}

function normalizeCheckedParam(keys: any): string[] {
  if (Array.isArray(keys)) return keys.map(String);
  if (keys && Array.isArray(keys.checked)) return keys.checked.map(String);
  return [];
}

// 构建“可见且为叶子”的集合
function buildVisibleLeafSet(map: Map<string, TreeNode>, leafLevel: number) {
  const set = new Set<string>();
  map.forEach((n, k) => {
    const isLeaf = Number(n.raw?.bookLevel) === Number(leafLevel);
    if (isLeaf) set.add(String(k));
  });
  return set;
}

// 构建“可见禁用叶子”集合
function buildDisabledLeafSet(map: Map<string, TreeNode>, leafLevel: number) {
  const set = new Set<string>();
  map.forEach((n, k) => {
    const isLeaf = Number(n.raw?.bookLevel) === Number(leafLevel);
    const disabled = !!(n.disabled || (n as any).disableCheckbox);
    if (isLeaf && disabled) set.add(String(k));
  });
  return set;
}

function collectLeavesFrom(
  node: TreeNode,
  leafLevel: number,
  out: Set<string>,
  disabledLeafSet?: Set<string>
) {
  const st: TreeNode[] = [node];
  while (st.length) {
    const n = st.pop()!;
    const kids = (n.children as TreeNode[]) || [];
    const isLeaf = Number(n.raw?.bookLevel) === Number(leafLevel);
    if (isLeaf) {
      const k = String(n.key);
      if (!disabledLeafSet || !disabledLeafSet.has(k)) out.add(k);
    } else {
      kids.forEach((k) => st.push(k));
    }
  }
}

function toVisibleLeafKeys(
  rawKeys: string[],
  visibleMap: Map<string, TreeNode>,
  leafLevel: number,
  disabledLeafSet?: Set<string>
) {
  const set = new Set<string>();
  rawKeys.forEach((k0) => {
    const k = String(k0);
    const node = visibleMap.get(k);
    if (!node) return; // 不在当前可视树，忽略
    const isLeaf = Number(node.raw?.bookLevel) === Number(leafLevel);
    if (isLeaf) {
      if (!disabledLeafSet || !disabledLeafSet.has(k)) set.add(k);
    } else {
      collectLeavesFrom(node, leafLevel, set, disabledLeafSet);
    }
  });
  return Array.from(set);
}

// 在“全量树”上构建：节点 -> 其“全量叶子（leafLevel）后代”列表（用于半选/全选视觉）
function buildNodeToAllLeavesMap(roots: TreeNode[], leafLevel: number) {
  const map = new Map<string, string[]>();
  const dfs = (node: TreeNode): string[] => {
    const kids = (node.children as TreeNode[]) || [];
    const isLeaf = Number(node.raw?.bookLevel) === Number(leafLevel);
    if (isLeaf) {
      const k = String(node.key);
      map.set(k, [k]);
      return [k];
    }
    let all: string[] = [];
    for (const c of kids) all = all.concat(dfs(c));
    map.set(String(node.key), all);
    return all;
  };
  roots.forEach((r) => dfs(r));
  return map;
}

const AccountTreeTransfer: React.FC<Props> = ({
  leftTreeData,
  rightTreeData,
  fullTreeData,
  desiredLevel, // 兼容
  leafLevel,
  targetKeys,
  onTargetKeysChange,
  leftTop,
  rightTop,
}) => {
  const [leftAllChecked, setLeftAllChecked] = useState<string[]>([]);
  const [rightAllChecked, setRightAllChecked] = useState<string[]>([]);

  /** 展开状态（默认全展开） */
  const [leftExpanded, setLeftExpanded] = useState<React.Key[]>([]);
  const [rightExpanded, setRightExpanded] = useState<React.Key[]>([]);

  // 左右树默认全展开
  useEffect(() => {
    const keys: React.Key[] = [];
    const walk = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        keys.push(node.key);
        if (node.children && node.children.length)
          walk(node.children as TreeNode[]);
      }
    };
    walk(leftTreeData);
    setLeftExpanded(keys);
  }, [leftTreeData]);

  useEffect(() => {
    const keys: React.Key[] = [];
    const walk = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        keys.push(node.key);
        if (node.children && node.children.length)
          walk(node.children as TreeNode[]);
      }
    };
    walk(rightTreeData);
    setRightExpanded(keys);
  }, [rightTreeData]);

  // 可视 & 全量 map
  const leftMap = useMemo(() => flattenToMap(leftTreeData), [leftTreeData]);
  const rightMap = useMemo(() => flattenToMap(rightTreeData), [rightTreeData]);
  const fullMap = useMemo(() => flattenToMap(fullTreeData), [fullTreeData]);

  // 可见叶子集合 & 可见禁用叶子集合
  const leftVisibleLeafSet = useMemo(
    () => buildVisibleLeafSet(leftMap, leafLevel),
    [leftMap, leafLevel]
  );
  const rightVisibleLeafSet = useMemo(
    () => buildVisibleLeafSet(rightMap, leafLevel),
    [rightMap, leafLevel]
  );

  const leftDisabledLeafSet = useMemo(
    () => buildDisabledLeafSet(leftMap, leafLevel),
    [leftMap, leafLevel]
  );
  const rightDisabledLeafSet = useMemo(
    () => buildDisabledLeafSet(rightMap, leafLevel),
    [rightMap, leafLevel]
  );

  // 仅用于 UI 的“可见且非禁用的勾选叶子”
  const leftCheckedVisible = useMemo(
    () =>
      leftAllChecked.filter(
        (k) =>
          leftVisibleLeafSet.has(String(k)) &&
          !leftDisabledLeafSet.has(String(k))
      ),
    [leftAllChecked, leftVisibleLeafSet, leftDisabledLeafSet]
  );
  const rightCheckedVisible = useMemo(
    () =>
      rightAllChecked.filter(
        (k) =>
          rightVisibleLeafSet.has(String(k)) &&
          !rightDisabledLeafSet.has(String(k))
      ),
    [rightAllChecked, rightVisibleLeafSet, rightDisabledLeafSet]
  );

  // ======== 半选（视觉）：用“全量树 + 全局选择集合”计算 ========
  // 左侧：全局选择 = 左侧持久选择 ∪ 已右移（targetKeys）
  const leftSelectedGlobal = useMemo(
    () =>
      new Set<string>([
        ...leftAllChecked.map(String),
        ...targetKeys.map(String),
      ]),
    [leftAllChecked, targetKeys]
  );
  // 右侧：全局选择 = 右侧持久选择（仅右侧）
  const rightSelectedGlobal = useMemo(
    () => new Set<string>(rightAllChecked.map(String)),
    [rightAllChecked]
  );

  // 全量：节点 -> 全量叶子
  const node2AllLeaves = useMemo(
    () => buildNodeToAllLeavesMap(fullTreeData, leafLevel),
    [fullTreeData, leafLevel]
  );

  // 计算“可见节点”的半选列表（左/右）
  const leftHalfChecked = useMemo(() => {
    const half = new Set<string>();
    leftMap.forEach((n, key) => {
      const leaves = node2AllLeaves.get(String(key)) || [];
      if (!leaves.length) return;
      let sel = 0;
      for (const lk of leaves) if (leftSelectedGlobal.has(lk)) sel += 1;
      if (sel > 0 && sel < leaves.length) half.add(String(key));
    });
    return Array.from(half);
  }, [leftMap, node2AllLeaves, leftSelectedGlobal]);

  const rightHalfChecked = useMemo(() => {
    const half = new Set<string>();
    rightMap.forEach((n, key) => {
      const leaves = node2AllLeaves.get(String(key)) || [];
      if (!leaves.length) return;
      let sel = 0;
      for (const lk of leaves) if (rightSelectedGlobal.has(lk)) sel += 1;
      if (sel > 0 && sel < leaves.length) half.add(String(key));
    });
    return Array.from(half);
  }, [rightMap, node2AllLeaves, rightSelectedGlobal]);

  const onLeftCheck = (keys: any) => {
    const raw = normalizeCheckedParam(keys);
    const nextVisibleLeaves = toVisibleLeafKeys(
      raw,
      leftMap,
      leafLevel,
      leftDisabledLeafSet
    );

    const prevVisibleSet = new Set(leftCheckedVisible.map(String));
    const nextVisibleSet = new Set(nextVisibleLeaves.map(String));

    const nextAll = new Set(leftAllChecked.map(String));
    nextVisibleLeaves.forEach((k) => {
      if (!prevVisibleSet.has(k)) nextAll.add(k);
    });
    leftCheckedVisible.forEach((k) => {
      if (!nextVisibleSet.has(k)) nextAll.delete(k);
    });
    setLeftAllChecked(Array.from(nextAll));
  };

  const onRightCheck = (keys: any) => {
    const raw = normalizeCheckedParam(keys);
    const nextVisibleLeaves = toVisibleLeafKeys(
      raw,
      rightMap,
      leafLevel,
      rightDisabledLeafSet
    );

    const prevVisibleSet = new Set(rightCheckedVisible.map(String));
    const nextVisibleSet = new Set(nextVisibleLeaves.map(String));

    const nextAll = new Set(rightAllChecked.map(String));
    nextVisibleLeaves.forEach((k) => {
      if (!prevVisibleSet.has(k)) nextAll.add(k);
    });
    rightCheckedVisible.forEach((k) => {
      if (!nextVisibleSet.has(k)) nextAll.delete(k);
    });
    setRightAllChecked(Array.from(nextAll));
  };

  // ======== 移动：仍只移动“当前可见且勾选”的叶子 ========
  const moveRight = () => {
    if (!leftAllChecked.length) return;
    const merged = Array.from(new Set([...targetKeys, ...leftAllChecked]));
    onTargetKeysChange(merged);
    const keep = new Set(
      leftAllChecked.filter((k) => !leftVisibleLeafSet.has(String(k)))
    );
    setLeftAllChecked(Array.from(keep));
    setRightAllChecked([]);
  };

  const moveLeft = () => {
    if (!rightCheckedVisible.length) return;
    const rm = new Set(rightCheckedVisible.map(String));
    const next = targetKeys.filter((k) => !rm.has(String(k)));
    onTargetKeysChange(next);
    const keep = new Set(
      rightAllChecked.filter((k) => !rightVisibleLeafSet.has(String(k)))
    );
    setRightAllChecked(Array.from(keep));
    setLeftAllChecked([]);
  };

  // 自定义展开/折叠图标：折叠=方形加号；展开=方形减号；叶子=占位
  const renderSwitcherIcon = (nodeProps: any) => {
    const { expanded, isLeaf } = nodeProps;
    if (isLeaf) return <span className={styles.switcherPlaceholder} />;

    return (
      <span
        className={clsx(
          styles.switcherSquare,
          expanded ? styles.switcherOpen : styles.switcherClose
        )}
      >
        {expanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
      </span>
    );
  };

  return (
    <div className={styles.treeTable}>
      {/* 左侧 */}
      <div className={styles.body}>
        {leftTop && <div style={{ minWidth: 0 }}>{leftTop}</div>}
        <div className={styles.treeBody}>
          <Tree
            fieldNames={{ title: 'title', key: 'key', children: 'children' }}
            checkable={true}
            selectable={false}
            checkStrictly={false}
            treeData={leftTreeData}
            checkedKeys={{
              checked: leftCheckedVisible as any,
              halfChecked: leftHalfChecked as any,
            }}
            onCheck={onLeftCheck}
            expandedKeys={leftExpanded as any}
            onExpand={(ks) => setLeftExpanded(ks)}
            // height={360}
            height={500}
            showLine={true}
            switcherIcon={renderSwitcherIcon}
          />
        </div>
      </div>

      {/* 中间按钮 */}
      <div className={styles.btnGroup}>
        <Button
          className={styles.btnGroupBtn}
          type={leftAllChecked.length ? 'primary' : 'default'}
          disabled={!leftAllChecked.length}
          onClick={moveRight}
        >
          &gt;
        </Button>
        <Button
          className={styles.btnGroupBtn}
          type={rightAllChecked.length ? 'primary' : 'default'}
          disabled={!rightAllChecked.length}
          onClick={moveLeft}
        >
          &lt;
        </Button>
      </div>

      {/* 右侧 */}
      <div className={styles.body}>
        {rightTop && <div style={{ minWidth: 0 }}>{rightTop}</div>}
        <div className={styles.treeBody}>
          <Tree
            fieldNames={{ title: 'title', key: 'key', children: 'children' }}
            checkable={true}
            selectable={false}
            checkStrictly={false}
            showLine={true}
            treeData={rightTreeData}
            checkedKeys={{
              checked: rightCheckedVisible as any,
              halfChecked: rightHalfChecked as any,
            }}
            onCheck={onRightCheck}
            expandedKeys={rightExpanded as any}
            onExpand={(ks) => setRightExpanded(ks)}
            // height={360}
            height={500}
            switcherIcon={renderSwitcherIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountTreeTransfer;
