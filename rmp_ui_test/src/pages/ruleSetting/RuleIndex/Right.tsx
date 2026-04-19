// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { message, FormInstance } from 'antd';
import { type WorkGroupList } from '@/services/rule';
import { type PaginationType } from '@/services/typing';
import { useMemoizedFn } from 'ahooks';
import { useSobInfo } from '../components/allSobInfo';

import TableSearch from '../components/RuleRightTable/TableSearch';
import TableData from '../components/RuleRightTable/TableData';

import styles from './styles.less';
import { SobInfo } from '@/services/account';
import { messageInfo } from '../components/EditRuleModal/RuleTypeEditForm/message';
import { useAuthHook } from '@/hooks/useAuthhook';
import useRefHeightResize from '@/hooks/useRefHeightResize';
import { v4 as uuidv4 } from 'uuid';
import { alterRuleSetting, queryRuleSetting } from '@/services/ruleSetting';
import { QueryRuleSettingRspDTO } from '@/services/ruleSetting/dto';
import { Mode } from '../type';

interface FormDataType {
  [key: string]: any;
}
export interface DataInstAuth {
  dataInstId: number;
  activeFunc: boolean;
  deleteFunc: boolean;
  editFunc: boolean;
  copyFunc: boolean;
  previewFunc: boolean;
}
export const confirmRuleType = (keys: string[]) => {
  const ids = keys?.map((item) => {
    const idObj = item.split('|') ?? [-1, 0];
    return {
      workGroupId: idObj[0],
      ruleType: idObj[1],
    };
  });
  const _workGroupList = new Map();
  ids.forEach((item) => {
    const { workGroupId, ruleType } = item;
    if (_workGroupList.has(workGroupId)) {
      _workGroupList.get(workGroupId).push(ruleType);
    } else {
      _workGroupList.set(workGroupId, [ruleType]);
    }
  });
  const workGroupList: WorkGroupList[] = [];
  _workGroupList.forEach((typeArr, id) => {
    workGroupList.push({ workGroupId: Number(id), ruleType: typeArr });
  });
  return workGroupList;
};

interface IProps {
  handClickAll: () => void;
  isBackTreeKey: React.MutableRefObject<any>;
  workGroupRuleType: WorkGroupList[];
  form: FormInstance;
  isVisible: boolean;
  showColumns: string[];
  setMode: (value: Mode) => void;
  setEditFormData: (value: QueryRuleSettingRspDTO | null) => void;
  setVisible: (value: boolean) => void;
  onDeleteRefresh: () => void;
}

export interface IAction {
  refetch: () => void;
}

