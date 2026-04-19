// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useRef, useState } from 'react';
import {
  Form,
  Tabs,
  Table,
  Button,
  Space,
  Modal,
  Pagination,
  message,
  Tooltip,
} from '@ht/sprite-ui';

import SearchForm from '../Form/SearchForm';
import OptinsModal from '../OptinsModal';
import { type PaginationType } from '@/services/typing';

import styles from '../../style.less';
import { v4 as uuidv4 } from 'uuid';
import { ExclamationCircleOutlined } from '@ht-icons/sprite-ui-react';
import {
  exportFutures,
  FutureKindParams,
  FutureOptionList,
  FutureOptionListSet,
  FutureOptionParams,
  LimitList,
  queryFuturDetail,
  queryFutureKind,
  queryFutureOptionLimitDetail,
  queryOptionKind,
  ResultList,
} from '@/services/FutureOption';
import RowTable from '../Table/RowTbale';
import { filterSlect, rowSpanInfo } from '../until';
import { useMemoizedFn } from 'ahooks';
import { downloadByUrl } from '@/utils/file';
import { FunAuthType } from '../auth';
import useEIP from '@/directives/useEIP';

export interface TableListType extends FutureOptionList {
  kindCodeRowSpan: number;
  marketIdRowSpan: number;
  monthRowSpan: number;
  timeRowSpan: number;
}
type Props = {
  tabKey: string;
  groupId: number;
  groupAuth: boolean;
  size: number;
  menuFunAuth: FunAuthType;
};

