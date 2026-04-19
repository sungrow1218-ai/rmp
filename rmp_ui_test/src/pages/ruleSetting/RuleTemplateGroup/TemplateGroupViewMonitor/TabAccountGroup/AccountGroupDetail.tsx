import { BasicForm, FormActionType } from '@/components/Form';
import { getSystemNameById, useSystemInfo } from '@/hooks/useSystemInfo';
import { Mode } from '@/pages/accountGroup/AccountGroup/data';
import EditModal, {
  IAction as ModalAction,
  SubmitAcctGroupAfterType,
} from '@/pages/accountGroup/AccountGroup/EditModal';
import AddAccountTree, {
  AddAccountAction,
} from '@/pages/accountGroup/components/AddAccountTree/AddAccountTree';
import { useSobInfo } from '@/pages/ruleSetting/components/allSobInfo';
import { BookTypeEnum } from '@/pages/ruleSetting/components/RuleDimensionControl/component/ControlAcctTypeSelect';
import { querySetOfBook, SobInfo } from '@/services/account';
import {
  queryAccountGroup,
  modifyAccountGroupRelation,
  modifyAccountGroupRelationParams,
  ResponseAccountGroupItem,
  AcctItem,
  queryAccountGroupDetail,
} from '@/services/accountGroup';
import {
  RuleTemplateGroupIDTO,
  UnBondAccountGroupData,
} from '@/services/ruleSetting/idto';
import { PaginationType } from '@/services/typing';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import { Modal } from '@ht/sprite-ui';
import { useMemoizedFn } from 'ahooks';
import {
  Button,
  message,
  Pagination,
  Radio,
  RadioChangeEvent,
  Switch,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface IProps {
  accountGroup?: UnBondAccountGroupData;
  open: boolean;
  setOpen: (value: boolean) => void;
  accountType?: { [key: string]: string };
}

const AccountGroupDetail: React.FC<IProps> = ({
  open,
  setOpen,
  accountGroup,
  accountType,
}) => {
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState<AcctItem[]>([]);
  const systemInfo = useSystemInfo();
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const getColumns = useMemo(() => {
    const columns: ColumnsType<AcctItem> = [
      {
        dataIndex: 'acctCode',
        title: '账户编码',
        align: 'left',
        render: (value) => value || '--',
      },
      {
        dataIndex: 'acctName',
        title: '账户名称',
        align: 'left',
        ellipsis: true,
        render: (value) => value || '--',
      },
      {
        dataIndex: 'bookType',
        title: '账户类型',
        align: 'left',
        render: (value) =>
          accountType
            ? accountType[
                `${accountGroup?.bookType ?? ''}|${
                  accountGroup?.bookLevel ?? ''
                }`
              ]
            : '',
      },
      {
        dataIndex: 'extSysId',
        title: '交易系统',
        align: 'left',
        render: (value) => getSystemNameById(value, systemInfo) || '--',
      },
    ];
    if (accountGroup?.bookType === BookTypeEnum.TRADE_ACCOUNT) {
      columns.push({
        dataIndex: 'marketId',
        title: '交易市场',
        render: (value) =>
          transformDictCodeToNameHelper(String(value), TRADING_MARKETS) || '--',
      });
    }

    return columns;
  }, [accountGroup, systemInfo, accountType]);

  const queryAccountGroupRequest = useMemoizedFn(
    async (page: number, pageSize: number) => {
      try {
        setLoading(true);
        if (!accountGroup) return;
        const res = await queryAccountGroupDetail({
          pageId: page,
          pageSize,
          authFlag: 1,
          filterCondition: {
            acctGroupId: accountGroup.accountGroupId,
          },
        });
        if (res.code !== 0) {
          setTableData([]);
          return;
        }
        const _data = res?.data?.resultList ?? [];
        setTableData(_data);
        setPagination({
          current: page,
          total: res.data.totalSize,
          pageSize,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  );

  useEffect(() => {
    if (accountGroup) {
      queryAccountGroupRequest(1, pagination.pageSize);
    }
  }, [accountGroup]);

  return (
    <div>
      <Modal
        title={'账户列表'}
        open={open}
        width={1200}
        onCancel={() => setOpen(false)}
        footer={
          <>
            <Button type="primary" onClick={() => setOpen(false)}>
              确认
            </Button>
          </>
        }
        destroyOnClose={true}
      >
        <Table
          columns={getColumns}
          loading={loading}
          rowKey={'acctGroupId'}
          scroll={{
            y: 450,
          }}
          dataSource={tableData}
          size="middle"
          pagination={false}
        />
        <div
          style={{
            paddingTop: '10px',
            display: 'flex',
            justifyContent: 'right',
          }}
        >
          <Pagination
            pageSizeOptions={['10', '20', '50', '100']}
            showSizeChanger={true}
            style={{
              paddingTop: '5px',
            }}
            showQuickJumper={true}
            showTotal={(total) => `总数：${total}`}
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={(page, pageSize) => {
              queryAccountGroupRequest(page, pageSize);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AccountGroupDetail;
