/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable max-lines */
import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  Form,
  message,
  Space,
  Button,
  Upload,
  Input,
  Popconfirm,
} from '@ht/sprite-ui';
import PoolDetailTable from '@/pages/securityPool/components/RightTable/PoolDetailTable';
import {
  ExportModalType,
  QuerySecuPoolRspDTO,
  SecuPoolDetailDTO,
} from '@/pages/securityPool/contants/tyeping';
import EditPoolLevelModal from '@/pages/securityPool/components/EditPoolLevelModal';
import type { UploadProps } from '@ht/sprite-ui';
import { handleExecel } from '@/utils/transformFiles';
import { RcFile } from '@ht/sprite-ui/lib/upload';
import { useLockFn, useMemoizedFn } from 'ahooks';
import { v4 as uuidv4 } from 'uuid';
import { SearchOutlined } from '@ht-icons/sprite-ui-react';
import BaseSettings from '../../../config/BaseSettings';
import { DictFeKeyEnumType } from '@/utils/dict';
import { useUserRoles } from '@/hooks';
import styles from './style.less';
import { getColumns } from './contants/contants';
import ExportResultModal from './components/RightTable/ExportResultModal';
import { PaginationType } from '@/services/typing';
import { messageDetailInfo } from './components/EditPoolLevelModal/PoolForm/message';
import { usePoolAuthHook } from './contants/useAuthPool';
import useEIP from '@/directives/useEIP';
import ResultModal from './components/RightTable/ResultModal';
import { FaultListType } from '@/services/generalLimit';
import CardTitle from '@/components/CardTitle';
import BaseInfo from './components/BaseInfo';
import { ParseDataType } from './LeftRebuild';
import {
  ImportModal,
  IAction as ImportModalAction,
} from '@/components/ImportModal';
import {
  DeleteConfirm,
  IAction as DeleteConfirmAction,
} from '@/components/DeleteConfirm';
import { BasicColumn } from '@/components/Table';
import {
  alterSecurityPoolDetail,
  exportSecurityPoolDetail,
  querySecurityPoolDetail,
} from '@/services/securityPool/index';

const FormItem = Form.Item;
interface Props {
  selectKey: string;
  [key: string]: any;
  riskAuth: boolean;
  selectInfo: ParseDataType | undefined;
}