const Futures: React.FC<Props> = ({
  tabKey,
  groupId,
  size,
  menuFunAuth,
  groupAuth,
}) => {
  const [serchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [allKindCode, setAllKindCode] = useState<ResultList[]>([]);
  const [buttonType, setButtonType] = useState('');
  const [tableData, setTableData] = useState<TableListType[]>([]);
  const [confirm, setConFirm] = useState(false);
  const [selectItems, setSelectItems] = useState<FutureOptionList[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [_, eipRef] = useEIP();
  const handChange = (isopen: boolean) => {
    setOpen(isopen);
  };
  const limitHandle = () => {
    const kinds = selectItems?.map((item) => item.kindCode);
    const isLimit = [...new Set(kinds)]?.length === 1;
    return isLimit;
  };
  const onselectItems = (
    kindIndex: number,
    record: FutureOptionList,
    type?: string
  ) => {
    const _selectItems = filterSlect(tableData, record, kindIndex);
    setSelectItems(_selectItems);
    if (type === 'double') {
      setOpen(true);
      setButtonType('Edit');
    }
  };

  const querySerch = useMemoizedFn(async (page: number, pageSize: number) => {
    try {
      if (!menuFunAuth.queryAuth) {
        setPagination({
          current: page,
          pageSize,
          total: 0,
        });
        setTableData([]);
        return;
      }
      setTableLoading(true);
      const formData = await serchForm.validateFields();
      const params: FutureOptionParams = {
        pageId: page,
        pageSize,
        filterCondition: {
          limitType: Number(tabKey),
          groupId,
          marketId: formData?.marketId ? [formData?.marketId] : [],
          kindCode: formData?.kindCode ? [formData?.kindCode] : [],
        },
      };
      const result = await queryFutureOptionLimitDetail(params);
      if (result.code !== 0) {
        setTableData([]);
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
      if (result.data?.resultList) {
        const typeData = result.data?.resultList.filter(
          (item) => item.limitType.toString() === tabKey
        );
        const data = rowSpanInfo(typeData);
        const keyData = data.map((item) => {
          return {
            ...item,
            key: uuidv4(),
          };
        });
        setTableData(keyData);
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
  const setFuteres = useMemoizedFn(async (data: FutureOptionList[]) => {
    try {
      const limitType = Number(tabKey);
      const _groupId = Number(groupId);
      const formData = await editForm.validateFields();
      const limitList: LimitList[] = data.map((item) => {
        if (buttonType !== 'Delete') {
          return {
            groupId: _groupId,
            limitType,
            limitId: buttonType === 'Edit' ? item.limitId : 0,
            kindCode: formData.kindCode ?? '',
            marketId: Number(formData.marketId) ?? -1,
            monthControlType: item.monthControlType,
            contractMonth: item.contractMonth,
            beginDateType: item.beginDateType,
            beginInfluenceDirection: item.beginInfluenceDirection,
            beginDayOffset: item.beginDayOffset,
            beginMonthOffset: item.beginMonthOffset,
            endDateType: item.endDateType,
            endInfluenceDirection: item.endInfluenceDirection,
            endDayOffset: item.endDayOffset,
            endMonthOffset: item.endMonthOffset,
            thresholdType: item.thresholdType,
            threshold: item.threshold,
            compareDirection: item.compareDirection ?? 0,
            marketPositionQuantity: item.marketPositionQuantity,
          };
        } else {
          return {
            limitId: item.limitId,
            groupId: item.groupId,
          };
        }
      });
      const params: FutureOptionListSet = {
        alterType: buttonType === 'Edit' ? 2 : buttonType === 'Delete' ? 3 : 1,
        limitList,
      };
      const result = await queryFuturDetail(params);
      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message}`,
        // });
        return;
      }
      setOpen(false);
      setConFirm(false);
      message.success('操作成功');
      setSelectItems([]);
      querySerch(1, pagination.pageSize);
    } catch (error) {
      // message.error({ content: `${JSON.stringify(error)}` });
    } finally {
    }
  });

  const doExport = async () => {
    try {
      const result = await exportFutures({
        groupId,
      });
      if (result.code !== 0) {
        // message.error({ content: JSON.stringify(result.message) });
        return;
      }
      const { fileUrl } = result?.data;
      downloadByUrl({ url: fileUrl });
      message.success('下载成功');
    } catch (error) {
      console.error(error);
    }
  };

  const queryAllKind = useMemoizedFn(async () => {
    try {
      const params: FutureKindParams = {
        pageId: 1,
        pageSize: 5000,
      };
      let result: any;
      if (tabKey === '1') {
        result = await queryFutureKind(params);
      } else {
        result = await queryOptionKind(params);
      }
      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message}`,
        // });
        return;
      }
      if (result.data?.resultList) {
        setAllKindCode(result.data?.resultList);
      } else {
        setAllKindCode([]);
      }
    } catch (error) {
      // message.error({ content: `${JSON.stringify(error)}` });
    }
  });
  useEffect(() => {
    queryAllKind();
  }, [queryAllKind, tabKey]);

  useEffect(() => {
    querySerch(1, pagination.pageSize);
  }, [groupId, pagination.pageSize, querySerch, tabKey]);

  return (
    <div className={styles.futures}>
      <div className={styles.topButton}>
        <div style={{ display: 'flex' }}>
          <SearchForm
            form={serchForm}
            buttonType={''}
            selectItems={selectItems}
            tabKey={tabKey}
          />
          <Button
            style={{ marginRight: '15px' }}
            onClick={() => {
              serchForm.resetFields();
            }}
          >
            重置
          </Button>
          {menuFunAuth.queryAuth && (
            <Button
              style={{ marginRight: '15px' }}
              type="primary"
              onClick={() => {
                querySerch(1, pagination.pageSize);
              }}
            >
              查询
            </Button>
          )}
        </div>
        {menuFunAuth.editAuth && groupAuth ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {menuFunAuth.queryAuth && (
              <Button type="primary" onClick={doExport}>
                导出限额
              </Button>
            )}
            <Button
              type="primary"
              ref={eipRef}
              style={{ marginLeft: '15px' }}
              onClick={() => {
                setOpen(true);
                setButtonType('Add');
              }}
            >
              新增限额
            </Button>
            <Button
              type="primary"
              ref={eipRef}
              onClick={() => {
                if (!limitHandle()) {
                  message.warning('请选择具体品种');
                } else {
                  setConFirm(true);
                  setButtonType('Delete');
                }
              }}
              disabled={selectItems?.length === 0}
              style={{ marginLeft: '15px' }}
            >
              删除限额
            </Button>
            <Button
              type="primary"
              ref={eipRef}
              onClick={() => {
                if (!limitHandle()) {
                  message.warning('请选择具体品种');
                } else {
                  setButtonType('Edit');
                  setOpen(true);
                }
              }}
              disabled={selectItems?.length === 0}
              style={{ marginLeft: '15px' }}
            >
              编辑限额
            </Button>
            <Button
              type="primary"
              ref={eipRef}
              onClick={() => {
                if (!limitHandle()) {
                  message.warning('请选择具体品种');
                } else {
                  setButtonType('Copy');
                  setOpen(true);
                }
              }}
              disabled={selectItems?.length === 0}
              style={{ marginLeft: '15px' }}
            >
              复制限额
            </Button>
            <Tooltip placement="left" title={'双击可进行编辑'}>
              <ExclamationCircleOutlined
                style={{
                  color: '#bb744a',
                  fontSize: 16,
                  marginLeft: 16,
                  marginRight: 8,
                }}
              />
            </Tooltip>
          </div>
        ) : null}
      </div>
      <div className={styles.tableBase}>
        <RowTable
          tabKey={tabKey}
          operateAuth={groupAuth && menuFunAuth.editAuth}
          tableLoading={tableLoading}
          allKindCode={allKindCode}
          size={size}
          onselectItems={onselectItems}
          selectItems={selectItems}
          tableData={tableData}
        />
      </div>
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
            paddingTop: '4px',
          }}
          showQuickJumper={true}
          showTotal={(total) => `总数：${total}`}
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={querySerch}
        />
      </div>

      <OptinsModal
        setFuteres={setFuteres}
        form={editForm}
        handChange={handChange}
        open={open}
        allKindCode={allKindCode}
        selectItems={selectItems}
        buttonType={buttonType}
        tabKey={tabKey}
        groupId={groupId}
      />
      <Modal
        open={confirm}
        className={styles.confirmModal}
        centered={true}
        onCancel={() => {
          setConFirm(false);
        }}
        closable={false}
        onOk={() => {
          setFuteres(selectItems);
        }}
      >
        <div style={{ paddingLeft: 24 }}>
          <ExclamationCircleOutlined
            style={{ color: '#bb744a', fontSize: 20, paddingTop: 20 }}
          />
          <span style={{ fontSize: 16, paddingLeft: 10 }}>
            是否确认删除选中项?
          </span>
        </div>
      </Modal>
    </div>
  );
};
export default Futures;
