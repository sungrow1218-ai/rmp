// =============================================
// File: AddAccountTree.tsx
// =============================================
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  memo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Modal, Space, Button } from '@ht/sprite-ui';
import type { SobInfo } from '@/services/account';

import AccountTreeTransfer, { TreeNode } from './AccountTreeTransfer';
import AccountSearchBar from './AccountSearchBar';
import TransferFooter from './TransferFooter';
import styles from './style.less';
import FaultListModal from '../FaultListModal';

import useAccountQuery from '../../hooks/useAccountQuery';
import useExternSystems from '../../hooks/useExternSystems';
import usePagination from '../../hooks/usePagination';

import { listToTree, dedupKey, type AccountItem } from '../../utils/tree';
import { getTitleByBookType } from '../../utils/title';

import AccountGroupSubmitButton from './AccountGroupSubmitButton';
import useDataPool from '../../hooks/useDataPool';
import useLeftRightBase from '../../hooks/useLeftRightBase';
import useLeftTreeOrder from '../../hooks/useLeftTreeOrder';

// 拆分后的工具/Hook
import { buildMapsFromTree } from '../../hooks/treeHelpers';
import { buildLeafPredicate } from '../../hooks/predicates';
import useStrictLeafPaging from '../../hooks/useStrictLeafPaging';
import { usePrunedTreeForPage } from '../../hooks/usePrunedTreeForPage';
import { ExclamationCircleFilled } from '@ht-icons/sprite-ui-react/lib/icons';

export interface AddAccountAction {
  open: () => void;
  close: () => void;
}

interface Props {
  onClose?: () => void;
  reFresh?: (p?: any) => void;
  sobInfo: SobInfo;
  bookType: number | undefined;
  bookLevel: number | undefined; // 叶子层级（组合账户）
  acctGroupId: number | undefined;
}

