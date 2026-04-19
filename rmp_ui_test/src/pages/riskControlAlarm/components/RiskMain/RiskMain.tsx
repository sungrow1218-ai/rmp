// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Form,
  Table,
  message,
  Pagination,
  Button,
  Popover,
  Badge,
  Tag,
} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { useMemoizedFn, useSize } from 'ahooks';
import {
  querySummaryRiskWarnings,
  queryHistRiskWarnnings,
  type QueryRiskWarnningsParams,
  type Condition,
  SummaryRiskList,
  ColumnConfig,
  QueryRiskWarnningsData,
} from '@/services/riskControlAlarm';
import { RULE_TYPE_LEVEL_2, transformDictCodeToNameHelper } from '@/utils/dict';
import { ExtSysItem } from '@/services/account';
import Search from './Search';
import styles from '../../style.less';
import { getIsIfram, safeJsonParse } from '@/utils/utils';
import { PaginationType } from '@/services/typing';

import FunButton from './FunButton';
import { getSystemNameById } from '@/hooks/useSystemInfo';
import {
  MinusSquareOutlined,
  PlusSquareOutlined,
} from '@ht-icons/sprite-ui-react';
import SubRiskData from './subTable';
import { colorEntrustDirection, defalutConfig } from '../constant';
import RiskInfoTable from './ShowInfo/RiskTableInfo';
import RiskInfoPop from './ShowInfo/RiskInfo';

import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { RiskLevel } from '@/pages/ruleSetting/RuleTemplateGroup/type';

const RiskLevelView = {
  [RiskLevel.NOTIP]: '一级',
  [RiskLevel.WARNING]: '二级',
  [RiskLevel.INTERCEPT]: '三级',
};

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

export interface TableDataList extends SummaryRiskList {
  key: React.Key;
}
export interface FormData {
  [key: string]: any;
  ruleId?: string; // 规则编号
  ruleType?: string[]; // 规则类型
  securityCode?: string; // 证券代码
  marketId?: string[]; // 交易市场
  warnOperation?: string[]; // 触警操作
  extSysId?: string[]; // 交易系统
  tradingPerson?: number; // 交易员
  entrustCode?: string; // 委托账户
  acctCode: string;
  warnType: string;
  historyDate?: moment.Moment[];
  workGroupId?: number[];
  grayFlag?: number[];
  entrustDirection?: number[];
}

export type CountType = {
  warnCount: number;
  forbidCount: number;
  noPromptCount: number;
  totalCount: number;
};

export const transformForm = (formData: FormData) => {
  const result: Condition = {};
  if (formData.ruleType && formData.ruleType.length > 0) {
    result.ruleType = formData.ruleType;
  }
  if (formData.securityCode?.trim()) {
    result.securityCode = formData.securityCode;
  }
  if (formData.ruleId?.trim()) {
    result.ruleId = Number(formData.ruleId);
  }
  if (formData.marketId && formData.marketId.length > 0) {
    result.marketId = formData.marketId.map((it) => Number(it));
  }
  if (formData.warnOperation && formData.warnOperation.length > 0) {
    result.warnOperation = formData.warnOperation.map((it) => Number(it));
  }
  if (formData.extSysId && formData.extSysId.length > 0) {
    result.extSysId = formData.extSysId.map((it) => Number(it));
  }
  if (formData.acctCode?.trim()) {
    result.acctCode = formData.acctCode;
  }
  if (formData.entrustCode?.trim()) {
    result.entrustCode = formData.entrustCode;
  }
  if (
    formData.historyDate &&
    formData.historyDate.length > 1 &&
    formData.warnType === 'historyWarn'
  ) {
    result.beginDate = formData.historyDate[0].format('YYYYMMDD');
    result.endDate = formData.historyDate[1].format('YYYYMMDD');
  }
  if (formData.workGroupId) {
    result.workGroupId = formData.workGroupId.map((it) => Number(it));
  }
  if (formData.grayFlag) {
    result.grayFlag = formData.grayFlag.map((it) => Number(it));
  }
  if (formData.entrustDirection) {
    result.entrustDirection = formData.entrustDirection.map((it) => Number(it));
  }
  if (formData.ruleSource) {
    result.ruleSource = Number(formData.ruleSource);
  }
  if (formData.ruleTmplGroupId) {
    result.ruleTmplGroupId = Number(formData.ruleTmplGroupId);
  }
  if (formData) return result;
};

