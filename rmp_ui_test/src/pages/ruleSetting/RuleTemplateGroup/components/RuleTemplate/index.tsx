import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './styles.less';
import { Checkbox, Empty, InputNumber, Tabs, TabsProps, Tooltip } from 'antd';
import MarketTemplate, {
  IAction as MarketAction,
} from './components/MarketTemplate';
import {
  Mode,
  RiskLevel,
  RuleTypeTemplate,
  SecurityGroup,
  TemplateItem,
} from '../../type';
import { cloneDeep, isFinite } from 'lodash';
import Bigjs from 'big.js';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface IProps {
  ruleType: string;
  mode: Mode;
  template: RuleTypeTemplate;
  formTemplate: TemplateItem[];
  onRuleTypeValueChange?: (val: RuleTypeTemplate) => void;
  showScaleSetting?: boolean;
  showMarketOptions?: boolean;
  showRiskLevelOptions?: boolean;
  showMarketTabLabel?: boolean;
}

export interface IAction {
  validate: () => Promise<any>;
}

const RuleTemplate = forwardRef<IAction, IProps>(
  (
    {
      ruleType,
      mode,
      template,
      onRuleTypeValueChange,
      formTemplate,
      showScaleSetting = true,
      showMarketOptions = true,
      showRiskLevelOptions = true,
      showMarketTabLabel = true,
    },
    ref
  ) => {
    // 选中市场
    const [selectedMarket, setSelectedMarket] = useState<number[]>(
      template.defaultMarket
    );

    // 选中预警类型
    const [selectedRiskLevel, setSelectedRiskLevel] = useState(
      template.defaultWarnLevel
    );

    // 预警阈值
    const [warnValuePercent, setWarnValuePercent] = useState<number>(
      (template.warnValueDefaultPercent || 0) * 100
    );

    const ruleTemplateRef = useRef<RuleTypeTemplate>();

    const marketRefs = useRef<{ [key: string]: MarketAction }>({});

    const [renderMarket, setRenderMarket] = useState<boolean>(true);

    useEffect(() => {
      ruleTemplateRef.current = cloneDeep(template);
      // 恢复
      setSelectedMarket(template.defaultMarket);
      setSelectedRiskLevel(template.defaultWarnLevel);
      setWarnValuePercent((template.warnValueDefaultPercent || 0) * 100);
      // 强刷market模板
      setRenderMarket(false);
      setTimeout(() => setRenderMarket(true), 100);
    }, [template]);

    useEffect(() => {
      if (ruleTemplateRef.current && isFinite(warnValuePercent)) {
        ruleTemplateRef.current.defaultMarket = selectedMarket;
        ruleTemplateRef.current.defaultWarnLevel = selectedRiskLevel;
        ruleTemplateRef.current.warnValueDefaultPercent = Number(
          new Bigjs(warnValuePercent).div(100)
        );
        onRuleTypeValueChange && onRuleTypeValueChange(ruleTemplateRef.current);
      }
    }, [selectedMarket, selectedRiskLevel, warnValuePercent]);

    const handleMarketValueChange = (
      marketId: number,
      securityGroupList: SecurityGroup[]
    ) => {
      if (ruleTemplateRef.current) {
        const marketItem = ruleTemplateRef.current.marketList.find(
          (i) => i.marketId === marketId
        );
        if (marketItem) {
          marketItem.securityGroupList = securityGroupList;
        }
        onRuleTypeValueChange && onRuleTypeValueChange(ruleTemplateRef.current);
      }
    };

    const getDisabled = useMemo(() => mode === Mode.VIEW, [mode]);

    const getTabItems = useMemo<TabsProps['items']>(
      () =>
        template.marketList
          .filter((i) => selectedMarket.includes(i.marketId))
          .map((i) => ({
            label: i.marketName,
            key: i.marketId,
            forceRender: true,
            children: (
              <MarketTemplate
                ref={(marketRef) => {
                  if (marketRef) {
                    marketRefs.current[i.marketId] = marketRef;
                  }
                }}
                formTemplate={formTemplate}
                securityGroupList={i.securityGroupList}
                showWarning={
                  (mode === Mode.ADD || mode === Mode.EDIT) && showScaleSetting
                }
                onMarketValueChange={(val: SecurityGroup[]) =>
                  handleMarketValueChange(i.marketId, val)
                }
                disabled={getDisabled}
              />
            ),
          })) as unknown as TabsProps['items'],
      [template, selectedMarket, ruleType]
    );

    useImperativeHandle(
      ref,
      () => ({
        validate: () => {
          if (!isFinite(warnValuePercent)) {
            return Promise.reject(new Error('预警阈值拦截百分比不能为空'));
          }
          if (selectedMarket.length === 0 && showMarketOptions) {
            return Promise.reject(new Error('交易市场不能为空'));
          }
          if (selectedRiskLevel.length === 0 && showRiskLevelOptions) {
            return Promise.reject(new Error('请至少勾选一个风控级别'));
          }
          const promiseList = [];
          for (const key of selectedMarket) {
            const marketRef = marketRefs.current[key as any];
            promiseList.push(marketRef.validate());
          }
          return Promise.all(promiseList);
        },
      }),
      [
        selectedMarket,
        selectedRiskLevel,
        warnValuePercent,
        showRiskLevelOptions,
        showMarketOptions,
      ]
    );

    return (
      <div className={styles.content}>
        {showMarketOptions ? (
          <div className={styles.item}>
            <div className={styles.required}>交易市场：</div>
            <Checkbox.Group
              options={template.optionalMarketList.map((i) => ({
                label: i.marketName,
                value: i.marketId,
              }))}
              value={selectedMarket}
              onChange={(val) => setSelectedMarket(val)}
              disabled={getDisabled}
            />
          </div>
        ) : null}
        {showRiskLevelOptions ? (
          <div className={styles.item}>
            <div className={styles.required}>风控级别：</div>
            <Checkbox.Group
              options={template.optionalWarnLevelList}
              value={selectedRiskLevel}
              onChange={(val) => setSelectedRiskLevel(val)}
              disabled={getDisabled}
            />
            {selectedRiskLevel.includes(RiskLevel.WARNING) && (
              <div className={styles.required} style={{ display: 'flex' }}>
                预警阈值按照拦截值的：
                <InputNumber
                  style={{ width: '110px' }}
                  value={warnValuePercent}
                  suffix={'%'}
                  precision={2}
                  disabled={getDisabled}
                  min={0}
                  max={100}
                  status={isFinite(warnValuePercent) ? undefined : 'error'}
                  onChange={(val) => setWarnValuePercent(val as number)}
                />
                {isFinite(warnValuePercent) ? null : (
                  <div style={{ marginLeft: '12px', color: '#ff4d4f' }}>
                    请填写
                  </div>
                )}
                <Tooltip
                  styles={{ body: { width: '500px' } }}
                  title={
                    <div>
                      预警的各项条件阈值将按照对应的拦截阈值整体按比例调整，特别地，对于触发次数的预警阈值设定，按比例调整后，2以下的数字向上取整数；2以上的数字向下取整
                      <br />
                      示例：连续竞价虚假申报，非风险警示股的拦截阈值为：
                      <br />
                      1）实时最优5档内累计剩余有效申报数量大于100万股
                      或者金额大于1000万元，且占市场同方向最优5档剩余有效申报总量的比例大于30%
                      <br />
                      2）满足上述情形的申报大于 3次
                      <br />
                      3）累计撤销申报数量占累计申报数量的比例大于50%
                      <br />
                      4）存在反向卖出（买入）的成交次数 大于 1次
                      <br />
                      预警阈值按拦截阈值的80%，则分别为：1）80万股，800万元
                      ，27% 2） 2次 3）40% 4）1次
                    </div>
                  }
                >
                  <QuestionCircleOutlined
                    style={{ marginLeft: '8px', color: '#CBCBCB' }}
                  />
                </Tooltip>
              </div>
            )}
          </div>
        ) : null}
        <div className={styles.marketTabs}>
          {showMarketTabLabel ? (
            <div className={`${styles.required} ${styles.item}`}>拦截阈值</div>
          ) : null}
          {selectedMarket.length === 0 ? (
            <div style={{ marginTop: 100 }}>
              <Empty image={NoDataSimpleSvg} description={'暂无数据'} />
            </div>
          ) : (
            renderMarket && <Tabs type="card" items={getTabItems} />
          )}
        </div>
      </div>
    );
  }
);

export default RuleTemplate;
