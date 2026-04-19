// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */

import React, { useContext, useEffect, useState } from 'react';
import { AcctAuthAction, AcctItem, ExtSystemItem } from '../data';
import styles from './styles.less';
import { Button, Form, Input, Pagination, Select, Spin } from '@ht/sprite-ui';
import TreeTable from '../TreeTable';
import { PaginationType } from '@/services/typing';
import { BookTypeEnum } from '@/pages/ruleSetting/components/RuleDimensionControl/component/ControlAcctTypeSelect';
import { TRADING_MARKETS } from '@/utils/dict';
import {
  AcctAuthItem,
  alterRoleAccountAuthority,
  queryManageAccountTree,
  queryTradeAccountTree,
} from '@/services/roleManage';
import { AccountTreeItem } from '@/pages/roleManage/contant/typing';
import { SearchOutlined } from '@ht-icons/sprite-ui-react';
import { ListContext } from '@/hooks/useListClick';
import { transformDictToSelectOptions } from '@/utils/utils';

interface IProps {
  system: ExtSystemItem;
  queryRoleId: number;
}

const AccountPanel: React.FC<IProps> = ({ system, queryRoleId }) => {
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [accountTree, setAccountTree] = useState<AccountTreeItem[]>([]);

  const [account, setAccount] = useState<AcctItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const { authState, refreshAuthState } = useContext(ListContext);

  // ✅ 提取查询逻辑为独立函数，便于复用
  const querySearch = async (pageId: number, pageSize: number) => {
    try {
      setLoading(true);
      const params = await form.validateFields();
      if (params.marketId) {
        params.marketId = [params.marketId];
      }

      const api =
        system.bookType === BookTypeEnum.MANAGE_ACCOUNT
          ? queryManageAccountTree
          : queryTradeAccountTree;

      const res = await api({
        pageId,
        pageSize,
        filterCondition: { ...params, extSysId: [system.extSysId] },
      });

      if (res.code !== 0) {
        throw new Error(
          system.bookType === BookTypeEnum.MANAGE_ACCOUNT
            ? '查询管理账户树错误'
            : '查询交易账户树错误'
        );
      }

      const resultList = res.data?.resultList || [];
      const totalSize = res.data?.totalSize || 1;

      // 格式化 parentAcctCode
      const treeList = resultList.map((i) => ({
        ...i,
        parentAcctCode: i.parentAcctCode
          ? `${i.parentAcctCode}|${i.bookLevel + 1}|${i.marketId || -1}`
          : '',
      }));

      if (pageId === 1) {
        setAccountTree([
          {
            bookLevel: -1,
            acctCode: '-1',
            acctName: '全部账户',
            marketId: -1,
            parentAcctCode: '',
            extSysId: system.extSysId,
            bookLevelName: '',
          },
          ...treeList,
        ]);
      } else {
        setAccountTree(treeList);
      }

      setPagination({ current: pageId, pageSize, total: totalSize });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 监听 system 变化：只要 system（extSysId 或 bookType）变了，就重新加载
  // 🔥 这是核心修改：原来是监听 queryRoleId，现在改为监听 system
  useEffect(() => {
    if (!system?.extSysId || !queryRoleId) return;

    const fetch = async () => {
      try {
        setLoading(true);
        // 重置分页
        setPagination((prev) => ({ ...prev, current: 1 }));
        // 查询账户树
        await querySearch(1, 10);
        // 刷新权限状态
        refreshAuthState();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [system?.extSysId, system?.bookType, queryRoleId]); // 🔥 依赖 system.extSysId 和 bookType

  // ✅ 监听 authState 变化，更新已授权账户列表
  useEffect(() => {
    if (authState) {
      const list: AcctItem[] = authState.acctAuthList
        .filter(
          (item) =>
            item.extSysId === system.extSysId &&
            item.bookType === system.bookType
        )
        .map((item) => ({
          acctCode: item.acctCode,
          bookLevel: item.bookLevel,
          marketId: item.marketId,
        }));
      setAccount(list);
    }
  }, [authState, system?.extSysId, system?.bookType]);

  // ✅ 处理权限变更
  const handleChange = async (action: AcctAuthAction) => {
    const acctAuthAction: {
      alterRoleId: number;
      addAuthList: AcctAuthItem[];
      deleteAuthList: AcctAuthItem[];
    } = { alterRoleId: queryRoleId, addAuthList: [], deleteAuthList: [] };

    if (action.addAcct) {
      acctAuthAction.addAuthList = action.addAcct.map((i) => ({
        ...i,
        bookType: system.bookType,
        extSysId: system.extSysId,
      }));
    }
    if (action.deleteAcct) {
      acctAuthAction.deleteAuthList = action.deleteAcct.map((i) => ({
        ...i,
        bookType: system.bookType,
        extSysId: system.extSysId,
      }));
    }

    try {
      await alterRoleAccountAuthority(acctAuthAction);
      refreshAuthState();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.accountPanel}>
      <div className={styles.search}>
        <div className={styles.title}></div>
        <Form form={form} layout={'inline'}>
          {system.bookType === BookTypeEnum.MANAGE_ACCOUNT ? (
            <>
              <Form.Item name={'acctCode'}>
                <Input
                  placeholder="输入账户编码"
                  style={{ width: 160 }}
                  prefix={<SearchOutlined />}
                  allowClear={true}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item name={'acctName'}>
                <Input
                  placeholder="输入账户名称"
                  style={{ width: 160 }}
                  prefix={<SearchOutlined />}
                  allowClear={true}
                  autoComplete="off"
                />
              </Form.Item>
            </>
          ) : null}
          {system.bookType === BookTypeEnum.TRADE_ACCOUNT ? (
            <>
              <Form.Item name={'marketId'}>
                <Select
                  options={transformDictToSelectOptions(
                    TRADING_MARKETS.map((i) => i)
                  )}
                  placeholder={'请选择交易市场'}
                  allowClear={true}
                  suffixIcon={<SearchOutlined />}
                  style={{ width: 140 }}
                />
              </Form.Item>
              <Form.Item name={'acctCode'}>
                <Input
                  placeholder="输入账户编码"
                  style={{ width: 140 }}
                  prefix={<SearchOutlined />}
                  allowClear={true}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item name={'acctName'}>
                <Input
                  placeholder="输入账户名称"
                  style={{ width: 140 }}
                  prefix={<SearchOutlined />}
                  allowClear={true}
                  autoComplete="off"
                />
              </Form.Item>
            </>
          ) : null}
          {/* ✅ 可选：保留“查询”按钮作为手动刷新 */}
          <Form.Item>
            <Button type="primary" onClick={() => querySearch(1, 10)}>
              查询
            </Button>
          </Form.Item>
          <Form.Item style={{ marginRight: 0 }}>
            <Button
              onClick={() => {
                form.resetFields();
                querySearch(1, 10);
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className={styles.tree}>
        <TreeTable
          treeData={accountTree}
          bookType={system.bookType}
          value={account}
          onChange={handleChange}
        />
      </div>

      <div className={styles.pagination}>
        <Pagination
          pageSizeOptions={['10', '20', '50', '100']}
          showSizeChanger={true}
          style={{ paddingTop: '5px' }}
          showTotal={(total) => `总数：${total}`}
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={querySearch}
          showLessItems={true}
          showQuickJumper={true}
        />
      </div>

      {loading ? (
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spin />
        </div>
      ) : null}
    </div>
  );
};

export default AccountPanel;
