import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.less';
import SearchMain from './SearchMain';
import { Button, message, Form, Space } from '@ht/sprite-ui';
import { getUrlParams } from './contant/contants';
import { useMemoizedFn, useSize } from 'ahooks';
import DetailModal from './components/DetailModal';
import {
  ProcessListData,
  queryMyProcessList,
  queryProcessList,
} from '@/services/process';
import moment from 'moment';
import { isArray } from 'lodash';
import { PaginationType } from '@/services/typing';
import TableData from './components/ProcessTable';
import WarnModal from './components/WarnModal';
import { eventBus } from '@/event-bus';
import { useLocation } from '@oula/oula';
import withKeepAlive from '@/wrappers/KeepAlive';
import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import { getIsIfram } from '@/utils/utils';
// import DetailModal from './components/DetailModal';

const ProcessWrap = () => {
  const [data, setData] = useState<ProcessListData[]>([]);
  const [loading, setLoading] = useState(false);
  const [visble, setVisble] = useState(false);
  const [selectRow, setSelectRow] = useState<ProcessListData | null>(null);
  const [form] = Form.useForm();
  const [eipAble, setEipAble] = useState(0); // 0正常 1eip展示弹窗  2 EipNew
  const [warning, setWarning] = useState(false);
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [mode, setMode] = useState('EDIT'); // 预览PREVIEW   处理EDIT
  const [searchType, setSearchType] = useState(-1); // 0搜索按钮搜索  0全部流程, 2我的发起 3我的审批
  const domRef = useRef(null);
  const location = useLocation();
  const sizes = useSize(domRef);
  const isHandPend = useRef(true);

  const fetchData = useMemoizedFn(
    async (page: number, pageSize: number, isbtntype?: boolean) => {
      const formData = await form.validateFields();
      try {
        setLoading(true);
        isHandPend.current = true;
        let filterCondition: { [key: string]: any } = {};

        if (formData.creatTime && formData.creatTime.length > 0) {
          const startTime = moment(formData.creatTime[0]).format('YYYY-MM-DD');
          const endTime = moment(formData.creatTime[1]).format('YYYY-MM-DD');
          filterCondition.createStartTime = `${startTime} 00:00:00`;
          filterCondition.createEndTime = `${endTime} 23:59:59`;
        }
        if (formData.finshTime && formData.finshTime.length > 0) {
          const startTime = moment(formData.finshTime[0]).format('YYYY-MM-DD');
          const endTime = moment(formData.finshTime[1]).format('YYYY-MM-DD');
          filterCondition.finishStartTime = `${startTime} 00:00:00`;
          filterCondition.finishEndTime = `${endTime} 23:59:59`;
        }

        for (const key of Object.keys(formData)) {
          if (
            formData[key] &&
            key !== 'creatTime' &&
            key !== 'finshTime' &&
            key !== 'procedureType'
          ) {
            filterCondition[key] = formData[key].trim();
          }
          if (key === 'procedureType') {
            filterCondition[key] = formData[key];
          }
        }
        if (isbtntype) {
          filterCondition = {};
        }
        const res = await queryProcessList({
          pageId: page,
          pageSize,
          filterCondition,
        });
        if (res.code === 0) {
          if (isArray(res.data.resultList)) {
            setData(res.data.resultList);
            setSelectRow(res.data.resultList[0]);
          } else {
            setData([]);
          }
          setPagination({
            current: page,
            pageSize,
            total: res?.data?.totalSize,
          });
        } else {
          // message.error(res.message);
        }
      } catch (error) {
        // message.error({ content: JSON.stringify(error) });
      } finally {
        if (isHandPend) {
          eventBus.emit('data-updated', { message: '数据更新' });
          isHandPend.current = false;
        }
        setLoading(false);
      }
    }
  );

  const fetchMyList = useMemoizedFn(async (page: number, pageSize: number) => {
    try {
      isHandPend.current = true;
      setLoading(true);
      const action = searchType === 2 ? 2 : searchType === 3 ? 1 : 0;
      const res = await queryMyProcessList({
        pageId: page,
        pageSize,
        filterCondition: { action },
      });
      if (res.code === 0) {
        if (isArray(res.data.resultList)) {
          setData(res.data.resultList);
        } else {
          setData([]);
        }
        setPagination({
          current: page,
          pageSize,
          total: res?.data?.totalSize,
        });
      } else {
        // message.error(res.message);
      }
    } catch (error) {
      // message.error({ content: JSON.stringify(error) });
    } finally {
      if (isHandPend) {
        eventBus.emit('data-updated', { message: '数据更新' });
        isHandPend.current = false;
      }
      setLoading(false);
    }
  });

  const fetchEip = async (processInstanceId: string) => {
    try {
      setLoading(true);
      if (!processInstanceId) {
        return;
      }

      const res = await queryProcessList({
        pageId: 1,
        pageSize: pagination.pageSize,
        filterCondition: {
          procedureCode: processInstanceId,
        },
      });

      if (res.code === 0) {
        if (isArray(res.data.resultList)) {
          setData(res.data.resultList);
          setSelectRow(res.data?.resultList[0]);
          if (res.data?.resultList[0]) {
            setVisble(true);
          }
        } else {
          setData([]);
        }
        setPagination({
          current: 1,
          pageSize: pagination.pageSize,
          total: res?.data?.totalSize,
        });
      } else {
        // message.error(res.message);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleRest = () => {
    form.resetFields();
  };

  const handleDetail = (record: any) => {
    setSelectRow(record);
    setVisble(true);
  };

  const refetch = () => {
    if (searchType === 0) {
      fetchData(1, pagination.pageSize);
    } else {
      fetchMyList(1, pagination.pageSize);
    }
  };

  useEffect(() => {
    const url = window.location.href;
    const params = getUrlParams(url);
    const eip1 = url.includes('eip');
    const eipdev = url.includes('eipdev');
    const eipnew = url.includes('eipnew');
    const eipsit = url.includes('eipsit');
    const eipuat = url.includes('eipuat');
    const okEip = eipnew || eipsit || eipuat;
    const eip = eipdev || eip1;
    if (eip && !okEip) {
      setMode('PREVIEW');
      setEipAble(1);
      if (params?.processInstanceId) {
        fetchEip(params.processInstanceId);
        setWarning(true);
      } else if (params.myList) {
        setSearchType(3);
      } else {
        setSearchType(0);
        fetchData(1, pagination.pageSize);
      }
    } else if (okEip && params?.processInstanceId) {
      setEipAble(2);
      fetchEip(params.processInstanceId);
    } else {
      setEipAble(0);
      if (params.myList) {
        setSearchType(3);
      } else {
        setSearchType(0);
        fetchData(1, pagination.pageSize);
      }
    }
  }, []);

  const handleClose = () => {
    setVisble(false);
    // selectRow();
  };

  useEffect(() => {
    if (searchType === 2 || searchType === 3) {
      form.resetFields();
      handleRest();
      fetchMyList(1, pagination.pageSize);
    } else if (searchType === 0) {
      fetchData(1, pagination.pageSize, true);
    }
  }, [searchType]);

  useEffect(() => {
    const url = window.location.href;
    const { myList } = getUrlParams(url);
    if (Number(myList) === 1) {
      setSearchType(3);
    }
  }, [location]);

  const enterSearch = () => {
    setSearchType(-1);
    fetchData(1, pagination.pageSize);
  };

  const isIfram = getIsIfram();

  return (
    <div
      className={`${styles.processWrap} ${isIfram ? styles.isIfram : ''}`}
      ref={domRef}
    >
      <div className={styles.searchWrap}>
        <SearchMain form={form} enterSearch={enterSearch} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div>
            <Space style={{ marginLeft: '20px' }}>
              <span>快捷查询：</span>
              <Button
                onClick={() => {
                  form.resetFields();
                  setSearchType(0);
                }}
                type={searchType === 0 ? 'primary' : 'default'}
              >
                全部流程
              </Button>
              <Button
                onClick={() => {
                  setSearchType(2);
                }}
                type={searchType === 2 ? 'primary' : 'default'}
              >
                我发起的
              </Button>
              <Button
                onClick={() => {
                  setSearchType(3);
                }}
                type={searchType === 3 ? 'primary' : 'default'}
              >
                我的待办
              </Button>
            </Space>
          </div>
          <div>
            <Button onClick={handleRest} style={{ marginRight: '15px' }}>
              重置
            </Button>
            <Button
              onClick={() => {
                setSearchType(-1);
                fetchData(1, pagination.pageSize);
              }}
              type="primary"
            >
              查询
            </Button>
          </div>
        </div>
      </div>
      <TableData
        eipAble={eipAble}
        setMode={setMode}
        tableData={data}
        tableLoading={loading}
        onSearch={fetchData}
        onMySearch={fetchMyList}
        size={sizes?.height}
        pagination={pagination}
        handleDetail={handleDetail}
        searchType={searchType}
      />

      <DetailModal
        mode={mode}
        visible={visble}
        record={selectRow}
        onClose={handleClose}
        eipAble={eipAble}
        refetch={refetch}
      />
      <WarnModal open={warning} setOpen={setWarning} />
    </div>
  );
};
export default withKeepAlive({
  cacheKey: KEEPALIVE_CACHE_KEY.PROCESS_MANAGE,
})(ProcessWrap);
