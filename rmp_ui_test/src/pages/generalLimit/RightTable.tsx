// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { message, Pagination, UploadProps } from 'antd';
import ActionButton from './components/ActionButton';
import styles from './styles.less';
import { v4 as uuidv4 } from 'uuid';
import { useMemoizedFn } from 'ahooks';
import {
  alterGeneralLimitDetail,
  alterLimitDetailParams,
  GeneralLimitDetailList,
  GeneralLimitDetailParams,
  queryGeneralLimitDetail,
} from '@/services/generalLimit';
import { handleExecel, getColumns, ResultValiTable } from './untils';
import { PaginationType } from '@/services/typing';
import TableColunms from './components/Table';
import { EditModal, ExportModal } from './components/EditModal';
import { ExportModalType } from '../securityPool/contants/tyeping';
import { RcFile } from 'antd/lib/upload';
import { MenuAuthListParamType } from '../roleManage/contant/typing';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import {
  DeleteConfirm,
  IAction as DeleteConfirmAction,
} from '@/components/DeleteConfirm';
import { BasicColumn } from '@/components/Table';
import {
  ImportModal,
  IAction as ImportModalAction,
} from '@/components/ImportModal';
import BaseSettings from '@config/BaseSettings';

interface Props {
  groupKey: number;
  size: number;
  menuAuth: Nullable<MenuAuthListParamType>;
  dataAuth: boolean;
}

export type GeneraList = GeneralLimitDetailList & { key?: React.Key };

const { assetPrefix } = BaseSettings;

