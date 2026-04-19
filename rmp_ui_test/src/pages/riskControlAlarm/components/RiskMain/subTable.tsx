// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react';
import { FormInstance, Table, Pagination } from 'antd';
import { TRADING_MARKETS } from '@/utils/dict';
import { ExtSysItem } from '@/services/account';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../style.less';

import { FormData, TableDataList } from './RiskMain';
import { useMemoizedFn } from 'ahooks';
import {
  ColumnConfig,
  querySummaryRiskDetail,
  SummaryDetailCondition,
} from '@/services/riskControlAlarm';

import { PaginationType } from '@/services/typing';

import { Resizable } from 'react-resizable';
import { RiskLevel } from '@/pages/ruleSetting/RuleTemplateGroup/type';

const ResizableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0} // 垂直方向不进行拖拽
      onResize={onResize}
      axis="x"
      draggableOpts={{ enableUserSelectHack: false }}
      handle={<div className="resizable-handler"></div>}
    >
      <th {...restProps} />
    </Resizable>
  );
};

export const transformForm = (
  formData: FormData,
  params: SummaryDetailCondition
) => {
  if (formData.ruleType && formData.ruleType.length > 0) {
    params.ruleType = formData.ruleType;
  }
  if (formData.marketId && formData.marketId.length > 0) {
    params.marketId = formData.marketId.map((it) => Number(it));
  }
  if (formData.warnOperation && formData.warnOperation.length > 0) {
    params.warnOperation = formData.warnOperation.map((it) => Number(it));
  }
  if (formData.entrustCode?.trim()) {
    params.entrustCode = formData.entrustCode;
  }
  if (formData.workGroupId) {
    params.workGroupId = formData.workGroupId.map((it) => Number(it));
  }
  if (formData.grayFlag) {
    params.grayFlag = formData.grayFlag.map((it) => Number(it));
  }
  return params;
};

interface Props {
  data: TableDataList;
  setDetailData: React.Dispatch<
    React.SetStateAction<TableDataList | undefined>
  >;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  systemInfo: ExtSysItem[] | undefined;
  checkList: ColumnConfig[];
  form: FormInstance;
  buttonCheck: '0' | RiskLevel;
  mergedColumns: any;
}

const SubRiskData: React.FC<Props> = ({
  data,
  systemInfo,
  checkList,
  setOpen,
  setDetailData,
  form,
  buttonCheck,
  mergedColumns,
}) => {
  const [subTable, setSubTable] = useState<TableDataList[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const querysDetail = useMemoizedFn(async (page: number, pageSize: number) => {
    const formData = await form.validateFields();
    try {
      const _marketId = TRADING_MARKETS.find(
        (p) => p.name === data.marketId
      )?.code;
      const _filterCondition: SummaryDetailCondition = {
        extSysId: [data.extSysId],
        endTime: data.lastUpdateTime,
        ruleId: data.ruleId === -1 ? undefined : data.ruleId,
        marketId: [Number(_marketId)],
        securityCode: data.securityCode,
        baseManageAcctCode: data.baseManageAcctCode,
        baseTradeAcctCode: data.baseTradeAcctCode,
        warnOperation:
          buttonCheck === '0'
            ? [RiskLevel.NOTIP, RiskLevel.WARNING, RiskLevel.INTERCEPT]
            : [Number(buttonCheck)],
        ruleTemplateId: data.ruleId === -1 ? data.ruleTemplateId : undefined,
        securityGroupId: data.ruleId === -1 ? data.securityGroupId : undefined,
      };
      const filterCondition = transformForm(formData, _filterCondition);
      const result = await querySummaryRiskDetail({
        pageId: page,
        pageSize,
        filterCondition,
      });
      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message}`,
        // });
        setSubTable([]);
        setPagination({
          ...pagination,
          current: page,
          pageSize,
        });
        return;
      }
      if (result.data?.resultList && result.data?.resultList.length > 0) {
        const list = result.data.resultList.map((item) => ({
          ...item,
          key: uuidv4(),
        }));
        setSubTable(list);
        setPagination({
          current: page,
          pageSize,
          total: result.data?.totalSize,
        });
      } else {
        setSubTable([]);
        setPagination({
          ...pagination,
          current: page,
          pageSize,
        });
      }
    } catch (error) {}
  });

  useEffect(() => {
    querysDetail(1, pagination.pageSize);
  }, [data]);

  return (
    <div className={styles.subTable}>
      <Table
        columns={mergedColumns}
        pagination={false}
        rowKey={'key'}
        // loading={loading}
        dataSource={subTable}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              setOpen(true);
              setDetailData(record);
            },
          };
        }}
        scroll={{ y: 300 }}
        expandable={{
          expandIcon: () => {
            return '';
          },
          rowExpandable: () => true,
          expandedRowRender: () => {
            return null;
          },
          columnWidth: 100,
        }}
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
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
            paddingTop: '16px',
            paddingBottom: '16px',
          }}
          showQuickJumper={true}
          showTotal={(total) => `总数：${total}`}
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={querysDetail}
        />
      </div>
    </div>
  );
};

export default SubRiskData;
