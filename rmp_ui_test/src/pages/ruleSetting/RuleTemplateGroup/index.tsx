// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.less';
import { Button } from 'antd';
import { BasicForm, FormActionType } from '@/components/Form';
import ColManage from '@/components/ColManage';
import { columnOptions, defaultColumns, searchSchemas } from './data';
import { useHeightResize } from '@/hooks';
import { Mode } from './type';
import TemplateGroupViewMonitor from './TemplateGroupViewMonitor';
import { IRuleConfigurationItem } from '../type';
import { RuleTemplateGroupIDTO } from '@/services/ruleSetting/idto';
import { useSobInfo } from '../components/allSobInfo';
import { forEach } from 'lodash';
import AccountGroupModal from './TemplateGroupView/TabAccountGroup/AccountGroupModal';
import TemplateGroupList, { IAction as TableAction } from './TemplateGroupList';
import TemplateGroupEditMonitor from './TemplateGroupEditMonitor';
import { useAuthHook } from '@/hooks/useAuthhook';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import useEIP from '@/directives/useEIP';

interface IProps {
  workGroupId?: number;
  ruleTypeTree: IRuleConfigurationItem[];
  refresh: () => void;
}

const RuleTemplateGroup: React.FC<IProps> = ({
  workGroupId,
  ruleTypeTree,
  refresh,
}) => {
  const tableRef = useRef<TableAction>(null);
  const formRef = useRef<FormActionType>(null);
  const domRef = useRef(null);
  const domHeight = useHeightResize(domRef);
  const [openAccount, setOpenAccount] = useState(false);

  const [showColumns, setShowColumns] = useState<string[]>(
    columnOptions.map((i) => i.value)
  );

  const [editVisable, setEditVisable] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<Mode.ADD | Mode.EDIT | Mode.CLONE>(
    Mode.ADD
  );

  const [viewVisable, setViewVisable] = useState<boolean>(false);

  const [selectedGroup, setSelectedGroup] = useState<RuleTemplateGroupIDTO>();

  useEffect(() => {
    if (workGroupId) {
      tableRef.current?.reload();
    }
  }, [workGroupId]);

  const allSobInfo = useSobInfo();
  const accountType = useMemo(() => {
    const accType: {
      [key: string]: string;
    } = {};
    if (allSobInfo) {
      const workGroupInfo = allSobInfo.find(
        (item: any) => item.workGroupId === workGroupId
      );
      forEach(workGroupInfo?.bookList, (item) => {
        forEach(item.bookLevelList, (level) => {
          const lable = `${item.bookType}|${level.bookLevel}`;
          accType[lable] = level.bookLevelName;
        });
      });
    }
    return accType;
  }, [allSobInfo]);

  const [_, eipRef] = useEIP();

  const { menuAuth } = useAuthHook();

  // 权限-读写
  const operatePermission = useMemo(() => {
    if (menuAuth) {
      const auth =
        menuAuth.functionAuthList?.find(
          (item) => item.functionId === FUNC_TYPE.OPERATE
        )?.useAuth === USE_AUTH.USED;
      return !!auth;
    }
    return false;
  }, [menuAuth]);

  return (
    <>
      <div
        className={styles.content}
        style={{ display: editVisable ? 'none' : 'flex' }}
      >
        <div className={styles.header}>
          <div className={styles.text}>
            <p>多个规则类型模板创建的指标组</p>
            <div className={styles.desc}>
              通过预定义模板批量创建风控指标，简化配置流程
            </div>
          </div>
          <div className={styles.action}>
            {operatePermission ? (
              <Button
                type="primary"
                ref={eipRef}
                onClick={() => {
                  setEditMode(Mode.ADD);
                  setSelectedGroup(undefined);
                  setTimeout(() => setEditVisable(true), 50);
                }}
              >
                创建新模板组
              </Button>
            ) : null}
            <ColManage
              customKey="ruleTemplateGroup"
              columns={columnOptions}
              onColumnChange={(val) =>
                setShowColumns(val.filter((i) => i.checked).map((i) => i.value))
              }
            />
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.search}>
            <BasicForm ref={formRef} layout="inline" schemas={searchSchemas} />
            <div>
              <Button
                style={{ marginRight: '16px' }}
                onClick={() => {
                  formRef.current?.resetFields();
                  tableRef.current?.reload({
                    pageId: 1,
                    ...formRef.current?.getFieldsValue(),
                  });
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  tableRef.current?.reload({
                    pageId: 1,
                    ...formRef.current?.getFieldsValue(),
                  });
                }}
              >
                查询
              </Button>
            </div>
          </div>
          <div className={styles.table} ref={domRef}>
            <TemplateGroupList
              ref={tableRef}
              workGroupId={workGroupId}
              inputColumns={defaultColumns.filter((i: Recordable) =>
                showColumns.includes(i.dataIndex)
              )}
              domHeight={domHeight}
              onView={(record) => {
                setSelectedGroup(record);
                setViewVisable(true);
              }}
              onBind={(record) => {
                setSelectedGroup(record);
                setOpenAccount(true);
              }}
              onEdit={(record) => {
                setEditMode(Mode.EDIT);
                setSelectedGroup(record);
                setTimeout(() => setEditVisable(true), 50);
              }}
              onClone={(record) => {
                setEditMode(Mode.CLONE);
                setSelectedGroup(record);
                setTimeout(() => setEditVisable(true), 50);
              }}
              onDelete={() => refresh()}
            />
          </div>
        </div>
      </div>
      {/* 编辑模板 */}
      {editVisable && workGroupId && (
        <TemplateGroupEditMonitor
          mode={editMode}
          onVisableChange={(open) => setEditVisable(open)}
          workGroupId={workGroupId}
          ruleTypeTree={ruleTypeTree}
          groupInfo={selectedGroup}
          onRefresh={() => {
            tableRef.current?.reload();
            refresh();
          }}
        />
      )}
      {/* 展示模板 */}
      {viewVisable && workGroupId && selectedGroup && (
        <TemplateGroupViewMonitor
          onVisableChange={(open) => setViewVisable(open)}
          ruleTypeTree={ruleTypeTree}
          groupInfo={selectedGroup}
          accountType={accountType}
          workGroupId={workGroupId}
          allSobInfo={allSobInfo}
        />
      )}
      <AccountGroupModal
        reFetchTable={() => {
          tableRef.current?.reload();
        }}
        open={openAccount}
        setOpen={setOpenAccount}
        accountType={accountType}
        allSobInfo={allSobInfo}
        ruleTemplateGroup={selectedGroup}
      />
    </>
  );
};

export default RuleTemplateGroup;