const RightTable = forwardRef<IAction, IProps>(
  (
    {
      handClickAll,
      isBackTreeKey,
      workGroupRuleType,
      form,
      isVisible,
      showColumns,
      setMode,
      setEditFormData,
      setVisible,
      onDeleteRefresh,
    },
    ref
  ) => {
    const [tableList, setTableList] = useState<QueryRuleSettingRspDTO[]>([]);
    const [tableLoading, setTableLoading] = useState<boolean>(false);

    const [pagination, setPagination] = useState<PaginationType>({
      current: 1,
      pageSize: 20,
      total: 0,
    });

    const functionAuthList = useAuthHook();

    const sobInfo = useSobInfo();

    const funcAuth = useMemo(() => {
      const authList = functionAuthList
        ? functionAuthList.menuAuth?.functionAuthList
        : [];
      const editAuth =
        authList?.find((item) => item.functionId === 1)?.useAuth === 1;
      const queryAuth =
        authList?.find((item) => item.functionId === 2)?.useAuth === 1;
      return {
        editAuth,
        queryAuth,
      };
    }, [functionAuthList]);
    const resetForm = useCallback(() => {
      console.log('trigger reset');
      form.resetFields();
    }, [form]);
    const onSearch = useMemoizedFn(async (page: number, pageSize: number) => {
      try {
        if (!funcAuth?.queryAuth || !workGroupRuleType) {
          return;
        }
        setTableLoading(true);
        let quleQueryParams: any = null;

        const formData: FormDataType = await form.validateFields();
        const filterCondition: { [key: string]: any } = {};
        for (const key of Object.keys(formData)) {
          if (
            (typeof formData[key] === 'string' && formData[key].trim()) ||
            typeof formData[key] === 'number' ||
            (Array.isArray(formData[key]) && formData[key].length > 0)
          ) {
            if (!(key.includes('tradeInput') || key.includes('manageInput'))) {
              filterCondition[key] = formData[key];
            }
          }
          // ruleId转数组形式
          if (key === 'ruleId' && formData.ruleId) {
            filterCondition.ruleId = [Number(formData.ruleId)];
          }
        }
        filterCondition.workGroupList = workGroupRuleType;
        if (!filterCondition.workGroupList?.length) {
          return;
        }
        if (
          formData?.ruleType &&
          Array.isArray(formData.ruleType) &&
          formData.ruleType.length > 0
        ) {
          filterCondition.workGroupList = workGroupRuleType.map((p) => {
            return {
              ...p,
              ruleType: formData.ruleType,
            };
          });
          delete filterCondition.ruleType;
        }
        if (
          formData.createDate &&
          Array.isArray(formData.createDate) &&
          formData.createDate.length > 0
        ) {
          filterCondition.createBeginDate =
            formData.createDate[0].format('YYYYMMDD');
          filterCondition.createEndDate =
            formData.createDate[1].format('YYYYMMDD');
          delete filterCondition.createDate;
        }
        if (
          formData.updateDate &&
          Array.isArray(formData.updateDate) &&
          formData.updateDate.length > 0
        ) {
          filterCondition.updateBeginDate =
            formData.updateDate[0].format('YYYYMMDD');
          filterCondition.updateEndDate =
            formData.updateDate[1].format('YYYYMMDD');
          delete filterCondition.updateDate;
        }
        if (
          formData.controlType &&
          Array.isArray(formData.controlType) &&
          formData.controlType.length > 0
        ) {
          const acctControlClass = formData.controlType?.map((p: string) => {
            if (p.length > 2) {
              const [bookLevel, bookType] = p.split('|');
              return {
                controlAcctType: Number(bookType) === 1 ? 2 : 1,
                acctLevel: Number(bookLevel),
              };
            } else {
              return {
                controlAcctType: Number(p),
              };
            }
          });
          filterCondition.acctControlClass = acctControlClass;
          delete filterCondition.controlType;
        }
        quleQueryParams = {
          pageId: page,
          pageSize,
          filterCondition,
        };
        const result = await queryRuleSetting(quleQueryParams);
        if (result.code !== 0) {
          setTableList([]);
          setPagination({
            current: page,
            pageSize,
            total: 0,
          });
          // message.error({
          //   content: `${result.message}`,
          // });
          return;
        }

        if (result.data?.resultList?.length) {
          setTableList(result.data?.resultList);
        } else {
          setTableList([]);
        }
        setPagination({
          current: page,
          pageSize,
          total: result?.data?.totalSize,
        });
      } catch (error) {
      } finally {
        setTableLoading(false);
      }
    });
    const tableData = useMemo(() => {
      const _list = tableList.map((item) => ({
        ...item,
        key: uuidv4(),
        sobInfo: sobInfo.find(
          (sobItem) => sobItem?.workGroupId === item.workGroupId
        ) as SobInfo,
      }));
      return _list;
    }, [tableList, sobInfo]);

    const refetch = useCallback(() => {
      onSearch(1, pagination.pageSize);
    }, [onSearch, pagination.pageSize]);

    useImperativeHandle(ref, () => ({
      refetch,
    }));

    const onDelete = useMemoizedFn(async (record: QueryRuleSettingRspDTO) => {
      try {
        const ruleQueryParams = {
          alterType: 3,
          workGroupId: record.workGroupId,
          operatorCode: '123',
          ruleBaseInfo: record?.ruleBaseInfo,
        };
        const result = await alterRuleSetting(ruleQueryParams);
        if (result.code === 145003) {
          message.success({ content: messageInfo(3) });
          refetch();
          return;
        } else if (result.code !== 0) {
          // message.error({
          //   content: `${result.message}`,
          // });
          return;
        }
        refetch();
        onDeleteRefresh();
        message.success({ content: '删除成功' });
      } catch (error) {}
    });
    useEffect(() => {
      if (isBackTreeKey.current) return;
      if (funcAuth.queryAuth) {
        onSearch(1, pagination.pageSize);
      }
    }, [workGroupRuleType]);

    const cardRef = useRef(null);
    const size = useRefHeightResize(cardRef);

    const isSelectRuleTypeId = useMemo(() => {
      if (workGroupRuleType && workGroupRuleType.length === 1) {
        if (workGroupRuleType[0].ruleType.length === 1) {
          return workGroupRuleType[0].ruleType[0];
        }
        return false;
      }
      return false;
    }, [workGroupRuleType]);

    return (
      <div className={styles.rightTable}>
        <TableSearch
          pagination={pagination}
          onSearch={onSearch}
          form={form}
          workGroupRuleType={workGroupRuleType}
          funcAuth={funcAuth}
          resetForm={resetForm}
          isSelectRuleTypeId={isSelectRuleTypeId}
          handClickAll={handClickAll}
          style={{
            boxShadow: isVisible ? 'none' : '0 4px 8px 0 rgba(0, 0, 0, 0.14)',
          }}
        />
        <div
          ref={cardRef}
          className={styles.tableBox}
          style={{
            boxShadow: isVisible ? 'none' : '0 4px 8px 0 rgba(0, 0, 0, 0.14)',
          }}
        >
          <TableData
            setEditFormData={setEditFormData}
            setMode={setMode}
            onDelete={onDelete}
            setVisible={setVisible}
            tableData={tableData}
            tableLoading={tableLoading}
            refetch={refetch}
            size={size}
            sobInfo={sobInfo}
            pagination={pagination}
            onSearch={onSearch}
            funcAuth={funcAuth}
            showColumns={showColumns}
          />
        </div>
      </div>
    );
  }
);
export default RightTable;
