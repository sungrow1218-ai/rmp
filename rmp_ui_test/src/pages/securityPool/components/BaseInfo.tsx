import { useWorkGroup } from '@/hooks/useWorkGroup';
import { WorkGroupList } from '@/services/account';
import { off } from '@/utils/dom';
import { tranFromDataToOption } from '@/utils/utils';
import {
  Card,
  FormInstance,
  Form,
  Select,
  Input,
  Button,
  Descriptions,
  Divider,
} from 'antd';
import React, { useMemo } from 'react';
import { ParseDataType } from '../LeftRebuild';
import CardTitle from '@/components/CardTitle';
import styles from '../style.less';
import { SECU_POOL_TYPES, transformDictCodeToNameHelper } from '@/utils/dict';
import moment from 'moment';

interface Props {
  secuPoolInfo?: ParseDataType;
}

const getLabelSpan = (title: string) => {
  return <span style={{ textAlign: 'right', width: '85px' }}>{title}</span>;
};

const BaseInfo: React.FC<Props> = ({ secuPoolInfo }) => {
  return (
    <div className={styles.PoolBaseInfo}>
      <CardTitle title="基本信息" style={{ paddingBottom: '16px' }} />
      <Descriptions column={4} style={{ marginBottom: '14px' }}>
        <Descriptions.Item label={getLabelSpan('券池编号')}>
          {secuPoolInfo?.secuPoolId}
        </Descriptions.Item>
        <Descriptions.Item label={getLabelSpan('券池名称')}>
          {secuPoolInfo?.secuPoolName}
        </Descriptions.Item>
        <Descriptions.Item label={getLabelSpan('券池类型')}>
          {SECU_POOL_TYPES.find((p) => p.code === secuPoolInfo?.secuPoolType)
            ?.name ?? ''}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions column={4}>
        <Descriptions.Item label={getLabelSpan('创建人')}>
          {secuPoolInfo?.secuPoolCreateUserNo}
        </Descriptions.Item>
        <Descriptions.Item label={getLabelSpan('创建时间')}>
          {secuPoolInfo?.secuPoolCreateDateTime
            ? moment(secuPoolInfo?.secuPoolCreateDateTime, 'YYYYMMDD')?.format(
                'YYYY-MM-DD'
              )
            : ''}
        </Descriptions.Item>
        <Descriptions.Item label={getLabelSpan('最近更新时间')}>
          {secuPoolInfo?.secuPoolLastUpdateTime
            ? moment(secuPoolInfo?.secuPoolLastUpdateTime, 'YYYYMMDD')?.format(
                'YYYY-MM-DD'
              )
            : ''}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
    </div>
  );
};

export default BaseInfo;