const AddAccountTree = forwardRef<AddAccountAction, Props>((props, ref) => {
  const { onClose, reFresh, sobInfo, bookType, bookLevel, acctGroupId } = props;

  const [open, setOpen] = useState(false);
  /** 右侧“已选”的叶子 dedupKey（严格存叶子层级 key） */
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const [isFaultModalVisible, setIsFaultModalVisible] = useState(false);
  const [faultList, setFaultList] = useState<any[]>([]);

  const extSystems = useExternSystems(sobInfo?.sobId);
  // const extSystems = useExternSystems();

  /** 从 useAccountQuery 取数据 + 账户组已有账户的“含层级 key”集合 */

  const {
    data: queryResult = [],
    run: query,
    setData: setQueryData,
    preDisabledKeys, // 账户组已有叶子的 key（acctCode-marketId-extSysId-bookLevel）
  } = useAccountQuery();

  // 提取交易系统ID数组，确保类型一致
  const extSysId = extSystems
    .map((sys) => {
      const id = sys.extSysId;
      return typeof id === 'string' ? Number(id) : id;
    })
    .filter((id) => id > 0); // 过滤无效ID

  const leafLevel = bookLevel as number;

  const ctxKey = useMemo(
    () => `${sobInfo?.sobId ?? ''}|${bookType ?? ''}|${bookLevel ?? ''}`,
    [sobInfo?.sobId, bookType, bookLevel]
  );

  const bookLevels = useMemo(() => {
    if (!sobInfo?.bookList || !Array.isArray(sobInfo.bookList)) return [];
    return sobInfo.bookList
      .filter((b) => b.bookType === bookType)
      .flatMap((b) =>
        b.bookLevelList
          .filter((l) => l.bookLevel >= leafLevel)
          .map((l) => ({ label: l.bookLevelName, value: l.bookLevel }))
      );
  }, [sobInfo, bookType, leafLevel]);

  const [leftFilter, setLeftFilter] = useState({
    extSysId: undefined as any,
    accountType: leafLevel as any,
    marketId: undefined as any,
    acctName: '',
    acctCode: '', // 兼容原逻辑，可为空
  });
  const [rightFilter, setRightFilter] = useState({
    extSysId: undefined as any,
    accountType: leafLevel as any,
    marketId: undefined as any,
    acctName: '',
    acctCode: '',
  });

  const renderTitle = useCallback(
    (it: AccountItem) => getTitleByBookType(it, bookType as number, extSystems),
    [bookType, extSystems]
  );

  /** 数据池（保留全部账户，包含账户组已有账户） */
  const { dataPool } = useDataPool({
    open,
    queryResult,
    query,
    sobId: sobInfo?.sobId,
    bookType: Number(bookType),
    bookLevel: Number(bookLevel),
    leftFilter,
    acctGroupId: acctGroupId as number,
    bookLevels,
    ctxKey,
  });

  useEffect(() => {
    if (open) setQueryData([]);
  }, [open, ctxKey, setQueryData]);

  const leftDesiredLevel = useMemo(
    () => (leftFilter.accountType as number) || leafLevel,
    [leftFilter.accountType, leafLevel]
  );
  const rightDesiredLevel = useMemo(
    () => (rightFilter.accountType as number) || leafLevel,
    [rightFilter.accountType, leafLevel]
  );

  const { leftBaseItems, rightBaseItems } = useLeftRightBase({
    dataPool,
    leafLevel,
    leftDesiredLevel,
    rightDesiredLevel,
    leftFilter,
    rightFilter,
    targetKeys,
  });

  const { leftBaseItemsSorted } = useLeftTreeOrder({
    leftBaseItems,
    dataPool,
    renderTitle,
    leftDesiredLevel,
  });

  // 分页（页大小只控制“叶子分页”的 chunk 尺寸）
  const [leftPageSize, setLeftPageSize] = useState(10);
  const [rightPageSize, setRightPageSize] = useState(10);
  const leftPg = usePagination(leftBaseItemsSorted, leftPageSize);
  const rightPg = usePagination(rightBaseItems, rightPageSize);

  // 全量树 & 索引
  const fullTreeData = useMemo<TreeNode[]>(
    () => listToTree(dataPool, new Set(), renderTitle),
    [dataPool, renderTitle]
  );
  const { nodeMap: fullNodeMap, parentMap } = useMemo(
    () => buildMapsFromTree(fullTreeData),
    [fullTreeData]
  );

  // 叶子过滤谓词（左右）
  const leftLeafPredicate = useMemo(
    () => buildLeafPredicate(leftFilter, fullNodeMap, parentMap),
    [leftFilter, fullNodeMap, parentMap]
  );
  const rightLeafPredicate = useMemo(
    () => buildLeafPredicate(rightFilter, fullNodeMap, parentMap),
    [rightFilter, fullNodeMap, parentMap]
  );

  /** 右侧已选集合（严格叶子） */
  const selectedLeafSet = useMemo(
    () => new Set((targetKeys || []).map(String)),
    [targetKeys]
  );

  /**
   *  用于“左侧禁用”的集合：
   *    = 右侧已选( targetKeys )  ∪  账户组已有( preDisabledKeys )
   */
  const selectedForDisable = useMemo(() => {
    const merged = new Set<string>(targetKeys.map(String));
    (preDisabledKeys || new Set<string>()).forEach((k) =>
      merged.add(String(k))
    );
    return merged;
  }, [targetKeys, preDisabledKeys]);

  // 严格按叶子分页
  const leftLeaf = useStrictLeafPaging(
    leftBaseItemsSorted,
    fullNodeMap,
    leafLevel,
    leftLeafPredicate,
    leftPageSize
  );
  const rightLeaf = useStrictLeafPaging(
    rightBaseItems,
    fullNodeMap,
    leafLevel,
    rightLeafPredicate,
    rightPageSize,
    selectedLeafSet // 右侧仅统计“已选叶子”
  );

  // 修复：左右两侧分页互不影响（拆分成两个 useEffect）
  useEffect(() => {
    leftPg.setPage(1);
    leftLeaf.setPage(1);
  }, [leftDesiredLevel]); // 仅依赖左侧层级

  useEffect(() => {
    rightPg.setPage(1);
    rightLeaf.setPage(1);
  }, [rightDesiredLevel]); // 仅依赖右侧层级

  // 左侧筛选变动 → 仅重置左侧页码
  useEffect(() => {
    leftPg.setPage(1);
    leftLeaf.setPage(1);
  }, [
    leftFilter.extSysId,
    leftFilter.acctName,
    leftFilter.acctCode,
    leftFilter.marketId,
  ]);

  // 右侧筛选变动 → 仅重置右侧页码
  useEffect(() => {
    rightPg.setPage(1);
    rightLeaf.setPage(1);
  }, [
    rightFilter.extSysId,
    rightFilter.acctName,
    rightFilter.acctCode,
    rightFilter.marketId,
  ]);

  // 基于“当前页叶子”裁剪树（左侧应用禁用：selectedForDisable）
  const leftPruned = usePrunedTreeForPage(
    leftLeaf.pages[leftLeaf.page - 1] || [],
    fullNodeMap,
    parentMap,
    fullTreeData,
    { applyDisable: true, selectedLeafSet: selectedForDisable, leafLevel }
  );
  const rightPruned = usePrunedTreeForPage(
    rightLeaf.pages[rightLeaf.page - 1] || [],
    fullNodeMap,
    parentMap,
    fullTreeData,
    { applyDisable: false, selectedLeafSet, leafLevel }
  );

  const leftCount = leftLeaf.total; // 共 X 条记录（按叶子）
  const rightCount = rightLeaf.total;

  // ===== 提交所需的 acct_list =====
  const selectedDesiredItems = useMemo(
    () =>
      (dataPool || []).filter(
        (it) => it.bookLevel === leafLevel && targetKeys.includes(dedupKey(it))
      ),
    [dataPool, targetKeys, leafLevel]
  );
  const acct_list = useMemo(
    () =>
      selectedDesiredItems.map((it) => ({
        acctCode: String(it.acctCode),
        acctName: String(it.acctName || ''),
        marketId: Number(it.marketId || -1),
        extSysId: Number(it.extSysId),
      })),
    [selectedDesiredItems]
  );

  const unitLabel =
    (sobInfo?.bookList || [])
      .find((b) => b.bookType === bookType)
      ?.bookLevelList.find((l) => l.bookLevel === bookLevel)?.bookLevelName ||
    '';

  const resetFiltersToDefaults = useCallback(() => {
    const base = {
      extSysId: undefined as any,
      marketId: undefined as any,
      acctName: '',
      acctCode: '',
      accountType: leafLevel as any,
    };
    setLeftFilter(base);
    setRightFilter(base);
    leftPg.setPage(1);
    rightPg.setPage(1);
    leftLeaf.setPage(1);
    rightLeaf.setPage(1);
  }, [leafLevel, leftPg, rightPg, leftLeaf, rightLeaf]);

  const openModal = useCallback(() => {
    resetFiltersToDefaults();
    setOpen(true);
  }, [resetFiltersToDefaults]);

  const closeModal = useCallback(() => {
    setOpen(false);
    setTargetKeys([]);
    setLeftFilter({
      extSysId: undefined,
      accountType: leafLevel,
      marketId: undefined,
      acctName: '',
      acctCode: '',
    });
    setRightFilter({
      extSysId: undefined,
      accountType: leafLevel,
      marketId: undefined,
      acctName: '',
      acctCode: '',
    });
    leftPg.setPage(1);
    rightPg.setPage(1);
    leftLeaf.setPage(1);
    rightLeaf.setPage(1);
  }, [leafLevel, leftPg, rightPg, leftLeaf, rightLeaf]);

  useImperativeHandle(ref, () => ({ open: openModal, close: closeModal }));

  const handleInnerClose = () => {
    closeModal();
    onClose?.();
  };

  if (!sobInfo) return null;

  return (
    <Modal
      className={styles.addAccountModal}
      title="添加账户"
      open={open}
      centered={true}
      destroyOnClose={true}
      maskClosable={false}
      onCancel={handleInnerClose}
      width={1800}
      footer={[
        <Button key="cancel" onClick={handleInnerClose}>
          取消
        </Button>,
        <AccountGroupSubmitButton
          key="ok"
          type="primary"
          payload={{
            acctGroupId: Number(acctGroupId),
            acctList: acct_list,
            unitLabel,
          }}
          onSuccess={() => {
            props.reFresh?.();
            closeModal();
          }}
          onFault={(fault) => {
            const enhanced = (fault || []).map((item: any) => ({
              ...item,
              accountTypeName: unitLabel,
            }));
            setFaultList(enhanced);
            setIsFaultModalVisible(true);
          }}
        >
          添加
        </AccountGroupSubmitButton>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <div className={styles.addAcctBody}>
          <div className={styles.tips}>
            <ExclamationCircleFilled className={styles.tipIcon} />
            <span className={styles.tipText}>
              Tips：请先选择交易系统和账户类型，查询结果按账户层级结构展示。
            </span>
          </div>

          <div className={styles.AccountSearchBar} style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <AccountSearchBar
                filter={leftFilter}
                setFilter={(updater) => {
                  setLeftFilter(updater);
                  leftPg.setPage(1);
                  leftLeaf.setPage(1);
                }}
                sobId={sobInfo?.sobId}
                bookType={bookType}
                bookLevels={bookLevels}
                unitLabel={unitLabel}
                title="选择账户"
                total={leftCount}
                showTotal={false}
              />
            </div>
            <div className={styles.btnGroup}>
              <Button style={{ opacity: 0, pointerEvents: 'none' }}>
                &gt;
              </Button>
              <Button style={{ opacity: 0, pointerEvents: 'none' }}>
                &gt;
              </Button>
            </div>
            <div style={{ flex: 1 }}>
              <AccountSearchBar
                filter={rightFilter}
                setFilter={(updater) => {
                  setRightFilter(updater);
                  rightPg.setPage(1);
                  rightLeaf.setPage(1);
                }}
                sobId={sobInfo?.sobId}
                bookType={bookType}
                bookLevels={bookLevels}
                unitLabel={unitLabel}
                showImport={true}
                title="已选账户"
                showTotal={true}
                total={rightCount}
              />
            </div>
          </div>
          <div className={styles.customSpace}>
            <AccountTreeTransfer
              leftTreeData={leftPruned.treeData}
              rightTreeData={rightPruned.treeData}
              fullTreeData={fullTreeData}
              desiredLevel={leftDesiredLevel}
              leafLevel={leafLevel}
              targetKeys={targetKeys}
              onTargetKeysChange={setTargetKeys}
            />

            <TransferFooter
              leftCount={leftCount}
              rightCount={rightCount}
              leftPage={leftLeaf.page}
              leftTotalPages={Math.max(1, leftLeaf.pages.length || 0)}
              onLeftPrev={() =>
                leftLeaf.setPage(Math.max(1, leftLeaf.page - 1))
              }
              onLeftNext={() =>
                leftLeaf.setPage(
                  Math.min(
                    Math.max(1, leftLeaf.pages.length || 1),
                    leftLeaf.page + 1
                  )
                )
              }
              leftPageSize={leftPageSize}
              onLeftPageSizeChange={(v) => {
                setLeftPageSize(v);
                leftLeaf.setPage(1);
              }}
              rightPage={rightLeaf.page}
              rightTotalPages={Math.max(1, rightLeaf.pages.length || 0)}
              onRightPrev={() =>
                rightLeaf.setPage(Math.max(1, rightLeaf.page - 1))
              }
              onRightNext={() =>
                rightLeaf.setPage(
                  Math.min(
                    Math.max(1, rightLeaf.pages.length || 1),
                    rightLeaf.page + 1
                  )
                )
              }
              rightPageSize={rightPageSize}
              onRightPageSizeChange={(v) => {
                setRightPageSize(v);
                rightLeaf.setPage(1);
              }}
            />
          </div>
        </div>
      </Space>

      <FaultListModal
        topTitle="账户添加失败"
        tips={`共计添加${acct_list.length}个账户，成功${
          acct_list.length - faultList.length
        }个，失败${faultList.length}个。可点击再次提交按钮重试。`}
        faultList={faultList}
        visible={isFaultModalVisible}
        onClose={() => setIsFaultModalVisible(false)}
        acctGroupId={Number(acctGroupId)}
        unitLabel={unitLabel}
        onCloseParent={closeModal}
        onRefresh={() => {}}
      />
    </Modal>
  );
});

AddAccountTree.displayName = 'AddAccountTree';
export default memo(AddAccountTree);
