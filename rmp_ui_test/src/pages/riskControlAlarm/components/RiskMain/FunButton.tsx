// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Form,
  type FormInstance,
  Tag,
  Button,
  message,
  Flex,
  Progress,
} from 'antd';
import { PaginationType } from '@/services/typing';
import style from '../../style.less';
import {
  ColumnConfig,
  exportHisRiskWarnings,
  exportRiskWarnings,
  queryFileExportUrl,
  QueryRiskWarnningsParams,
} from '@/services/riskControlAlarm';
import { downloadByUrl } from '@/utils/file';
import {
  CountType,
  TableDataList,
  transformForm,
  WaringType,
} from './RiskMain';
import { ToTopOutlined } from '@ht-icons/sprite-ui-react';
import { defalutConfig } from '../constant';
import ColManage from '@/components/ColManage';
import MaskWithCenterDiv from './ProgressPercentage';
import { RiskLevel } from '@/pages/ruleSetting/RuleTemplateGroup/type';

const percentToArray = (percentStr: string) =>
  Number(percentStr.replace('%', ''));
const FunButton = ({
  form,
  checkList,
  onFinish,
  setCheckList,
  pagination,
  loading,
  data,
  buttonCheck,
  setButtonCheck,
  waringType,
  count,
  watchType,
}: {
  form: FormInstance;
  onFinish: (page: number, pageSize: number) => void;
  pagination: PaginationType;
  loading?: boolean;
  setCheckList: React.Dispatch<React.SetStateAction<ColumnConfig[]>>;
  checkList: ColumnConfig[];
  data: TableDataList[];
  buttonCheck: '0' | RiskLevel;
  setButtonCheck: React.Dispatch<React.SetStateAction<'0' | RiskLevel>>;
  waringType: WaringType;
  count: CountType;
  watchType: WaringType;
}) => {
  const dataDisable = Form.useWatch('warnType', form);
  const [downLoading, setDownLoading] = useState(false);
  const [openMask, setOpenMask] = useState(false);
  const [expotProcess, setExpotProcess] = useState({
    fileUrl: '',
    totalSize: 0,
    progressPercentage: '0%',
  });
  const [isShowMaskButton, setIsShowMaskButton] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 清理函数
  const cleanupInterval = () => {
    if (intervalRef.current) {
      setDownLoading(false);
      setIsShowMaskButton(false);
      setOpenMask(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  useEffect(() => {
    return cleanupInterval;
  }, []);

  const progressPercentage = useMemo(() => {
    const _progressPercentage = expotProcess.progressPercentage;
    return percentToArray(_progressPercentage);
  }, [expotProcess.progressPercentage]);

  useEffect(() => {
    if (dataDisable) {
      form.setFieldValue('historyDate', null);
    }
  }, [dataDisable, form]);

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

      // if (warnType === 'historyWarn' && historyDate) {
      //   const diffInDays = historyDate[1].diff(historyDate[0], 'day');
      //   if (Number(diffInDays) + 1 > 3) {
      //     message.error('下载日期不能超过三个月');
      //     setDownLoading(false);
      //     return;
      //   }
      // }
      const result =
        warnType === 'todayWarn'
          ? await exportRiskWarnings(searchParams)
          : await exportHisRiskWarnings(searchParams);
      if (result.code !== 0) {
        setDownLoading(false);
        // message.error({ content: JSON.stringify(result.message) });
        return;
      }
      message.success('开始下载');
      setExpotProcess({
        fileUrl: '',
        totalSize: 0,
        progressPercentage: '0%',
      });
      setIsShowMaskButton(true);
      setOpenMask(true);
      const { fileId } = result?.data;
      // downloadByUrl({ url: fileUrl });
      timeInterval(fileId);
    } catch (error) {
      setDownLoading(false);
      console.error(error);
    } finally {
      // setDownLoading(false);
    }
  };

  // 开始轮询
  const timeInterval = async (id: string) => {
    const startTime = Date.now(); // 记录开始时间
    const timeoutMs = 30 * 60 * 1000; // 30分钟超时（毫秒）
    intervalRef.current = setInterval(async () => {
      try {
        if (Date.now() - startTime > timeoutMs) {
          cleanupInterval();
          message.warning('轮询已超时（30分钟）,自动停止');
          setExpotProcess({
            fileUrl: '',
            totalSize: 0,
            progressPercentage: '0%',
          });
          setDownLoading(false);
          return;
        }
        const res = await queryFileExportUrl({ fileId: id });
        if (res.errorId !== 0) {
          setDownLoading(false);
          cleanupInterval();
        }
        if (res?.data?.fileUrl) {
          setExpotProcess({
            fileUrl: res?.data?.fileUrl,
            totalSize: res?.data?.totalSize,
            progressPercentage: '100%',
          });
          setIsShowMaskButton(false);
          setOpenMask(false);
          setDownLoading(false);
          cleanupInterval();
          downloadByUrl({ url: res?.data?.fileUrl });
          // 自动下载
        } else {
          setExpotProcess({
            fileUrl: '',
            totalSize: res?.data?.totalSize,
            progressPercentage: res?.data?.progressPercentage,
          });
        }
      } catch (error) {
        setExpotProcess({
          fileUrl: '',
          totalSize: 0,
          progressPercentage: '0%',
        });
        cleanupInterval();
        setDownLoading(false);
      }
    }, 2000);
  };

  useEffect(() => {
    onFinish(1, pagination.pageSize);
  }, [buttonCheck, onFinish]);

  return (
    <div
      style={{
        paddingBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div className={style.Risktags}>
        {watchType === 'today' && (
          <>
            <Tag
              style={{
                background: '#F3ECFF ',
                color: '#8850E8',
                border: '1px solid rgba(136,80,232,0.2)',
                borderRadius: '4px 4px 4px 4px',
              }}
              onClick={() => {
                setButtonCheck(RiskLevel.NOTIP);
              }}
            >
              {buttonCheck === RiskLevel.NOTIP && (
                <span
                  style={{
                    padding: 0,
                    display: 'inline-block',
                    width: '8px', // 固定宽度6px
                    height: '8px', // 固定高度6px
                    borderRadius: '50%', // 关键：设置为50%变成圆形
                    background: '#8850E8',
                    marginRight: '4px',
                  }}
                ></span>
              )}
              一级 {count.noPromptCount}
            </Tag>
            <Tag
              style={{
                background: '#FFF2E1 ',
                color: '#F1AB4A ',
                border: '1px solid rgba(241,171,74,0.2)',
                borderRadius: '4px 4px 4px 4px',
              }}
              onClick={() => {
                setButtonCheck(RiskLevel.WARNING);
              }}
            >
              {buttonCheck === RiskLevel.WARNING && (
                <span
                  style={{
                    padding: 0,
                    display: 'inline-block',
                    width: '8px', // 固定宽度6px
                    height: '8px', // 固定高度6px
                    borderRadius: '50%', // 关键：设置为50%变成圆形
                    background: '#F1AB4A',
                    marginRight: '4px',
                  }}
                ></span>
              )}
              二级 {count.warnCount}
            </Tag>
            <Tag
              style={{
                background: '#F94736',
                color: '#FFFFFF',
                borderRadius: '4px 4px 4px 4px',
              }}
              onClick={() => {
                setButtonCheck(RiskLevel.INTERCEPT);
              }}
            >
              {buttonCheck === RiskLevel.INTERCEPT && (
                <span
                  style={{
                    padding: 0,
                    display: 'inline-block',
                    width: '8px', // 固定宽度6px
                    height: '8px', // 固定高度6px
                    borderRadius: '50%', // 关键：设置为50%变成圆形
                    background: '#fff',
                    marginRight: '4px',
                  }}
                ></span>
              )}
              三级 {count.forbidCount}
            </Tag>
            {
              <Tag
                style={{
                  background: '#E4EFFF',
                  color: '#3F88F1',
                  border: '1px solid rgba(63,136,241,0.2)',
                  borderRadius: '4px 4px 4px 4px',
                }}
                onClick={() => {
                  setButtonCheck('0');
                }}
              >
                {buttonCheck === '0' && (
                  <span
                    style={{
                      padding: 0,
                      display: 'inline-block',
                      width: '8px', // 固定宽度6px
                      height: '8px', // 固定高度6px
                      borderRadius: '50%', // 关键：设置为50%变成圆形
                      background: '#3F88F1',
                      marginRight: '4px',
                    }}
                  ></span>
                )}
                全部 {count.totalCount}
              </Tag>
            }
          </>
        )}
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button
          icon={
            <ToTopOutlined style={{ fontSize: '16px', paddingTop: '3px' }} />
          }
          type="primary"
          loading={downLoading}
          onClick={() => {
            startExport();
          }}
        >
          导出
        </Button>
        <ColManage
          columns={defalutConfig.map((i) => ({
            label: i.colName,
            value: i.key,
            disabled: !!i.disabled,
          }))}
          onColumnChange={(columns) =>
            setCheckList(
              columns.map((i) => ({
                key: i.value,
                colName: i.label,
                show: i.checked ? 1 : 0,
              }))
            )
          }
        />
      </div>
      {isShowMaskButton && (
        <div
          style={{
            position: 'absolute',
            top: '404px',
            // left: 0,
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            zIndex: '999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFF',
            boxShadow: '0px 4px 10px 0px rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
          onClick={() => {
            setOpenMask(true);
          }}
        >
          <Flex gap="small" wrap={true}>
            <Progress
              strokeColor={'#bb744a'}
              type="circle"
              percent={progressPercentage}
              size={50}
              strokeWidth={12}
            />
          </Flex>
        </div>
      )}
      <MaskWithCenterDiv
        open={openMask}
        setOpen={setOpenMask}
        totalSize={expotProcess.totalSize}
        progressPercentage={progressPercentage}
      />
    </div>
  );
};

export default FunButton;
