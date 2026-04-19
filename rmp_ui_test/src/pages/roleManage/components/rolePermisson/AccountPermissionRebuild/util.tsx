import type { DataNode } from '@ht/sprite-ui/es/tree';
import React from 'react';
import { AccountTreeItem } from '@/pages/roleManage/contant/typing';
import { BookTypeEnum } from '@/pages/ruleSetting/components/RuleDimensionControl/component/ControlAcctTypeSelect';
import { ALL_KEY } from './data';
import { TRADING_MARKETS } from '@/utils/dict';

// 市场映射
const MarketViewMap: Recordable = TRADING_MARKETS.reduce(
  (prev, cur) => ({ ...prev, [cur.code]: cur.name }),
  {}
);

// 获取下级所有节点
export const getAllChildrenNodes = (node: DataNode): DataNode[] => {
  let nodes: DataNode[] = [];
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
export const getAllParentNodes = (
  pos: string,
  allNodes: DataNode[]
): DataNode[] => {
  const nodes: DataNode[] = [];
  const posArr = pos
    .split('-')
    .slice(1, -1)
    .map((i) => parseInt(i, 10));
  let parentNode = allNodes;
  for (const pos of posArr) {
    const node = parentNode[pos];
    parentNode = node.children as DataNode[];
    nodes.push(node);
  }
  return nodes;
};

// 解压树
export const unzipTree = (node: DataNode, refer: string[]) => {
  if (refer.includes(node.key as string)) {
    return [node, ...getAllChildrenNodes(node)];
  }
  if (node.children) {
    let result: DataNode[] = [];
    for (const item of node.children) {
      result = [...result, ...unzipTree(item, refer)];
    }
    return result;
  }
  return [];
};

// 压缩树
export const zipTree = (node: DataNode, refer: string[]) => {
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

/**
 * 数组转树结构
 * @param arr 数组
 * @param parentId
 * @returns
 */
export const convertToTree = (
  arr: AccountTreeItem[],
  bookType: BookTypeEnum,
  hasAllValue: boolean
) => {
  const tree: DataNode[] = [];

  const map: Recordable = {};
  arr.forEach((item) => {
    map[`${item.acctCode}|${item.bookLevel}|${item.marketId || -1}`] = {
      key: `${item.acctCode}|${item.bookLevel}|${item.marketId || -1}`,
      title: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
          }}
        >
          {bookType === BookTypeEnum.TRADE_ACCOUNT ? (
            <>
              <div
                style={{
                  textAlign: 'center',
                  flexBasis: '110px',
                  flexShrink: 0,
                }}
              >
                {item.bookLevelName}
              </div>
              <div
                style={{
                  textAlign: 'center',
                  flexBasis: '190px',
                  flexShrink: 0,
                }}
              >
                {MarketViewMap[item.marketId]}
              </div>
            </>
          ) : null}
          {bookType === BookTypeEnum.MANAGE_ACCOUNT ? (
            <div
              style={{
                width: '110px',
                textAlign: 'center',
                flexBasis: '110px',
                flexShrink: 0,
              }}
            >
              {item.bookLevelName}
            </div>
          ) : null}
          <div
            style={{
              textAlign: 'left',
              flex: '1 auto',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >{`${item.acctCode}-${item.acctName}`}</div>
        </div>
      ),
      checkable: true,
      disabled: !!(
        hasAllValue &&
        `${item.acctCode}|${item.bookLevel}|${item.marketId}` !== ALL_KEY
      ),
    };
  });
  arr.forEach((item) => {
    if (item.parentAcctCode && map[item.parentAcctCode]) {
      if (map[item.parentAcctCode].children) {
        map[item.parentAcctCode].children.push(
          map[`${item.acctCode}|${item.bookLevel}|${item.marketId || -1}`]
        );
      } else {
        map[item.parentAcctCode].children = [
          map[`${item.acctCode}|${item.bookLevel}|${item.marketId || -1}`],
        ];
      }
    } else {
      tree.push(
        map[`${item.acctCode}|${item.bookLevel}|${item.marketId || -1}`]
      );
    }
  });
  return tree;
};

// 获取所有父级的key
export const getAllParentKeys = (arr: AccountTreeItem[]) => {
  const map: Recordable = {};
  arr.forEach((item) => {
    map[`${item.acctCode}|${item.bookLevel}|${item.marketId || -1}`] = {
      key: `${item.acctCode}|${item.bookLevel}|${item.marketId || -1}`,
    };
  });
  arr.forEach((item) => {
    if (item.parentAcctCode && map[item.parentAcctCode]) {
      if (map[item.parentAcctCode].children) {
        map[item.parentAcctCode].children.push(
          map[`${item.acctCode}|${item.bookLevel}|${item.marketId || -1}`]
        );
      } else {
        map[item.parentAcctCode].children = [
          map[`${item.acctCode}|${item.bookLevel}|${item.marketId || -1}`],
        ];
      }
    }
  });
  const parentKeys: string[] = [];
  for (const key in map) {
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      if (map[key].children && map[key].children.length > 0) {
        parentKeys.push(map[key].key);
      }
    }
  }
  return parentKeys;
};

// 比较两个数组，判断增减
export const compareArrays = (arr1: string[], arr2: string[]) => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const added = [...set2].filter((x) => !set1.has(x));
  const removed = [...set1].filter((x) => !set2.has(x));

  return {
    added,
    removed,
  };
};
