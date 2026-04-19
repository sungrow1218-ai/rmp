import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Form,
  Divider,
  Radio,
  DatePicker,
  Space,
  type FormInstance,
  RadioChangeEvent,
  message,
} from 'antd';
import moment from 'moment';
import { DownOutlined, UpOutlined } from '@ht-icons/sprite-ui-react';
import type { QueryFunProps } from '@/components/Pagination/Pagination';
import {
  exportHisRiskWarnings,
  exportRiskWarnings,
  queryFileExportUrl,
  QueryRiskWarnningsParams,
} from '@/services/riskControlAlarm';
import { transformForm } from './RiskMain';
import { downloadByUrl } from '@/utils/file';
import { PaginationType } from '@/services/typing';

const { RangePicker } = DatePicker;
const SearchButton = ({
  form,
  onFinish,
  pagination,
  loading,
  isExpend,
  changeExpend,
}: {
  form: FormInstance;
  onFinish: (page: number, pageSize: number) => void;
  pagination: PaginationType;
  loading?: boolean;
  isExpend: boolean;
  changeExpend: () => void;
}) => {
  const dataDisable = Form.useWatch('warnType', form);
  const [downLoading, setDownLoading] = useState(false);
  const expotProcess = useRef({
    fileUrl: '',
    totalSize: 0,
    progressPercentage: '0%',
  });
  const resetForm = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (dataDisable) {
      form.setFieldValue('historyDate', null);
    }
  }, [dataDisable, form]);

  const disabledDate = (current: any) => {
    return current && current.isAfter(moment(), 'day');
  };
  const onValidata = (e: RadioChangeEvent) => {
    if (e.target?.value === 'todayWarn') {
      form.validateFields(['historyDate']);
    }
  };

  // 开始下载
  const startExport = async () => {
    try {
      setDownLoading(true);
      const formData = await form.validateFields();
      const filterCondition = transformForm(formData);
      const searchParams: QueryRiskWarnningsParams = {
        filterCondition,
      };

      const { warnType, historyDate } = formData;

      if (warnType === 'historyWarn' && historyDate) {
        const diffInDays = historyDate[1].diff(historyDate[0], 'day');
        if (Number(diffInDays) + 1 > 3) {
          message.error('下载日期不能超过三个月');
          return;
        }
      }
      const result =
        warnType === 'todayWarn'
          ? await exportRiskWarnings(searchParams)
          : await exportHisRiskWarnings(searchParams);
      if (result.code !== 0) {
        // message.error({ content: JSON.stringify(result.message) });
        return;
      }
      message.success('开始下载');
      const { fileId } = result?.data;
      // downloadByUrl({ url: fileUrl });
      timeInterval(fileId);
    } catch (error) {
      console.error(error);
    } finally {
      // setDownLoading(false);
    }
  };

  // 开始轮询
  const timeInterval = async (id: string) => {
    const startTime = Date.now(); // 记录开始时间
    const timeoutMs = 30 * 60 * 1000; // 30分钟超时（毫秒）
    const interval = setInterval(async () => {
      try {
        if (Date.now() - startTime > timeoutMs) {
          clearInterval(interval);
          console.warn('轮询已超时（30分钟）');
          // 可以在这里添加超时处理逻辑，比如设置错误状态
          expotProcess.current = {
            fileUrl: '',
            totalSize: 0,
            progressPercentage: '0%',
          };
          setDownLoading(false);
          return;
        }
        console.log('====================================');
        console.log(123131);
        console.log('====================================');
        const res = await queryFileExportUrl({ fileId: id });
        if (res?.data?.fileUrl) {
          expotProcess.current = {
            fileUrl: res?.data?.fileUrl,
            totalSize: res?.data?.totalSize,
            progressPercentage: '100%',
          };
          setDownLoading(false);
          clearInterval(interval);
          // downloadByUrl({ url: res?.data?.fileUrl });
          // 自动下载
        } else {
          expotProcess.current = {
            fileUrl: '',
            totalSize: res?.data?.totalSize,
            progressPercentage: res?.data?.progressPercentage,
          };
        }
      } catch (error) {
        setDownLoading(false);
        clearInterval(interval);
      }
    }, 2000);
  };

  // const doExport = async () => {
  //   try {
  //     setDownLoading(true);
  //     const formData = await form.validateFields();
  //     const filterCondition = transformForm(formData);
  //     const searchParams: QueryRiskWarnningsParams = {
  //       filterCondition,
  //     };
  //     // const diffInDays = timeData[1].diff(timeData[0], 'day');

  //     const { warnType, historyDate } = formData;

  //     if (warnType === 'historyWarn' && historyDate) {
  //       const diffInDays = historyDate[1].diff(historyDate[0], 'day');
  //       if (Number(diffInDays) + 1 > 90) {
  //         message.error('下载日期不能超过三个月');
  //         return;
  //       }
  //     }
  //     const result =
  //       warnType === 'todayWarn'
  //         ? await exportRiskWarnings(searchParams)
  //         : await exportHisRiskWarnings(searchParams);
  //     if (result.code !== 0) {
  //       message.error({ content: JSON.stringify(result.message) });
  //       return;
  //     }
  //     const { fileUrl } = result?.data;
  //     downloadByUrl({ url: fileUrl });
  //     message.success('下载成功');
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setDownLoading(false);
  //   }
  // };

  return (
    <div>
      <Form form={form}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Form.Item
              wrapperCol={{ span: 25 }}
              name="warnType"
              initialValue="todayWarn"
            >
              <Radio.Group onChange={onValidata}>
                <Radio value="todayWarn">当日触警</Radio>
                <Radio value="historyWarn">历史触警</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 20 }}
              name="historyDate"
              rules={[
                {
                  required: dataDisable === 'historyWarn',
                  message: '请输入日期',
                },
                {
                  validator: (_, timeData: any) => {
                    if (
                      timeData &&
                      timeData.length > 0 &&
                      dataDisable !== 'todayWarn'
                    ) {
                      const diffInDays = timeData[1].diff(timeData[0], 'day');
                      if (diffInDays + 1 > 92) {
                        return Promise.reject('请选择三个月之内的日期');
                      }
                      return Promise.resolve();
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <RangePicker
                disabledDate={disabledDate}
                disabled={dataDisable === 'todayWarn'}
              />
            </Form.Item>
          </Space>
          <Space>
            <Form.Item>
              <Button
                style={{
                  marginRight: '8px',
                }}
                type="link"
                onClick={changeExpend}
              >
                {isExpend ? '收起' : '展开'}
                {isExpend ? <UpOutlined /> : <DownOutlined />}
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={resetForm}>重置</Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  onFinish(1, pagination.pageSize);
                }}
              >
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                loading={loading || downLoading}
                onClick={() => {
                  startExport();
                }}
              >
                导出
              </Button>
            </Form.Item>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default SearchButton;
