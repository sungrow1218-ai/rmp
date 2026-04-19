import { RollbackOutlined } from '@ht-icons/sprite-ui-react';
import {
  Button,
  Collapse,
  Descriptions,
  message,
  Tag,
  Typography,
} from '@ht/sprite-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { TableDataList } from '../RiskMain/RiskMain';
import styles from './style.less';
import {
  RULE_TYPE_LEVEL_2,
  TRADING_MARKETS,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import { getIsIfram, safeJsonParse } from '@/utils/utils';
import { ExtSysItem } from '@/services/account';
import { getSystemNameById } from '@/hooks/useSystemInfo';
import RiskTable from './RiskTable';
import { useMemoizedFn } from 'ahooks';
import RuleModal from '@/pages/processManage/components/ChangeDetail/RuleDetail';
import RiskInfoTable from '../RiskMain/ShowInfo/RiskTableInfo';
import { WarnRemarkData } from '@/services/riskControlAlarm';
import moment from 'moment';
import { querySecurity } from '@/services/securityInfo';
import { Popover } from 'antd';
import RiskRuleInfo from './ShowRule';
import { queryRuleSetting } from '@/services/ruleSetting';
import {
  QueryRuleSettingParam,
  QueryRuleSettingRspDTO,
} from '@/services/ruleSetting/dto';

const { Panel } = Collapse;

interface Props {
  open: boolean;
  detailData?: TableDataList;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  systemInfo: ExtSysItem[] | undefined;
}
const getLabelSpan = (title: string) => {
  return <span style={{ textAlign: 'right', width: '85px' }}>{title}</span>;
};
const isIfram = getIsIfram();

const transformStringTocode = (markName: string) => {
  const mark = TRADING_MARKETS.find((p) => p.name === markName)?.code ?? 0;
  return Number(mark);
};

const RiskDetails: React.FC<Props> = ({
  open,
  detailData,
  setOpen,
  systemInfo,
}) => {
  const [loading, setLoading] = useState(false);
  const [ruleData, setRuleData] = useState<QueryRuleSettingRspDTO>();
  const [ruleOpen, setRuleOpen] = useState(false);
  const [securityName, setSecurityName] = useState('');
  const onSearchRule = useMemoizedFn(async () => {
    try {
      if (!detailData) return;
      setLoading(true);
      const quleQueryParams: QueryRuleSettingParam = {
        pageId: 1,
        pageSize: 10,
        filterCondition: {
          ruleId: [detailData?.ruleId],
          workGroupList: [
            {
              workGroupId: detailData.workGroupId,
              ruleType: [detailData.ruleType],
            },
          ],
        },
      };

      const result = await queryRuleSetting(quleQueryParams);
      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message}`,
        // });
        return;
      }
      if (result.data?.resultList?.length) {
        setRuleData(result.data?.resultList[0]);
      } else {
        setRuleData(undefined);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (detailData) {
      onSearchRule();
    }
  }, [detailData]);

  const factorData = useMemo(() => {
    if (detailData && detailData.warnDetail) {
      const data = safeJsonParse(detailData.warnDetail);
      return data;
    }
    return null;
  }, [detailData]);
  console.log('====================================');
  console.log(factorData);
  console.log('====================================');

  useEffect(() => {
    if (detailData) {
      const fetchDefaultOptions = async () => {
        try {
          const mark = TRADING_MARKETS.find(
            (p) => p.name === detailData.marketId
          )?.code;
          const {
            data: { resultList = [] },
            code,
          } = await querySecurity({
            pageId: 1,
            pageSize: 1000,
            filterCondition: {
              securityCode: detailData.securityCode,
              marketId: mark ? [Number(mark)] : undefined,
            },
          });
          if (code !== 0) {
            throw Error('证券列表获取失败');
          }
          if (resultList && resultList.length > 0) {
            setSecurityName(resultList[0].securityName);
            return;
          } else {
            setSecurityName('');
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchDefaultOptions();
    }
  }, [detailData]);

  const timeShow = useMemo(() => {
    if (!detailData) return '';
    const warnData: WarnRemarkData = safeJsonParse(detailData?.warnDetail);
    const { warnTime, ruleType, businessDate } = detailData;

    if (warnData?.timeInterval) {
      // const [time1, time2] = warnData.timeInterval.split('-');
      // if (time1.length === 9) {
      //   const tranTime1 = moment(time1, 'HHmmssSSS').format('HH:mm:ss:SSS');
      //   const tranTime2 = moment(time2, 'HHmmssSSS').format('HH:mm:ss:SSS');
      //   return `${tranTime1} - ${tranTime2}`;
      // } else if (time1.length === 6) {
      //   const tranTime1 = moment(time1, 'HHmmss').format('HH:mm:ss');
      //   const tranTime2 = moment(time2, 'HHmmss').format('HH:mm:ss');
      //   return `${tranTime1} - ${tranTime2}`;
      // } else {
      return warnData.timeInterval;
      // }
    } else {
      const timeMonent = moment(warnTime, 'HHmmssSSS');
      const timeDateMonent = moment(String(businessDate), 'YYYYMMDD');
      return `${String(
        timeDateMonent.format('YYYY-MM-DD')
      )}  ${timeMonent.format('kk:mm:ss:SSS')}`;
    }
  }, [detailData]);

  return (
    <div
      className={styles.RiskDetails}
      style={{
        display: !open ? 'none' : '',
        height: ` ${isIfram ? 'calc(100vh - 45px)' : 'calc(100vh - 158px)'}`,
        minWidth: '1600px',
        flexDirection: 'column',
        overflowX: 'auto',
      }}
    >
      <div className={styles.title}>
        <div className={styles.titleLeft}>
          <Button
            type="default"
            onClick={() => {
              setOpen(false);
            }}
            style={{ marginRight: '8px' }}
          >
            <RollbackOutlined />
            返回
          </Button>
          <span className={styles.titleRuleName}>
            ID:
            {detailData?.ruleId === -1
              ? detailData.ruleTmplGroupId
              : detailData?.ruleId}{' '}
            {transformDictCodeToNameHelper(
              detailData?.ruleType ?? '',
              RULE_TYPE_LEVEL_2
            )}
          </span>
          <Tag
            style={{
              fontSize: '14px',
              padding: '2px 6px',
              letterSpacing: '1px',
              background: '#F3EBFF',
              borderRadius: '2px 2px 2px 2px',
              color: '#531DAB ',
              border: '1px solid #531DAB',
            }}
          >
            优先级:{ruleData?.ruleBaseInfo.rulePriority}
          </Tag>
          {detailData?.warnOperation === '预警' ? (
            <span className={styles.warnOperation}>预警</span>
          ) : detailData?.warnOperation === '禁止' ? (
            <span className={styles.warnStop}>禁止</span>
          ) : (
            <span className={styles.noTip}>不提示</span>
          )}
          <Popover
            content={
              <>
                {' '}
                <RiskRuleInfo
                  ruleType={detailData?.ruleType}
                  marketId={transformStringTocode(detailData?.marketId ?? '')}
                />{' '}
              </>
            }
          >
            <Button type="link">监管规则</Button>
          </Popover>
        </div>
      </div>
      <div className={styles.RiskDetailsMain}>
        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
          style={{
            marginBottom: '18px',
            boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.14)',
            borderRadius: '4px 4px 4px 4px',
          }}
        >
          <Panel header={<span>基础信息</span>} key="1">
            <Descriptions column={5}>
              <Descriptions.Item label={getLabelSpan('证券代码')}>
                {detailData?.securityCode}
              </Descriptions.Item>
              <Descriptions.Item label="证券名称">
                {securityName}
              </Descriptions.Item>
              <Descriptions.Item label="委托编码">
                {detailData?.entrustCode}
              </Descriptions.Item>
              {/* <Descriptions.Item label="规则实例">
                <span
                  onClick={() => {
                    setRuleOpen(true);
                  }}
                  style={{ cursor: 'pointer', color: '#bb744a' }}
                >
                  查看
                </span>
              </Descriptions.Item> */}
            </Descriptions>
            <Descriptions column={5}>
              <Descriptions.Item label={getLabelSpan('外部系统号')}>
                {getSystemNameById(detailData?.extSysId ?? -1, systemInfo)}
              </Descriptions.Item>
              <Descriptions.Item label="交易市场">
                {detailData?.marketId}
              </Descriptions.Item>
              <Descriptions.Item label="证券账号">
                {detailData?.account}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions column={4}>
              <Descriptions.Item label={getLabelSpan('计算起止时间')}>
                {timeShow}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item label={getLabelSpan('告警内容')}>
                <div style={{ width: '52%' }}>
                  <RiskInfoTable
                    ruleType={detailData?.ruleType ?? ''}
                    data={factorData}
                    record={detailData}
                  />
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>

        <Collapse
          bordered={false}
          defaultActiveKey={['2']}
          style={{
            marginBottom: '18px',
            boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.14)',
            borderRadius: '4px 4px 4px 4px',
          }}
        >
          <Panel header={<span>触警信息</span>} key="2">
            <RiskTable
              factorData={factorData}
              ruleType={detailData?.ruleType}
              entrustCode={detailData?.entrustCode ?? ''}
            />
          </Panel>
        </Collapse>
      </div>
      {ruleOpen && (
        <RuleModal data={ruleData} setOpen={setRuleOpen} authFlag={0} />
      )}
    </div>
  );
};

export default RiskDetails;
