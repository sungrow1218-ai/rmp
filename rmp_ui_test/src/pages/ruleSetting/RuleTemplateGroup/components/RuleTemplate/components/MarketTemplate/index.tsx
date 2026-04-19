import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SecurityGroup, SetType, TemplateItem } from '../../../../type';
import styles from './styles.less';
import { ExclamationCircleFilled, RightOutlined } from '@ant-design/icons';
import { Button, Collapse, ConfigProvider, Divider, InputNumber } from 'antd';
import FormTemplate, {
  IAction as FormIAction,
  ValueTyep as FormValueType,
} from '../FormTemplate';
import { cloneDeep } from 'lodash';
import IconCustomSrc from '@/assets/icon/icon_custom.png';
import IconCustomActiveSrc from '@/assets/icon/icon_custom_active.png';
import IconScaleSrc from '@/assets/icon/icon_scale.png';
import IconScaleActiveSrc from '@/assets/icon/icon_scale_active.png';
import { useGetState } from 'ahooks';

interface IProps {
  securityGroupList: SecurityGroup[];
  formTemplate: TemplateItem[];
  showWarning?: boolean;
  onMarketValueChange: (securityGroupList: SecurityGroup[]) => void;
  disabled?: boolean;
}

export interface IAction {
  validate: () => Promise<void[]>;
}

const MarketTemplate = forwardRef<IAction, IProps>(
  (
    {
      securityGroupList,
      formTemplate,
      showWarning = true,
      onMarketValueChange,
      disabled = false,
    },
    ref
  ) => {
    const [activeKey, setActiveKey] = useState<number[] | string[]>([]);
    const [securityGroups, setSecurityGroups, getSecurityGroups] = useGetState<
      SecurityGroup[]
    >([]);
    const securityGroupListRef = useRef<SecurityGroup[]>([]);

    useEffect(() => {
      setActiveKey(securityGroupList.map((i) => i.securityGroupId));
      securityGroupListRef.current = cloneDeep(securityGroupList);
      setSecurityGroups(cloneDeep(securityGroupList));
    }, [securityGroupList]);

    const [scaleValue, setScaleValue] = useState<number | null>(null);

    const formRefs = useRef<{ [key: number]: FormIAction }>({});

    // 恢复默认值
    const resetDefault = (percent?: number) => {
      for (const key of Object.keys(formRefs.current)) {
        const formRef = formRefs.current[key as any];
        formRef.setDefaultValue(percent);
      }
      setScaleValue(null);
    };

    // 数据改变
    const handleValueChange = (
      securityGroupId: number,
      values: FormValueType
    ) => {
      const securityGroup = securityGroupListRef.current.find(
        (i) => i.securityGroupId === securityGroupId
      );
      for (const key of Object.keys(values)) {
        const thresholdItem = securityGroup?.thresholdList.find(
          (i) => i.factorType === Number(key)
        );
        thresholdItem!.value = values[key].value;
        thresholdItem!.setType = values[key].setType;
      }
      setSecurityGroups(cloneDeep(securityGroupListRef.current));
      onMarketValueChange(securityGroupListRef.current);
    };

    // 图例显示标识
    const getLegend = useMemo<'scale' | 'custom'>(() => {
      const thresholdList = [];
      for (const securityGroup of getSecurityGroups()) {
        for (const item of securityGroup.thresholdList) {
          thresholdList.push(item);
        }
      }
      if (thresholdList.some((i) => i.setType === SetType.CUSTOM)) {
        return 'custom';
      } else {
        return 'scale';
      }
    }, [securityGroups]);

    useImperativeHandle(
      ref,
      () => ({
        validate: () => {
          const promiseList = [];
          for (const key of Object.keys(formRefs.current)) {
            const formRef = formRefs.current[key as any];
            promiseList.push(formRef.validate());
          }
          return Promise.all(promiseList);
        },
      }),
      []
    );

    return (
      <div className={styles.content}>
        {showWarning && (
          <div className={styles.actionBar}>
            <div className={styles.left}>
              <ExclamationCircleFilled
                style={{ fontSize: '24px', color: '#BB744A' }}
              />
              <div style={{ color: '#BB744A', margin: '0 12px' }}>
                批量调整阈值
              </div>
              <div>
                将当前市场所有阈值按
                <InputNumber
                  style={{ margin: '0 8px', width: '106px' }}
                  precision={2}
                  value={scaleValue}
                  suffix={'%'}
                  onChange={(val) => setScaleValue(val)}
                />
                进行调整
                <Button
                  style={{ marginLeft: '12px' }}
                  type="primary"
                  disabled={!scaleValue}
                  onClick={() =>
                    resetDefault(scaleValue ? scaleValue : undefined)
                  }
                >
                  应用
                </Button>
                <Button
                  style={{ marginLeft: '12px' }}
                  onClick={() => resetDefault()}
                >
                  恢复默认值
                </Button>
              </div>
              <Divider type={'vertical'} />
            </div>
            <div className={styles.legendBlock}>
              图例：
              <div className={styles.legend} style={{ marginRight: '12px' }}>
                {getLegend === 'scale' ? (
                  <img
                    src={IconScaleActiveSrc}
                    style={{
                      width: '14px',
                      height: '14px',
                      marginRight: '4px',
                    }}
                  />
                ) : (
                  <img
                    src={IconScaleSrc}
                    style={{
                      width: '14px',
                      height: '14px',
                      marginRight: '4px',
                    }}
                  />
                )}
                按比例计算
              </div>
              <div className={styles.legend}>
                {getLegend === 'custom' ? (
                  <img
                    src={IconCustomActiveSrc}
                    style={{
                      width: '14px',
                      height: '14px',
                      marginRight: '4px',
                    }}
                  />
                ) : (
                  <img
                    src={IconCustomSrc}
                    style={{
                      width: '14px',
                      height: '14px',
                      marginRight: '4px',
                    }}
                  />
                )}
                人工调整
              </div>
              <div className={styles.tip}>
                注意：此操作将要覆盖当前市场下的所有数值设置
              </div>
            </div>
          </div>
        )}
        <ConfigProvider
          theme={{
            components: {
              Collapse: {
                headerBg: '#fbfbfb',
                borderlessContentPadding: '16px',
              },
            },
          }}
        >
          <Collapse
            activeKey={activeKey}
            onChange={(keys) => setActiveKey(keys)}
            className={styles.securityGroup}
            bordered={false}
            expandIcon={({ isActive }) => (
              <RightOutlined
                rotate={isActive ? 90 : 0}
                style={{ color: '#444444', fontSize: '16px' }}
              />
            )}
            items={securityGroupList.map((i) => ({
              key: i.securityGroupId,
              label: (
                <div className={styles.blockTitle}>{i.securityGroupName}</div>
              ),
              children: (
                <FormTemplate
                  ref={(formRef) =>
                    formRef && (formRefs.current[i.securityGroupId] = formRef)
                  }
                  templates={formTemplate}
                  securityGroup={i}
                  onFormValuesChange={(val) =>
                    handleValueChange(i.securityGroupId, val)
                  }
                  disabled={disabled}
                />
              ),
            }))}
          />
        </ConfigProvider>
      </div>
    );
  }
);

export default MarketTemplate;
