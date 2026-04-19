import React, { type FC } from 'react';
import { HomeOutlined } from '@ht-icons/sprite-ui-react';
import { Result } from '@ht/sprite-ui';

const Welcome: FC = () => (
  <Result
    icon={<HomeOutlined />}
    title="欢迎"
    subTitle="请选择菜单功能以开始使用本系统"
  />
);

export default Welcome;
