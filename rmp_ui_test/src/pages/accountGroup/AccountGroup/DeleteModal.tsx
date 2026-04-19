import { BasicColumn, BasicTable } from '@/components/Table';
import {
  alterAccountGroup,
  queryReferenceByRiskRule,
  ReferenceItem,
} from '@/services/accountGroup';
import { Alert, message, Modal } from '@ht/sprite-ui';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { TreeData } from './data';
import styles from './styles.less';

export interface IProps {
  onRefresh: (acctGroupId: number) => void;
}

export interface IAction {
  open: (record: TreeData) => void;
}

const DeleteModal = forwardRef<IAction, IProps>(({ onRefresh }, ref) => {
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState<ReferenceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [acctGroup, setAcctGroup] = useState<TreeData>();

  const getColumns = useMemo<BasicColumn[]>(
    () => [
      { dataIndex: 'acctGroupId', title: '账户组ID', align: 'left' },
      {
        dataIndex: 'acctGroupName',
        title: '账户组名称',
        align: 'left',
        ellipsis: true,
      },
      {
        dataIndex: 'ruleId',
        title: '所属编号',
        align: 'left',
        render: (value) => value || '无',
      },
      {
        dataIndex: 'manageRuleType',
        title: '管理的规则类型',
        align: 'left',
        render: (value) => (value === 1 ? '单规则设置' : '规则模板组'),
      },
      {
        dataIndex: 'ruleName',
        title: '所属名称',
        align: 'left',
        render: (value) => value || '无',
      },
      {
        dataIndex: 'status',
        title: '规则状态',
        align: 'left',
        render: (value) => {
          if (value === 0) {
            return (
              <div className={`${styles.statusBar} ${styles.disable}`}>
                <div className={styles.dot}></div>
                <div>禁用</div>
              </div>
            );
          } else {
            return (
              <div className={`${styles.statusBar} ${styles.enable}`}>
                <div className={styles.dot}></div>
                <div>启用</div>
              </div>
            );
          }
        },
      },
      {
        dataIndex: 'approvalStatus',
        title: '审批状态',
        align: 'left',
        render: (value) => {
          if (value === '1') {
            return '审批中';
          } else if (value === '0') {
            return '已审批';
          } else {
            return <></>;
          }
        },
      },
    ],
    []
  );

  useImperativeHandle(ref, () => ({
    open: async (record) => {
      setOpen(true);
      setAcctGroup(record);
      try {
        setLoading(true);
        const res = await queryReferenceByRiskRule(record.acctGroupId!);
        if (res.code !== 0) {
          throw Error('查询引用的规则失败');
        }
        setTableData(res.data.resultList || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  }));

  const canDelete = useMemo(() => tableData.length === 0, [tableData]);

  return (
    <Modal
      title={'删除账户组'}
      open={open}
      width={1200}
      onCancel={() => setOpen(false)}
      okButtonProps={{ loading: btnLoading, disabled: !canDelete }}
      onOk={async () => {
        try {
          setBtnLoading(true);
          const param = {
            alterType: 3,
            workGroupId: acctGroup!.workGroupId,
            acctGroupId: acctGroup!.acctGroupId!,
          };
          const res = await alterAccountGroup(param);
          if (res.code !== 0) {
            throw Error('删除账户组失败');
          }
          message.success('操作成功');
          setOpen(false);
          onRefresh(acctGroup!.acctGroupId!);
        } catch (error: any) {
          console.error(error);
        } finally {
          setBtnLoading(false);
        }
      }}
    >
      <Alert
        message="删除账户组前，请先解除关联规则中绑定的账户组，否则风控规则将失效"
        type="warning"
        showIcon={true}
        closable={true}
        style={{ marginBottom: '16px' }}
        banner={true}
      />
      <BasicTable
        columns={getColumns}
        dataSource={tableData}
        loading={loading}
        pagination={false}
      />
    </Modal>
  );
});

export default DeleteModal;