const RightTable: React.FC<Props> = ({
  groupKey,
  size,
  menuAuth,
  dataAuth,
}) => {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState<GeneraList[]>([]);
  const [mode, setMode] = useState(0); // 1 增加  2 修改  3 删除
  const [tableLoading, setTableLoading] = useState(false);
  const [selectItems, setSelectItems] = useState<GeneraList[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const deleteRef = useRef<DeleteConfirmAction>(null);

  const importRef = useRef<ImportModalAction>(null);

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

  const [exportOpen, setExportOpen] = useState(false);

  const [modalObj, setModalObj] = useState<ExportModalType>({
    title: '',
    mode: '',
    hasFooter: false,
  });
  const [fileData, setFileData] = useState<{
    fileList: UploadProps['fileList'];
    transformList: any[];
    showLoading: boolean;
  }>({
    fileList: [],
    transformList: [],
    showLoading: false,
  });

  const getSelectItems = useCallback((recordList: GeneraList[]) => {
    setSelectItems(recordList);
  }, []);
  const onClose = () => {
    setOpen(false);
    setMode(0);
  };
  const onOpen = () => {
    setOpen(true);
  };

  const getTableData = useMemoizedFn(async (page: number, pageSize: number) => {
    try {
      setTableLoading(true);
      if (groupKey === undefined) {
        return;
      }
      const quleQueryParams: GeneralLimitDetailParams = {
        groupId: groupKey,
        pageId: page,
        pageSize,
      };
      if (value) {
        quleQueryParams.filterCondition = {
          securityCode: value,
        };
      }
      const result = await queryGeneralLimitDetail(quleQueryParams);
      if (result.code !== 0) {
        setTableData([]);
        setPagination({
          current: page,
          pageSize,
          total: 0,
        });
        // message.error({
        //   content: `${result.message ?? ''}`,
        // });
        return;
      }
      if (result.data?.resultList && result.data?.resultList.length > 0) {
        const list = result.data?.resultList.map((item) => ({
          key: uuidv4(),
          ...item,
        }));
        setTableData(list);
      } else {
        setTableData([]);
      }
      setPagination({
        current: page,
        pageSize,
        total: result?.data?.totalSize,
      });
    } catch (error) {
      // message.error({ content: `${JSON.stringify(error)}` });
    } finally {
      setSelectItems([]);
      setTableLoading(false);
    }
  });
  const deletData = useMemoizedFn(async () => {
    try {
      const quleQueryParams: alterLimitDetailParams = {
        alterType: 3,
        groupId: groupKey,
      };
      if (selectItems.length > 0) {
        const dataList = selectItems.map((p) => {
          return {
            securityCode: p.securityCode,
            marketId: p.marketId,
            limitValue: p.limitValue,
          };
        });
        quleQueryParams.poolSecurityList = dataList;
      }
      const result = await alterGeneralLimitDetail(quleQueryParams);
      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message ?? ''}`,
        // });
        return;
      }
      if (
        result.data &&
        Array.isArray(result.data.faultList) &&
        result.data.faultList.length > 0
      ) {
        message.error({
          content: `${result.data.faultList[0]?.errorInfo ?? '操作失败'}`,
        });
        refresh();
        return;
      }
      refresh();
      message.success({ content: '删除成功' });
    } catch (error) {
      // message.error({ content: `${JSON.stringify(error)}` });
    } finally {
      getSelectItems([]);
    }
  });

  useEffect(() => {
    getTableData(1, pagination.pageSize);
  }, [value]);

  const beforeUploadFun = async (file: RcFile) => {
    setFileData({
      ...fileData,
      fileList: [],
      transformList: [],
      showLoading: true,
    });
    const isXslx = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ].includes(file.type);
    if (!isXslx) {
      message.error('附件格式错误，请重新上传！');
      return;
    }
    const dataList = await handleExecel(file, getColumns());
    if (Array.isArray(dataList)) {
      const secuPoolData = dataList as ResultValiTable[];
      const secuPoolDataNew = secuPoolData?.map((p) => {
        return {
          ...p,
          key: uuidv4(),
        };
      });
      setModalObj({
        ...modalObj,
        title: '导入标的列表',
        mode: 'Add',
        hasFooter: true,
      });
      setFileData({
        ...fileData,
        transformList: secuPoolDataNew,
        showLoading: false,
      });
      setExportOpen(true);
    } else {
      // 处理数据不符合期望类型的情况
      message.error('导入文件内容的表头不符合预期！');
    }

    return false;
  };

  const refresh = () => {
    setOpen(false);
    if (queryPermission) {
      getTableData(1, pagination.pageSize);
    }
  };

  const updateData = (isOpen: boolean, resList: any) => {
    setExportOpen(isOpen);
    if (isOpen) {
      setModalObj({
        ...modalObj,
        title: '导入结果',
        mode: '',
        hasFooter: false,
      });
      setFileData({ ...fileData, transformList: resList });
    } else if (Array.isArray(resList)) {
      setSelectItems([]);
      refresh();
    }
  };

  useEffect(() => {
    refresh();
  }, [groupKey]);

  return (
    <div className={styles.rigthTableBottom}>
      <ActionButton
        groupKey={groupKey}
        triggerImport={() => {
          if (importRef.current) {
            importRef.current.open();
          }
        }}
        onOpen={onOpen}
        setMode={setMode}
        deletData={() => {
          if (deleteRef.current) {
            deleteRef.current.open(selectItems);
          }
        }}
        selectItems={selectItems}
        pagination={pagination}
        getTableData={async (page, pageSize) => {
          if (queryPermission) {
            getTableData(page, pageSize);
          }
        }}
        setValue={setValue}
        queryAuth={queryPermission}
        operateAuth={operatePermission && dataAuth}
      />
      <TableColunms
        getSelectItems={getSelectItems}
        tableLoading={tableLoading}
        tableData={tableData}
        pagination={pagination}
        setPagination={setPagination}
        size={size}
        checkable={operatePermission && dataAuth}
      />
      <div
        style={{
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
            if (queryPermission) {
              getTableData(page, pageSize);
            }
          }}
        />
      </div>
      <EditModal
        groupKey={groupKey}
        selectRecord={selectItems}
        open={open}
        mode={mode}
        onClose={onClose}
        reFresh={refresh}
      />
      <ExportModal
        groupKey={groupKey}
        title={modalObj.title}
        mode={modalObj.mode}
        updateData={updateData}
        hasFooter={modalObj.hasFooter}
        exportOpen={exportOpen}
        tableData={fileData.transformList}
        tableLoading={fileData.showLoading}
        afterSubmit={() => importRef.current?.close()}
      />
      <DeleteConfirm
        ref={deleteRef}
        columns={getColumns() as BasicColumn[]}
        api={deletData}
        title="删除限仓"
      />
      <ImportModal
        ref={importRef}
        templateDownloadUrl={`${assetPrefix}api/ops/downloadFile?fileName=generalLimitDetailTemplate.xlsx`}
        templateFileName="generalLimitDetailTemplate.xlsx"
        modalProps={{ footer: null }}
        uploadProps={{
          accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
          beforeUpload: beforeUploadFun,
          maxCount: 1,
          showUploadList: false,
        }}
      />
    </div>
  );
};

export default RightTable;
