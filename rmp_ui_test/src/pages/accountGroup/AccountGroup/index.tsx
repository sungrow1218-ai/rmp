import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import withKeepAlive from '@/wrappers/KeepAlive';
import styles from './styles.less';
import { Empty, message } from '@ht/sprite-ui';
import {
  queryAccountGroup,
  ResponseAccountGroupItem,
} from '@/services/accountGroup';
import Params from './Params';
import Sider from './Sider';
import { querySetOfBookbySobId } from '@/services/account';
import { useWorkGroup } from '@/hooks/useWorkGroup';
import { Mode, SelectedItem } from './data';
import EditModal, { IAction as ModalAction } from './EditModal';
import DeleteModal, { IAction as ModalDelAction } from './DeleteModal';
import { useAuthHook } from '@/hooks/useAuthhook';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import Detail from './Detail';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import RuleGroupModal from '../components/RuleGroupModal/RuleGroupModal';
import { useLocation } from '@oula/oula';
import { getUrlParams } from '@/pages/processManage/contant/contants';

const AccountGroup = () => {
  const [accountGroups, setAccountGroups] = useState<
    ResponseAccountGroupItem[]
  >([]);

  const { menuAuth } = useAuthHook();

  const [selectedAcctGroupId, setSelectedAcctGroupId] = useState<number>();

  const [selected, setSelected] = useState<SelectedItem>();

  const [acctType, setAcctType] = useState({});

  const [cacheParams, setCacheParams] = useState<Recordable>();

  const workGroupList = useWorkGroup();

  const modalRef = useRef<ModalAction>(null);

  const modalDelRef = useRef<ModalDelAction>(null);

  const [loading, setLoading] = useState(false);

  const workGroupNameMap = useMemo<Recordable>(
    () =>
      workGroupList.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.workGroupId]: { name: cur.workGroupName, sobId: cur.sobId },
        }),
        {}
      ),
    [workGroupList]
  );

  // 权限-查询
  const queryPermission = useMemo(() => {
    if (menuAuth) {
      const auth =
        menuAuth.functionAuthList?.find(
          (item) => item.functionId === FUNC_TYPE.QUERY
        )?.useAuth === USE_AUTH.USED;
      return !!auth;
    }
    return false;
  }, [menuAuth]);

  const fetch = async (params?: Recordable) => {
    setLoading(true);
    try {
      const res = await queryAccountGroup({
        pageId: 1,
        pageSize: 5000,
        filterCondition: params ? params : undefined,
      });
      if (res.code !== 0) {
        throw Error('获取账户组列表失败');
      }
      if (res.data && res.data.resultList) {
        setAccountGroups(res.data.resultList);
        // 更新

        if (selected) {
          const target = res.data.resultList.find(
            (i) => i.acctGroupId === selected.acctGroupId
          );
          if (target) {
            setSelected((prev) => ({ ...prev, ...target } as SelectedItem));
          }
        }
      } else {
        setAccountGroups([]);
      }
    } catch (error: any) {
      console.error(error);
      // error.message && message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryPermission) {
      fetch();
    }
  }, [queryPermission]);

  useEffect(() => {
    if (selectedAcctGroupId && accountGroups && workGroupNameMap) {
      const target = accountGroups.find(
        (i) => i.acctGroupId === selectedAcctGroupId
      );
      if (target) {
        setSelected({
          ...target,
          sobId: workGroupNameMap[target.workGroupId]
            ? workGroupNameMap[target.workGroupId].sobId
            : undefined,
        });
      }
    }
    if (!selectedAcctGroupId) {
      setSelected(undefined);
    }
  }, [accountGroups, selectedAcctGroupId, workGroupNameMap]);

  useEffect(() => {
    const fetchSobInfo = async () => {
      try {
        const target = workGroupList.find(
          (i) => i.workGroupId === selected?.workGroupId
        );
        if (!target || !target.sobId) return;
        const res = await querySetOfBookbySobId(target.sobId);
        if (res.code !== 0) {
          throw Error('获取账套信息失败');
        }
        let sobInfo: Recordable = {};
        if (res.data && res.data.resultList && res.data.resultList.length > 0) {
          for (const { bookLevelList, bookType } of res.data.resultList[0]
            .bookList) {
            sobInfo = bookLevelList.reduce(
              (prev, cur) => ({
                ...prev,
                [`${bookType}|${cur.bookLevel}`]: cur.bookLevelName,
              }),
              sobInfo
            );
          }
          setAcctType(sobInfo);
        } else {
          setAcctType({});
        }
      } catch (error: any) {
        console.error(error);
        error.message && message.success(error.message);
      }
    };
    if (selected) {
      fetchSobInfo();
    }
  }, [selected?.workGroupId]);

  return (
    <div className={styles.pageStyle} style={{ minWidth: '1600px' }}>
      <div className={styles.pageTitle}>
        账户组管理
        <Popover
          content={
            <div>
              账户组管理功能旨在降低前控规则的设置及维护成本，
              <br />
              通过对账户组的维护，便可实现前控规则在控制账户
              <br />
              范围上的动态更新。同时，账户组的编辑、删除等操
              <br />
              作会依据角色权限进行隔离。
            </div>
          }
        >
          <InfoCircleOutlined
            style={{ marginLeft: '8px', color: '#A1A7AD', cursor: 'pointer' }}
          />
        </Popover>
      </div>
      <div className={styles.filter}>
        <Params
          onChange={(params) => {
            setCacheParams(params);
            if (queryPermission) {
              fetch(params);
            }
          }}
          workGroupList={workGroupList}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.sider}>
          <Sider
            accountGroups={accountGroups}
            onSelect={(val) => setSelectedAcctGroupId(val)}
            onAdd={(workGroupItem) =>
              modalRef.current?.open(Mode.ADD, workGroupItem as any)
            }
            onDelete={(val) => modalDelRef.current?.open(val)}
            filterWorkGroupId={cacheParams?.workGroupId}
            selected={selected}
            menuAuth={menuAuth}
            loading={loading}
            workGroupList={workGroupList}
          />
        </div>
        <div className={styles.detail}>
          {selected ? (
            <Detail
              acctGroup={selected}
              acctType={acctType}
              menuAuth={menuAuth}
              onEdit={(val) => modalRef.current?.open(Mode.EDIT, val)}
            />
          ) : (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Empty image={NoDataSimpleSvg} description={'暂无数据'} />
            </div>
          )}
        </div>
      </div>
      <EditModal
        ref={modalRef}
        onRefresh={(mode, acctGroupId) => {
          if (queryPermission) {
            fetch(cacheParams);
            if (mode === Mode.ADD) {
              setSelectedAcctGroupId(acctGroupId);
            }
          }
        }}
      />
      <DeleteModal
        ref={modalDelRef}
        onRefresh={(acctGroupId) => {
          if (selected && selected.acctGroupId === acctGroupId) {
            setSelectedAcctGroupId(undefined);
          }
          if (queryPermission) {
            fetch(cacheParams);
          }
        }}
      />
    </div>
  );
};

export default withKeepAlive({ cacheKey: KEEPALIVE_CACHE_KEY.ACCOUNT_GROUP })(
  AccountGroup
);
