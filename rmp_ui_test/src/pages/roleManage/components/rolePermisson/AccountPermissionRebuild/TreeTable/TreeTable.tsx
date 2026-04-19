import { AcctAuthAction, AcctItem } from '../data';
import styles from './style.less';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  compareArrays,
  convertToTree,
  getAllChildrenNodes,
  getAllParentKeys,
  getAllParentNodes,
  unzipTree,
  zipTree,
} from '../util';
import { DataNode, TreeProps } from '@ht/sprite-ui/lib/tree';
import { Empty, Tree } from '@ht/sprite-ui';
import { AccountTreeItem } from '@/pages/roleManage/contant/typing';
import { BookTypeEnum } from '@/pages/ruleSetting/components/RuleDimensionControl/component/ControlAcctTypeSelect';
import { difference, intersection, unionBy } from 'lodash';
import { useUpdateEffect } from 'ahooks';
import useEIP from '@/directives/useEIP';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import { useHeightResize } from '@/hooks';

interface IProps {
  treeData: AccountTreeItem[];
  value: AcctItem[];
  bookType: BookTypeEnum;
  onChange: (action: AcctAuthAction) => void;
}

const TreeTable: React.FC<IProps> = ({
  treeData,
  value,
  bookType,
  onChange,
}) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const [isEIP] = useEIP();

  const valueKeys = useMemo(() => {
    const valueArr = value.map(
      (i) => `${i.acctCode}|${i.bookLevel}|${i.marketId}`
    );
    const filter = treeData.filter((i) =>
      valueArr.includes(`${i.acctCode}|${i.bookLevel}|${i.marketId || -1}`)
    );
    return filter.map(
      (i) => `${i.acctCode}|${i.bookLevel}|${i.marketId || -1}`
    );
  }, [value, treeData]);

  const getTreeData = useMemo(() => {
    const hasAllValue = value.find(
      (i) => i.acctCode === '-1' && i.bookLevel === -1 && i.marketId === -1
    );
    return convertToTree(treeData, bookType, !!hasAllValue);
  }, [treeData, value]);

  useEffect(() => {
    setExpandedKeys(getAllParentKeys(treeData));
  }, [treeData]);

  useEffect(() => {
    if (valueKeys) {
      let treeValues: DataNode[] = [];
      for (const node of getTreeData) {
        treeValues = [...treeValues, ...unzipTree(node, valueKeys)];
      }
      // 取交集
      const intersectionArr = intersection(
        checkedKeys,
        treeValues.map((i) => i.key)
      );
      // 如果交集长度不等于选中长度,赋值
      if (
        intersectionArr.length !== checkedKeys.length ||
        (checkedKeys.length === 0 && valueKeys.length !== 0)
      ) {
        setCheckedKeys(treeValues.map((i) => i.key as string));
      }
    }
  }, [getTreeData, valueKeys]);

  const handleCheck: TreeProps['onCheck'] = (_, e) => {
    let resultKeys: string[] = [];
    // 获取全部下级
    const allChildrenKeys = getAllChildrenNodes(e.node).map((i) => i.key);
    // 获取全部上级
    const allParentKeys = getAllParentNodes(e.node.pos, getTreeData).map(
      (i) => i.key
    );
    if (e.checked) {
      // 添加
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
    setCheckedKeys(resultKeys);
  };

  useUpdateEffect(() => {
    let formData: string[] = [];
    for (const node of getTreeData) {
      formData = [...formData, ...zipTree(node, checkedKeys)];
    }
    const { added, removed } = compareArrays(valueKeys, formData);
    if (added.length > 0 || removed.length > 0)
      onChange({
        addAcct: added.map((i) => {
          const [acctCode, bookLevel, marketId] = i.split('|');
          return {
            acctCode,
            bookLevel: Number(bookLevel),
            marketId: Number(marketId),
          };
        }),
        deleteAcct: removed.map((i) => {
          const [acctCode, bookLevel, marketId] = i.split('|');
          return {
            acctCode,
            bookLevel: Number(bookLevel),
            marketId: Number(marketId),
          };
        }),
      });
  }, [checkedKeys]);

  const treeRef = useRef(null);
  const treeSize = useHeightResize(treeRef);

  return (
    <div className={styles.treeTable}>
      <div className={styles.header}>
        {bookType === BookTypeEnum.TRADE_ACCOUNT ? (
          <>
            <div
              className={styles.cell}
              style={{ width: 'calc(100% - 300px)' }}
            >
              账户
            </div>
            <div className={styles.cell} style={{ width: '150px' }}>
              交易市场
            </div>
            <div className={styles.cell} style={{ width: '150px' }}>
              账户层级
            </div>
          </>
        ) : null}
        {bookType === BookTypeEnum.MANAGE_ACCOUNT ? (
          <>
            <div
              className={styles.cell}
              style={{ width: 'calc(100% - 150px)' }}
            >
              账户
            </div>
            <div className={styles.cell} style={{ width: '150px' }}>
              账户层级
            </div>
          </>
        ) : null}
      </div>
      <div ref={treeRef} className={styles.body}>
        {getTreeData.length === 0 ? (
          <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <Empty
              style={{ width: '100%', alignSelf: 'center' }}
              image={NoDataSimpleSvg}
              description={'暂无数据'}
            />
          </div>
        ) : (
          <Tree
            treeData={getTreeData}
            disabled={isEIP}
            checkable={true}
            height={treeSize ? treeSize : 600}
            checkStrictly={true}
            defaultExpandAll={true}
            onCheck={handleCheck}
            checkedKeys={checkedKeys}
            blockNode={true}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as string[])}
          />
        )}
      </div>
    </div>
  );
};

export default TreeTable;