// 对文字根据符号换行展示
export const rentderStr = (value: string, symbols: string) => {
  if (!value) return '';
  const items = value.split(symbols).map((p, i) => (
    <React.Fragment key={i}>
      {p}
      {i < value.split(symbols).length - 1 && <br />}
    </React.Fragment>
  ));
  return <div>{items}</div>;
};

interface Props {
  open: boolean;
  setDetailData: React.Dispatch<
    React.SetStateAction<TableDataList | undefined>
  >;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  systemInfo: ExtSysItem[] | undefined;
}

export type WaringType = 'today' | 'history';

const RiskMain: React.FC<Props> = ({
  open,
  setDetailData,
  setOpen,
  systemInfo,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<TableDataList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [checkList, setCheckList] = useState<ColumnConfig[]>([
    ...defalutConfig,
  ]);
  const [waringType, setWaringType] = useState<WaringType>('today'); // today
  const [watchType, setWatchType] = useState<WaringType>('today');
  const [buttonCheck, setButtonCheck] = useState<'0' | RiskLevel>('0');
  const [count, setCount] = useState<CountType>({
    warnCount: 0,
    forbidCount: 0,
    noPromptCount: 0,
    totalCount: 0,
  });
  const [columns, setColumns] = useState<any[]>([]);
  const [openMask, setOpenMask] = useState(true);

  const columnsWidthMap = useRef<{ [key: string]: number }>({});
  useEffect(() => {
    const columnsDefault: any[] = [
      {
        title: '业务日期',
        key: 'businessDate',
        dataIndex: 'businessDate',
        width: 120,
        minWidth: 120,
        render(value: any) {
          const timeMonent = moment(String(value), 'YYYYMMDD');
          if (timeMonent.isValid()) {
            return <div>{timeMonent.format('YYYY-MM-DD')}</div>;
          }
          return null;
        },
      },
      {
        title: '触警时间',
        dataIndex: 'warnTime',
        key: 'warnTime',
        width: 130,
        minWidth: 130,
        render: (value: any) => {
          const timeMonent = moment(value, 'HHmmssSSS');
          if (timeMonent.isValid()) {
            return <div>{timeMonent.format('kk:mm:ss:SSS')}</div>;
          }
          return null;
        },
      },
      {
        title: '触警对象',
        dataIndex: 'ruleSource',
        key: 'ruleSource',
        width: 100,
        minWidth: 100,
        render: (_: any, record: TableDataList) => {
          const value = record.ruleId;
          if (value === -1) {
            return '规则模板';
          }
          return '单规则';
        },
      },
      {
        title: '所属编号',
        dataIndex: 'ruleId',
        key: 'ruleId',
        width: 100,
        minWidth: 100,
        render: (_: any, record: TableDataList) => {
          const value = record.ruleId;
          const groupValue = record.ruleTmplGroupId;
          if (value === -1) {
            return groupValue;
          } else {
            return value;
          }
        },
      },
      {
        title: '所属名称',
        dataIndex: 'ruleName',
        key: 'ruleName',
        width: 200,
        minWidth: 200,
        ellipsis: true,
        render: (_: any, record: TableDataList) => {
          const value = record.ruleId;
          const groupName = record.ruleTmplGroupName;
          const { ruleName } = record;
          if (value === -1) {
            return groupName;
          } else {
            return ruleName;
          }
        },
      },
      {
        title: '规则类型',
        dataIndex: 'ruleType',
        key: 'ruleType',
        width: 200,
        minWidth: 200,
        ellipsis: true,
        render: (_: any, record: TableDataList) => {
          const value = record.ruleType;
          return transformDictCodeToNameHelper(value, RULE_TYPE_LEVEL_2);
        },
      },

      {
        title: '证券代码',
        width: 110,
        minWidth: 110,
        key: 'securityCode',
        dataIndex: 'securityCode',
      },
      {
        title: '委托方向',
        width: 120,
        minWidth: 120,
        key: 'entrustDirection',
        dataIndex: 'entrustDirection',
        render: (value: any) => {
          const objValue = colorEntrustDirection.find(
            (p) => p.EntrustName === value
          );
          return (
            <div>
              {objValue?.color === 1 ? (
                <span style={{ color: '#F94736' }}>{value}</span>
              ) : (
                <span style={{ color: '#7DCB59' }}>{value}</span>
              )}
            </div>
          );
        },
      },
      {
        title: '触警操作',
        width: 120,
        minWidth: 120,
        key: 'warnOperation',
        dataIndex: 'warnOperation',
        render: (value: any, record: Recordable) => {
          const stylesMap = {
            [RiskLevel.NOTIP]: styles.noTip,
            [RiskLevel.WARNING]: styles.warnOperation,
            [RiskLevel.INTERCEPT]: styles.warnStop,
          };
          return (
            <div>
              <span
                className={stylesMap[record.warningOperationCode as RiskLevel]}
              >
                {RiskLevelView[record.warningOperationCode as RiskLevel]}
              </span>
            </div>
          );
        },
      },
      {
        title: '触警说明',
        dataIndex: 'remark',
        width: 250,
        minWidth: 250,
        key: 'remark',
        render: (_: any, record: TableDataList) => {
          const { ruleType, warnDetail } = record;
          let warnData;
          try {
            warnData = safeJsonParse(warnDetail);
          } catch (error) {
            message.error('解析触警失败');
            return;
          }
          return (
            <>
              <Popover
                placement="top"
                getPopupContainer={() => document.body}
                content={
                  <RiskInfoPop
                    ruleType={ruleType}
                    data={warnData}
                    record={record}
                  />
                }
              >
                <div
                  className={styles.noWarp}
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  <RiskInfoTable
                    ruleType={ruleType}
                    data={warnData}
                    record={record}
                  />
                </div>
              </Popover>
            </>
          );
        },
      },
      {
        title: '外部系统号',
        dataIndex: 'extSysId',
        key: 'extSysId',
        width: 110,
        minWidth: 110,
        render: (value: any) => {
          return getSystemNameById(value, systemInfo);
        },
      },
      {
        title: '交易市场',
        dataIndex: 'marketId',
        key: 'marketId',
        width: 110,
        minWidth: 110,
        ellipsis: true,
      },
      {
        title: '委托编码',
        width: 110,
        minWidth: 110,
        key: 'entrustCode',
        dataIndex: 'entrustCode',
        ellipsis: true,
        render: (value: any, record: TableDataList) => {
          return (
            <>
              <Popover
                placement="top"
                content={<div>{record.entrustCode}</div>}
              >
                <div
                  className={styles.noWarp}
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  {value}
                </div>
              </Popover>
            </>
          );
        },
      },
      {
        title: '账户',
        dataIndex: 'account',
        key: 'account',
        width: 250,
        minWidth: 250,
        render: (value: any) => {
          return (
            <>
              <Popover
                placement="top"
                content={<div>{rentderStr(value, ';')}</div>}
              >
                <div
                  className={styles.noWarp}
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  {value}
                </div>
              </Popover>
            </>
          );
        },
      },
      {
        title: '灰度标志',
        width: 100,
        minWidth: 100,
        key: 'grayFlag',
        dataIndex: 'grayFlag',
        render: (value: any) => {
          return (
            <div>
              {value === '正式' ? (
                <Badge
                  color="#3F88F1"
                  text={<span style={{ color: '#3F88F1' }}>正式</span>}
                />
              ) : (
                <Badge
                  color="#999ba0"
                  text={<span style={{ color: '#999ba0' }}>灰度</span>}
                />
              )}
            </div>
          );
        },
      },
    ];

    const result = [];
    const showColumns = checkList.filter((p) => p.show === 1).map((q) => q.key);
    for (const item of columnsDefault) {
      if (!columnsWidthMap.current[item.dataIndex]) {
        columnsWidthMap.current[item.dataIndex] = item.width;
      }
      if (showColumns.includes(item.dataIndex)) {
        result.push({
          ...item,
          width: columnsWidthMap.current[item.dataIndex],
        });
      }
    }

    result.push({
      title: '操作',
      dataIndex: 'do',
      minWidth: 120,
      width: 120,
      render: (_: any, record: TableDataList) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setOpen(true);
              setDetailData(record);
            }}
          >
            触警详情
          </Button>
        );
      },
    });
    setColumns(result);
  }, [checkList, systemInfo]);

  const handleResize = useCallback(
    (index: number) =>
      (_e: any, { size }: { size: { width: number; height: number } }) => {
        const nextColumns = [...columns];
        const finalWidth = Math.max(nextColumns[index].minWidth!, size.width);
        nextColumns[index] = {
          ...nextColumns[index],
          width: finalWidth,
        };
        columnsWidthMap.current[nextColumns[index].dataIndex] = size.width;
        setColumns(nextColumns);
      },
    [columns]
  );
  const mergedColumns = useMemo(
    () =>
      columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column: any) => ({
          width: column.width,
          onResize: handleResize(index),
          minWidth: column.minWidth,
        }),
      })),
    [columns]
  );
  // 查询函数
  const onFinish = useMemoizedFn(async (page: number, pageSize: number) => {
    const formData: FormData = await form.validateFields();
    try {
      setLoading(true);
      const _warnType = formData.warnType;
      if (_warnType === 'todayWarn') {
        setWaringType('today');
      } else {
        setWaringType('history');
      }
      let filterCondition = transformForm(formData);

      if (waringType === 'today') {
        if (buttonCheck !== '0') {
          filterCondition = {
            ...filterCondition,
            warnOperation: [Number(buttonCheck)],
          };
        }
      }

      const searchParams: QueryRiskWarnningsParams = {
        pageId: page,
        pageSize,
        filterCondition,
      };

      const result =
        _warnType === 'todayWarn'
          ? await querySummaryRiskWarnings(searchParams)
          : await queryHistRiskWarnnings(searchParams);

      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message}`,
        // });
        setData([]);
        setPagination({
          ...pagination,
          current: page,
          pageSize,
          total: 0,
        });
        return;
      }
      const kindCount = result?.data as QueryRiskWarnningsData;
      setCount({
        warnCount: kindCount?.warnCount ?? 0,
        forbidCount: kindCount?.forbidCount ?? 0,
        noPromptCount: kindCount?.noPromptCount ?? 0,
        totalCount: kindCount?.totalCount ?? 0,
      });

      if (result.data?.resultList && result.data?.resultList.length > 0) {
        const list = result.data.resultList.map((item) => ({
          ...item,
          key: uuidv4(),
        }));
        setData(list);
        setPagination({
          current: page,
          pageSize,
          total: result.data?.totalSize,
        });
      } else {
        setData([]);
        setPagination({
          current: page,
          pageSize,
          total: result.data?.totalSize ?? 0,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    onFinish(1, pagination.pageSize);
  }, []);

  const isSummaryRecord = useMemo(() => {
    if (data && data.length > 0) {
      const isHave = data.some((p) => p.totalSize > 1);
      return isHave;
    }
    return false;
  }, [data]);

  useEffect(() => {
    setData([]);
    setCount({
      warnCount: 0,
      forbidCount: 0,
      noPromptCount: 0,
      totalCount: 0,
    });
    setButtonCheck('0');
    setPagination({
      ...pagination,
      current: 1,
      total: 0,
    });
  }, [watchType]);

  // 自定义table展开图标
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const expandIcon = ({ expanded, onExpand, record }: any) => {
    const isExpanded = expandedKeys.includes(record.key);

    // 处理点击事件
    const handleClick = (e: any) => {
      e.stopPropagation();
      // 更新展开状态（切换当前行的展开/折叠）
      if (isExpanded) {
        setExpandedKeys(expandedKeys.filter((key) => key !== record.key));
      } else {
        setExpandedKeys([...expandedKeys, record.key]);
      }
    };
    const tag1 = () => {
      return (
        <span>
          <Tag
            style={{
              background: 'rgba(187,116,74,0.15)',
              opacity: 1,
              color: '#BB744A',
              fontSize: '10px',
            }}
          >
            {record.totalSize}
          </Tag>
        </span>
      );
    };

    return (
      <div>
        {waringType === 'today' &&
        checkList.some((p) => p.show === 1) &&
        record.totalSize &&
        record.totalSize > 1 ? (
          <Button
            size="small"
            type="link"
            onClick={handleClick}
            icon={isExpanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
          >
            {tag1()}
          </Button>
        ) : null}
      </div>
    );
  };

  const carRef = useRef(null);
  const size = useSize(carRef);
  const isIfram = getIsIfram();
  return (
    <div
      className={styles.riskMain}
      style={{
        height: ` ${isIfram ? 'calc(100vh - 45px)' : 'calc(100vh - 158px)'}`,
        display: open ? 'none' : 'flex',
        minWidth: '1600px',
        justifyContent: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <span
        style={{
          fontSize: '18px',
          fontWeight: 600,
          letterSpacing: '1px',
          paddingBottom: '16px',
        }}
      >
        触警信息查询
      </span>
      <Search
        form={form}
        loading={loading}
        onFinish={onFinish}
        pagination={pagination}
        setWatchType={setWatchType}
        setButtonCheck={setButtonCheck}
      />
      <div className={styles.tableBase} ref={carRef}>
        <FunButton
          loading={loading}
          form={form}
          onFinish={onFinish}
          watchType={watchType}
          pagination={pagination}
          checkList={checkList}
          setCheckList={setCheckList}
          data={data}
          waringType={waringType}
          buttonCheck={buttonCheck}
          setButtonCheck={setButtonCheck}
          count={count}
        />
        <div className={styles.tableData}>
          <Table
            columns={mergedColumns}
            scroll={{
              y: size ? Number(size?.height) - 200 : 500,
              x: '100%',
            }}
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  setOpen(true);
                  setDetailData(record);
                },
              };
            }}
            expandable={{
              expandIcon,
              rowExpandable: (record) => {
                return record.totalSize > 1;
              },
              expandedRowRender: (record) => (
                <SubRiskData
                  setOpen={setOpen}
                  setDetailData={setDetailData}
                  checkList={checkList}
                  data={record}
                  systemInfo={systemInfo}
                  form={form}
                  mergedColumns={mergedColumns}
                  buttonCheck={buttonCheck}
                />
              ),
              expandedRowKeys: expandedKeys,
              columnWidth: waringType === 'today' && isSummaryRecord ? 100 : 0,
            }}
            pagination={false}
            rowKey={'key'}
            loading={loading}
            dataSource={data || []}
            components={{
              header: {
                cell: ResizableTitle,
              },
            }}
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
              paddingTop: '5px',
            }}
            showQuickJumper={true}
            showTotal={(total) => `总数：${total}`}
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={onFinish}
          />
        </div>
      </div>
    </div>
  );
};

export default RiskMain;
