import React, { FC, useMemo, useState } from 'react';
import styles from './styles.less';
import {
  Badge,
  Col,
  Popover,
  Row,
  Space,
  Steps,
  Typography,
} from '@ht/sprite-ui';
import { DoingProps } from '../../contant/typing';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ht-icons/sprite-ui-react';
import moment from 'moment';
import StepImg from '@/assets/process/step.png';
import { v4 as uuidv4 } from 'uuid';
import { getPopupContainer } from '@/utils/dom';

const { Step } = Steps;
const { Text } = Typography;
const Doing: FC<DoingProps> = ({ defaultValues }) => {
  const spendTime = useMemo(() => {
    const format = 'YYYY-MM-DD HH:mm:ss';
    const startTime = moment(defaultValues?.createTime, format).valueOf();
    const endtime = defaultValues?.finishTime
      ? moment(defaultValues?.finishTime, format).valueOf()
      : moment().valueOf();
    const time = endtime - startTime;
    // 将时间差转换为秒

    const totalSeconds = Math.floor(time / 1000);

    // 计算小时、分钟和秒
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSecondsAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60);
    const seconds = remainingSecondsAfterHours % 60;
    const isHour = isNaN(hours) ? `--` : hours;
    const isMinutes = isNaN(minutes) ? `--` : minutes;
    const isMeconds = isNaN(seconds) ? `--` : seconds;
    // const formattedDiff = `${isHour}时${isHour}分${isMeconds}秒`;
    return { isHour, isMinutes, isMeconds };
  }, [defaultValues]);

  const status = useMemo(() => {
    if (defaultValues) {
      return defaultValues.busiStatus;
    }
    return 1;
  }, [defaultValues]);
  return (
    <div className={styles.doing}>
      <div style={{ margin: '20px 0' }}>
        {defaultValues?.busiStatus === 1 ? (
          <div style={{ marginLeft: '16px' }}>
            <Space>
              <ClockCircleOutlined
                style={{ color: '#255FF2', fontSize: '25px' }}
              />
              <Text strong={true} style={{ color: '#255FF2' }}>
                进行中
              </Text>
            </Space>
          </div>
        ) : (
          <div style={{ marginLeft: '16px' }}>
            <Space>
              <CheckCircleOutlined
                style={{ color: '#52C41A', fontSize: '25px' }}
              />
              <Text strong={true} style={{ color: '#52C41A' }}>
                已完成
              </Text>
            </Space>
          </div>
        )}
      </div>

      <div className={styles.first}>
        <Steps direction="vertical">
          <Step
            icon={<CheckCircleOutlined style={{ color: '#52C41A' }} />}
            status="finish"
            title={<div>已创建</div>}
          />
          <Step
            icon={
              status === 1 ? (
                <ClockCircleOutlined style={{ color: '#255FF2' }} />
              ) : (
                <CheckCircleOutlined style={{ color: '#52C41A' }} />
              )
            }
            title={
              <div style={{ display: 'flex' }}>
                <span style={{ color: 'rgba(29, 34, 44, 0.85)' }}>
                  {status === 1
                    ? '处理中'
                    : status === 4
                    ? '已撤销'
                    : status === 2
                    ? '审批通过'
                    : '审批驳回'}
                </span>
              </div>
            }
            description={
              defaultValues?.busiStatus === 1 ? (
                <div className={styles.space}>
                  <Row>
                    <Text style={{ paddingBottom: '10px', color: '#bb744a' }}>
                      当前处理人 :
                    </Text>
                  </Row>
                  <Row>
                    {defaultValues?.currentProcessors.map((ap, index) => {
                      if (index < 11) {
                        return (
                          <Col span={12} key={uuidv4()}>
                            <div className={styles.wrap}>
                              <div
                                style={{
                                  color: '#bb744a',
                                  display: 'flex',
                                  alignSelf: 'center',
                                }}
                              >
                                <div className={styles.person}></div>
                                <div
                                  style={{
                                    width: '100px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    lineHeight: '30px',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {' '}
                                  {ap}
                                </div>
                              </div>
                            </div>
                          </Col>
                        );
                      }
                      if (index === 11) {
                        return (
                          <Popover
                            getPopupContainer={getPopupContainer}
                            content={defaultValues?.currentProcessors
                              .slice(11)
                              .map((p, i) => {
                                return (
                                  <div
                                    key={uuidv4()}
                                    style={{
                                      color: '#bb744a',
                                      display: 'flex',
                                      alignSelf: 'center',
                                    }}
                                  >
                                    <div> {p}</div>
                                  </div>
                                );
                              })}
                          >
                            <div style={{ marginLeft: '10px' }}>......</div>
                          </Popover>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </Row>
                </div>
              ) : (
                <div className={styles.currentBot}>{`处理人 :  ${
                  defaultValues?.currentProcessors[0] ?? ''
                } `}</div>
              )
            }
          />
          {status === 1 && (
            <Step
              status="finish"
              icon={
                <img
                  style={{ width: '25px', height: '25px' }}
                  src={StepImg}
                ></img>
              }
              title={<div>......</div>}
            />
          )}
          {status === 2 && (
            <Step
              status="finish"
              icon={
                !defaultValues?.errorInfo ? (
                  <CheckCircleOutlined style={{ color: '#52C41A' }} />
                ) : (
                  <CloseCircleOutlined style={{ color: '#FF4D4F' }} />
                )
              }
              title={
                <div>
                  {defaultValues?.errorInfo ? '变更未生效' : '变更已生效'}
                </div>
              }
              description={
                <div className={styles.space}>
                  {defaultValues?.errorInfo ? (
                    <Text
                      style={{
                        display: 'inline-block',
                        width: '260px',
                        paddingBottom: '10px',
                        color: '#bb744a',
                      }}
                    >
                      报错原因 : {defaultValues?.errorInfo}
                    </Text>
                  ) : null}
                </div>
              }
            />
          )}
        </Steps>
        <div style={{ marginTop: '30px' }}>
          <Text
            style={{
              paddingLeft: '15px',
              paddingRight: '15px',
              color: '#979797',
            }}
          >
            已用时 :
          </Text>
          <Text className={styles.wrap}>
            <span style={{ color: '#bb744a' }}>{spendTime.isHour}</span> 小时{' '}
            <span style={{ color: '#bb744a' }}>{spendTime.isMinutes} </span>{' '}
            分钟{' '}
          </Text>
        </div>
      </div>
    </div>
  );
};
export default Doing;