const { assetPrefix } = BaseSettings;
const RightTable: React.FC<Props> = ({ selectKey, riskAuth, selectInfo }) => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<QuerySecuPoolRspDTO[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [treeKey, setTreeKey] = useState<number | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [resVisble, setResVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<DictFeKeyEnumType['OPERATION_TYPES']>('ADD');
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [_, eipRef] = useEIP();
  const { editAuth, queryAuth } = usePoolAuthHook();
  const [rowData, setRowData] = useState<QuerySecuPoolRspDTO[]>([]);
  const [modalObj, setModalObj] = useState<ExportModalType>({
    title: '',
    mode: '',
    hasFooter: false,
  });
  const [resultOpen, setResultOpen] = useState(false);
  const [resultData, setResultData] = useState<FaultListType[]>([]);

  const importRef = useRef<ImportModalAction>(null);
  const deletdRef = useRef<ImportModalAction>(null);
  const deletdListRef = useRef<DeleteConfirmAction>(null);

  const [fileData, setFileData] = useState<{
    fileList: UploadProps['fileList'];
    transformList: any[];
    showLoading: boolean;
  }>({
    fileList: [],
    transformList: [],
    showLoading: false,
  });
  const { activeRoleId } = useUserRoles();
  useEffect(() => {
    if (selectKey) {
      setTreeKey(Number(selectKey));
    } else {
      setTreeKey(undefined);
    }
    form.resetFields();
  }, [selectKey]);
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
      const secuPoolData = dataList as QuerySecuPoolRspDTO[];
      const secuPoolDataNew = secuPoolData?.map((p) => {
        return {
          ...p,
          key: uuidv4(),
        };
      });
      setModalObj({
        ...modalObj,
        title: '导入标的列表',
        mode: 'ADD',
        hasFooter: true,
      });
      setFileData({
        ...fileData,
        transformList: secuPoolDataNew,
        showLoading: false,
      });
      setResVisible(true);
    } else {
      // 处理数据不符合期望类型的情况
      message.error('导入文件内容的表头不符合预期！');
    }

    return false;
  };
  const beforeDeleteFun = async (file: RcFile) => {
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
    const dataList = await handleExecel(file, getColumns(), [1, 2]);
    if (Array.isArray(dataList)) {
      const secuPoolData = dataList as QuerySecuPoolRspDTO[];

      const secuPoolDataNew = secuPoolData?.map((p) => {
        return {
          ...p,
          key: uuidv4(),
        };
      });

      setModalObj({
        ...modalObj,
        title: '批量删除标的列表',
        mode: 'DELETE',
        hasFooter: true,
      });
      setFileData({
        ...fileData,
        transformList: secuPoolDataNew,
        showLoading: false,
      });
      setResVisible(true);
    } else {
      // 处理数据不符合期望类型的情况
      message.error('导入文件内容的表头不符合预期！');
    }

    return false;
  };
  const updateData = (newData: any, resList: any, alterType?: number) => {
    setResVisible(newData);
    if (newData) {
      setModalObj({
        ...modalObj,
        title: alterType === 3 ? '批量删除结果' : '导入结果',
        mode: '',
        hasFooter: false,
      });
      setFileData({ ...fileData, transformList: resList });
    } else if (Array.isArray(resList)) {
      setRowData([]);
      getTableData({
        current: 1,
        pageSize: pagination.pageSize,
      });
    }
  };
  const getTableData = useMemoizedFn(
    useLockFn(async (props: PaginationType) => {
      // operateAuth 默认有查询
      if (treeKey && !riskAuth) {
        setTableData([]);
        return;
      }
      const { pageSize, current } = props;
      try {
        setTableLoading(true);
        const res = await querySecurityPoolDetail({
          pageSize: pageSize ?? 20,
          pageId: current ?? 1,
          secuPoolId: treeKey ?? 0,
          filterCondition: {
            marketId: undefined,
            securityCode: form.getFieldValue('securityCode'),
          },
        });
        if (res.code !== 0) {
          setPagination({
            ...pagination,
            pageSize,
            current,
          });
          setTableData([]);
          // message.error(res.message);
          return;
        }
        setPagination({
          current,
          pageSize,
          total: res.data?.totalSize ?? 0,
        });
        if (res.data && res.data.resultList.length > 0) {
          const list = res.data.resultList.map((item: any) => ({
            ...item,
            key: uuidv4(),
          }));
          setTableData(list);
        } else {
          setTableData([]);
          // setPagination({
          //   ...pagination,
          //   current,
          //   pageSize,
          // });
        }
      } catch (error) {
        //  message.error({ content: `${JSON.stringify(error)}` });
      } finally {
        setTableLoading(false);
      }
    })
  );
  const getRowData = useCallback((recordList: QuerySecuPoolRspDTO[]) => {
    setRowData(recordList);
  }, []);
  const delRowData = useCallback(async () => {
    let dataList: SecuPoolDetailDTO[] = [];
    if (rowData.length > 0) {
      dataList = rowData.map((p) => {
        return {
          securityCode: p.securityCode,
          marketId: p.marketId,
          effectBeginDate: p.effectBeginDate,
          effectEndDate: p.effectEndDate,
          remark: p.remark,
        };
      });
    }

    try {
      const securityPoolDetailRes = await alterSecurityPoolDetail({
        modifyType: 3,
        secuPoolId: treeKey ?? 0,
        poolSecurityList: dataList as any[],
      });
      if (
        securityPoolDetailRes.data &&
        securityPoolDetailRes.data.faultList &&
        securityPoolDetailRes.data.faultList.length > 0
      ) {
        openResult(securityPoolDetailRes.data.faultList);
      }
      if (securityPoolDetailRes.code === 145003) {
        message.success(messageDetailInfo(3));

        getTableData({
          current: 1,
          pageSize: pagination.pageSize,
        });
        setRowData([]);
        return;
      } else if (securityPoolDetailRes.code !== 0) {
        // message.error({
        //   content: `${securityPoolDetailRes.message || '未知错误'}`,
        // });
        return;
      }
      getTableData({
        current: 1,
        pageSize: pagination.pageSize,
      });
      message.success({ content: '删除成功' });
    } catch (error) {
      // message.error({ content: `${JSON.stringify(error)}` });
    } finally {
      setRowData([]);
    }
  }, [activeRoleId, treeKey, rowData]);
  const exportFile = async () => {
    try {
      setLoaded(true);
      const res = await exportSecurityPoolDetail({
        secuPoolId: treeKey ?? 0,
      });
      if (res.code !== 0) {
        // message.error(res.message);
      } else {
        const { fileUrl } = res.data;
        // window.open(fileUrl);
        if (fileUrl) {
          location.href = fileUrl;
        }
      }
    } catch (error) {
    } finally {
      setLoaded(false);
    }
  };
  const downloadFile = () => {
    fetch(
      `${assetPrefix}api/ops/downloadFile?fileName=securityPoolDetailTemplate.xlsx`
    )
      .then((response) => response.arrayBuffer()) // 获取二进制数据
      .then((data) => {
        const fileURL = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'securityPoolDetailTemplate.xlsx';
        link.click();
        window.URL.revokeObjectURL(fileURL);
      })
      .catch((error) => {
        console.error('请求失败:', error);
      });
  };
  const openResult = (data: FaultListType[]) => {
    setResultOpen(true);
    setResultData(data);
  };
  const closeResult = () => {
    setResultOpen(false);
    setResultData([]);
    setRowData([]);
    getTableData({
      current: 1,
      pageSize: pagination.pageSize,
    });
  };

  useEffect(() => {
    setPagination({
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    });
    if (treeKey) {
      setRowData([]);

      getTableData({
        current: 1,
        pageSize: pagination.pageSize,
      });
    } else {
      setTableData([]);
    }
  }, [treeKey]);
  return (
    <div className={styles.rightTable}>
      <BaseInfo secuPoolInfo={selectInfo} />

      <div className={styles.rightSpace}>
        {
          <>
            <div className={styles.leftStyle}>
              <CardTitle title="证券列表" style={{ marginRight: '16px' }} />
              {editAuth && treeKey && riskAuth && (
                <Form name="deatailNav" autoComplete="off" form={form}>
                  <FormItem
                    label=""
                    name="securityCode"
                    style={{ marginBottom: 0 }}
                  >
                    <Input
                      placeholder="请输入证券代码"
                      style={{ width: '200px' }}
                      prefix={<SearchOutlined />}
                      onPressEnter={() => {
                        getTableData({
                          current: 1,
                          pageSize: pagination.pageSize,
                        });
                      }}
                      onBlur={() => {
                        getTableData({
                          current: 1,
                          pageSize: pagination.pageSize,
                        });
                      }}
                      allowClear={true}
                    />
                  </FormItem>
                </Form>
              )}
            </div>

            {treeKey && (
              <div className={styles.rigthBtns}>
                {editAuth && treeKey && riskAuth && (
                  <>
                    {queryAuth && riskAuth && (
                      <Button
                        type="primary"
                        onClick={exportFile}
                        loading={loaded}
                      >
                        导出
                      </Button>
                    )}
                    <Button
                      type="primary"
                      ref={eipRef}
                      onClick={() => {
                        setMode('ADD');
                        setRowData([]);
                        setVisible(true);
                      }}
                    >
                      添加
                    </Button>
                    <Button
                      ref={eipRef}
                      onClick={() => {
                        setMode('EDIT');
                        setVisible(true);
                      }}
                      disabled={rowData.length !== 1}
                    >
                      修改
                    </Button>

                    <Button
                      ref={eipRef}
                      onClick={() => {
                        deletdListRef.current?.open(rowData);
                      }}
                      disabled={rowData.length === 0}
                    >
                      删除
                    </Button>

                    <Button
                      ref={eipRef}
                      onClick={() => {
                        deletdRef.current?.open();
                      }}
                      disabled={tableData.length === 0}
                    >
                      导入删除
                    </Button>

                    <Button
                      ref={eipRef}
                      onClick={() => {
                        importRef.current?.open();
                      }}
                    >
                      批量导入
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        }
      </div>
      <PoolDetailTable
        tableLoading={tableLoading}
        tableData={tableData}
        getRowData={getRowData}
        pagination={pagination}
        visible={visible}
        getTableData={getTableData}
        setPagination={setPagination}
      />

      {visible && (
        <EditPoolLevelModal
          mode={mode as 'ADD' | 'EDIT'}
          onClose={() => {
            setVisible(false);
          }}
          reFresh={(p?: any) => {
            if (p === 'AddDetailForm' || p === 'PoolDetailForm') {
              getTableData({
                current: 1,
                pageSize: pagination.pageSize,
              });
            }
          }}
          openResult={openResult}
          treeKey={treeKey}
          selectRecord={rowData[0]}
          workGroupList={[]}
          levelType={mode === 'EDIT' ? 'PoolDetailForm' : 'AddDetailForm'}
          // levelType={'PoolDetailForm'}
        />
      )}
      {resVisble && (
        <ExportResultModal
          title={modalObj.title}
          mode={modalObj.mode}
          hasFooter={modalObj.hasFooter}
          visible={resVisble}
          updateData={updateData}
          tableData={fileData.transformList}
          tableLoading={fileData.showLoading}
          treeKey={treeKey}
          afterSubmit={() => {
            importRef.current?.close();
            deletdRef.current?.close();
          }}
        />
      )}
      <DeleteConfirm
        ref={deletdListRef}
        width={1400}
        columns={getColumns() as BasicColumn[]}
        api={delRowData}
        title="删除证券"
      />
      <ResultModal
        mode={mode}
        visible={resultOpen}
        close={closeResult}
        tableData={resultData}
      />
      <ImportModal
        ref={importRef}
        templateDownloadUrl={`${assetPrefix}api/ops/downloadFile?fileName=securityPoolDetailTemplate.xlsx`}
        templateFileName="securityPoolDetailTemplate.xlsx"
        modalProps={{ footer: null }}
        uploadProps={{
          accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
          beforeUpload: beforeUploadFun,
          maxCount: 1,
          showUploadList: false,
        }}
      />
      <ImportModal
        ref={deletdRef}
        modalProps={{ footer: null }}
        uploadProps={{
          accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
          beforeUpload: beforeDeleteFun,
          maxCount: 1,
          showUploadList: false,
        }}
      />
    </div>
  );
};

export default RightTable;
